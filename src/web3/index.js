require("dotenv/config");
const Web3 = require("web3");
const {
	abi: amusedFaucetABI,
	address: amusedFaucetAddress,
} = require("./abi/AmusedFaucet.json");

const connectWeb3 = async () => {
	try {
		const web3 = new Web3(
			`https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyApiKey}`
		);
		const { address: admin } = web3.eth.accounts.wallet.add(
			process.env.adminFaucetPrivateKey
		);
		return { web3, admin };
	} catch (error) {
		return error;
	}
};

const customWeb3Connect = async (_network) => {
	try {
		const web3 = new Web3(
			`https://eth-${_network}.alchemyapi.io/v2/${process.env.alchemyApiKey}`
		);
		const { address: admin } = web3.eth.accounts.wallet.add(
			process.env.adminFaucetPrivateKey
		);

		const amuseFaucet = new web3.eth.Contract(
			amusedFaucetABI,
			amusedFaucetAddress
		);
		return { web3, admin, amuseFaucet };
	} catch (error) {
		return error;
	}
};

module.exports = { connectWeb3, customWeb3Connect };
