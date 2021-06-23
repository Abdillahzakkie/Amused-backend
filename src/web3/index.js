require('dotenv/config');
const Web3 = require('web3');
const { abi: amusedTokenABI } = require('./abi/AmusedTokenABI.json');
const { abi: amusedVaultABI } = require('./abi/AmusedTokenABI.json');

const connectWeb3 = async () => {
    try {
        const web3 = new Web3(`https://eth-rinkeby.alchemyapi.io/v2/${process.env.alchemyApiKey}`);
        const amusedToken = new web3.eth.Contract(amusedTokenABI, process.env.amuseTokenAddress);
        const amusedVault = new web3.eth.Contract(amusedVaultABI, process.env.amusedVaultAddress);

        return { web3, amusedToken, amusedVault };
    } catch (error) { return error; }
}

module.exports = { connectWeb3 };