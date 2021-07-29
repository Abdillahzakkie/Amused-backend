require("dotenv/config");
const Web3 = require("web3");
const { abi: amusedTokenABI } = require("./abi/AmusedToken.json");
const { abi: amusedVaultABI } = require("./abi/AmusedVault.json");
const { abi: amusedFaucetABI } = require("./abi/AmusedFaucet.json");

const connectWeb3 = async () => {
	try {
		const web3 = new Web3(
			`https://eth-mainnet.alchemyapi.io/v2/${process.env.alchemyApiKey}`
		);
		// const amusedToken = new web3.eth.Contract(
		// 	amusedTokenABI,
		// 	process.env.amuseTokenAddress
		// );
		// const amusedVault = new web3.eth.Contract(
		// 	amusedVaultABI,
		// 	process.env.amusedVaultAddress
		// );

		const { address: admin } = web3.eth.accounts.wallet.add(
			process.env.adminKey
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
			process.env.adminKey
		);

		const amuseFaucet = new web3.eth.Contract(
			amusedFaucetABI,
			process.env.amusedFaucetAddress
		);
		return { web3, admin, amuseFaucet };
	} catch (error) {
		return error;
	}
};

module.exports = { connectWeb3, customWeb3Connect };
