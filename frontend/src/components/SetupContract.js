import ABI from "../constants/abi.json";
import ContractAddress from "../constants/contractAddress.json";
const ethers = require("ethers")

const SetupContract = async () => {
    if (typeof window.ethereum !== 'undefined' || (typeof window.web3 !== 'undefined')) {
        const ethereum = window.ethereum;
        const accounts = await ethereum.request({
            method: "eth_requestAccounts",
        })
        const provider = new ethers.providers.Web3Provider(ethereum);
        const walletAddress = accounts[0];
        const signer = provider.getSigner(walletAddress);
        const tetrisContractAddress = ContractAddress["5"][0];
        return (new ethers.Contract(tetrisContractAddress, ABI, signer));
    }
}

export default SetupContract;