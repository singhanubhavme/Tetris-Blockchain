import React, { useEffect, useState } from "react";
import SetupContract from "./SetupContract";
import "./GameStats.css";

let tetrisContract;
const GameStats = ({ gameStats, setCurrentScore }) => {
    const { level, points } = gameStats;
    const [highestStats, setHighestStats] = useState({
        player: 0,
        level: 1,
        score: 0
    });

    useEffect(() => {
        setCurrentScore({
            player: 0,
            level: level,
            score: points
        });
    }, [level, points, setCurrentScore]);

    useEffect(() => {
        (async function () {
            tetrisContract = await SetupContract();
            const highestScore = await tetrisContract.getHighestStats();
            setHighestStats({
                player: highestScore[0],
                level: highestScore[1],
                score: (highestScore[2].toString())
            })
        })();
    }, []);

    return (
        <>
            <ul className="GameStats GameStats__right GameStats__top">
                <li className="score-heading">Your Score</li>
                <li>Level</li>
                <li className="value">{level}</li>
                <li>Points</li>
                <li className="value">{points}</li>
            </ul>
            {
                highestStats.player !== 0 &&
                highestStats.level !== 1 &&
                <ul className="GameStats GameStats__right GamesStats__bottom">
                    <li className="score-heading">Highest Score</li>
                    <li>Player</li>
                    <li className="value">
                        {(highestStats.player).substring(0, 5)}
                        ..
                        {(highestStats.player).substring(highestStats.player.length, highestStats.player.length - 2)}
                    </li>
                    <li>Level</li>
                    <li className="value">{highestStats.level}</li>
                    <li>Points</li>
                    <li className="value">{highestStats.score}</li>
                </ul>
            }
        </>
    );
};

export default React.memo(GameStats);
