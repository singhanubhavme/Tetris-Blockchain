const { ethers, run, network } = require("hardhat");


const verify = async (contractAddress, args) => {
    console.log("Verifying contract...");
    try {
        await run("verify:verify", {
            address: contractAddress,
            constructorArguments: args,
        });
    } catch (e) {
        if (e.message.toLowerCase().includes("already verified")) {
            console.log("Already Verified!");
        } else {
            console.log(e);
        }
    }
};

async function main() {
    const Tetris = await ethers.getContractFactory("Tetris");
    const TETRIS_CONTRACT = await Tetris.deploy();

    if (network.config.chainId === 5) {
        await TETRIS_CONTRACT.deployTransaction.wait(5);
        await verify(TETRIS_CONTRACT.address, []);

        // await TETRIS_CONTRACT.deployTransaction.wait(1);
    } else {
        console.log("Deployed on Localhost")
    }
    console.log("Contract deployed to address: ", TETRIS_CONTRACT.address);
}


module.exports = main;