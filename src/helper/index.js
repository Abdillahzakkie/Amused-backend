require("dotenv/config");
const { connectWeb3 } = require("../web3");
const fetch = require("cross-fetch");
const sigUtil = require("eth-sig-util");
const moment = require("moment");

const startBlock = process.env.startBlock;
const etherscanApiKey = process.env.etherscan_Api_Key;

let loading = true;
let web3;
let admin;
let amusedFaucet;

(async () => {
	const {
		web3: _web3,
		admin: _admin,
		amusedFaucet: _amusedFaucet,
	} = await connectWeb3();
	loading = false;
	web3 = _web3;
	admin = _admin;
	amusedFaucet = _amusedFaucet;
})();

const fromWei = (_amount) =>
	!loading && web3.utils.fromWei(_amount.toString(), "ether");

const toWei = (_amount) =>
	!loading && web3.utils.toWei(_amount.toString(), "ether");

const toChecksumAddress = (_account) =>
	!loading && web3.utils.toChecksumAddress(_account);

const getNormalTransactionLists = async (user) => {
	try {
		let tempData = [];

		const _endBlock = parseInt(await web3.eth.getBlockNumber());
		for (let i = startBlock; i <= _endBlock; i = i + 10000) {
			const _step = i + 10000;
			const _result = await (
				await fetch(
					`//api.etherscan.io/api?module=account&action=txlist&address=${user}&startblock=${i}&endblock=${_step}&sort=desc&apikey=${etherscanApiKey}`
				)
			).json();
			tempData = [...tempData, ..._result.result];
		}
		return formatTransactionLists(tempData);
	} catch (error) {
		return error.message;
	}
};

const formatTransactionLists = async (_data) => {
	try {
		let result = await _data.map((item) => {
			const {
				hash,
				from,
				to,
				gasPrice,
				gasUsed,
				nonce,
				value,
				blockNumber,
				timeStamp,
			} = item;
			return {
				hash,
				from,
				to,
				gasPrice,
				gasUsed,
				nonce,
				blockNumber,
				value: fromWei(value),
				timestamp: moment(new Date(parseInt(timeStamp * 1000))).fromNow(),
			};
		});
		return result;
	} catch (error) {
		return error.message;
	}
};

const validateSignature = async (user, signature, chainId, amount) => {
	try {
		const msgParams = JSON.stringify({
			domain: {
				chainId,
				name: "Amused.Finance",
				version: "1",
			},
			message: {
				title: "Test network faucet request",
				user,
				amount,
			},
			primaryType: "FaucetRequest",
			types: {
				EIP712Domain: [
					{ name: "name", type: "string" },
					{ name: "version", type: "string" },
					{ name: "chainId", type: "uint256" },
				],
				FaucetRequest: [
					{ name: "title", type: "string" },
					{ name: "user", type: "address" },
					{ name: "amount", type: "uint256" },
				],
			},
		});
		const recovered = sigUtil.recoverTypedSignature_v4({
			data: JSON.parse(msgParams),
			sig: signature,
		});
		if (toChecksumAddress(recovered) !== toChecksumAddress(user))
			return {
				status: false,
				error: `${user} does not match recovered address of ${recovered}`,
			};
		return { status: true, signer: recovered };
	} catch (error) {
		return error;
	}
};

const requestFaucet = async (_account, _amount) => {
	try {
		const _result = await amusedFaucet.methods
			.requestFaucet(_account, toWei(_amount))
			.send({
				from: admin,
				gas: 210000,
			});
		return _result;
	} catch (error) {
		return error;
	}
};

module.exports = {
	fromWei,
	toWei,
	getNormalTransactionLists,
	validateSignature,
	requestFaucet,
};
