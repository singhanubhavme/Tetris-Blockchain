import React, { useEffect, useState } from "react";
import Menu from "./Menu";
import Tetris from "./Tetris";
import { useGameOver } from "../hooks/useGameOver";
import { useNotification } from "web3uikit";
import SetupContract from "./SetupContract";
import { Bell } from '@web3uikit/icons'
const ethers = require("ethers");
let tetrisContract;
const Game = ({ rows, columns }) => {
    const [skipCount, setSkipCount] = useState(true);
    const [highestStats, setHighestStats] = useState({});
    const [currentScore, setCurrentScore] = useState({});
    const [isButtonDisabled, setisButtonDisabled] = useState(false);

    const dispatch = useNotification();

    const handleNotification = (type, msg) => {
        dispatch({
            type: type,
            message: msg,
            title: "Tx Notification",
            position: "bottomL",
            icon: <Bell fontSize='35px' />
        })
    }

    const [gameOver, setGameOver, resetGameOver] = useGameOver();
    const [entryFee, setEntryFee] = useState(0);

    useEffect(() => {
        (async function () {
            tetrisContract = await SetupContract();
            const highestScore = await tetrisContract.getHighestStats();
            setHighestStats({
                player: highestScore[0],
                level: highestScore[1],
                score: (highestScore[2].toString())
            });
            const entryFee = await tetrisContract.getEntryFees();
            const ethEntryFee = ethers.utils.formatEther(entryFee);
            setEntryFee(ethEntryFee);
        }
        )();
    }, []);

    const start = async () => {
        if (entryFee > 0) {
            tetrisContract.enterGame({ value: entryFee * 1e18 })
                .then((tx) => {
                    setisButtonDisabled(true);
                    handleNotification('info', 'Transaction Pending Please Wait!');
                    return tx;
                })
                .then((tx) => tx.wait(1))
                .then(() => {
                    handleNotification('info', 'Transaction Complete!');
                    resetGameOver();
                    setisButtonDisabled(false);
                })
                .catch(() => handleNotification('error', 'Transaction Failed!'));
        } else {
            handleNotification('info', 'Please Wait while we load the game!!');
        }
    }

    useEffect(() => {
        if (skipCount) setSkipCount(false);
        if (!skipCount) {
            (async function () {
                if (gameOver) {
                    if (currentScore.level >= highestStats.level && currentScore.score > highestStats.score) {
                        tetrisContract.setHighestStats(currentScore.level, currentScore.score)
                            .then((tx) => {
                                handleNotification('info', 'Transaction Pending Please Wait!');
                                return tx;
                            })
                            .then((tx) => tx.wait(1))
                            .then(() => {
                                handleNotification('info', 'Transaction Complete!');
                            })
                            .catch(() => handleNotification('error', 'Transaction Failed!'))
                    }
                }
            })();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gameOver])

    function claimBalance() {
        tetrisContract.claimEthers()
            .then((tx) => {
                handleNotification('info', 'Transaction Pending Please Wait!');
                setisButtonDisabled(true);
                return tx;
            })
            .then((tx) => tx.wait(1))
            .then(() => {
                handleNotification('info', 'Transaction Complete!');
                setisButtonDisabled(false);
            })
            .catch(() => handleNotification('error', 'Transaction Failed!'))
    }

    return (
        <div className="Game">
            {gameOver ? (
                <React.Fragment>
                    <Menu text={'Start Game'} onClick={start} isButtonDisabled={isButtonDisabled} />
                    <Menu text={'Claim Balance'} onClick={claimBalance} isButtonDisabled={isButtonDisabled} />
                </React.Fragment>
            ) : (
                <Tetris
                    rows={rows}
                    columns={columns}
                    setGameOver={setGameOver}
                    gameOver={gameOver}
                    setCurrentScore={setCurrentScore}
                />
            )}
        </div>
    );
};

export default Game;
