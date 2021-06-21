require('dotenv/config');
const Web3 = require('web3');

const connectWeb3 = async () => {
    try {
        const web3 = new Web3(`https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyApiKey}`);
        console.log(`Web3 connected`);
        return { web3 };
    } catch (error) { return error; }
}

module.exports = { connectWeb3 };