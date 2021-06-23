require('dotenv/config');
const { connectWeb3 } = require('../web3');
const fetch = require('cross-fetch');


const startBlock = process.env.startBlock;
const etherscanApiKey = process.env.etherscan_Api_Key;

let web3;
let amusedToken;

(async () => {
    const { web3: _web3, amusedToken: _amusedToken } = await connectWeb3();
    web3 = _web3;
    amusedToken = _amusedToken;
})()

const fromWei = (_amount) => !loading && web3.utils.fromWei(_amount.toString(), "ether");

const toWei = (_amount) => !loading && web3.utils.toWei(_amount.toString(), "ether");

const getNormalTransactionLists = async user => {
    try {
        let tempData = [];
        const _endBlock = parseInt(await web3.eth.getBlockNumber());
        for(let i = startBlock; i <= _endBlock; i = i + 10000) {
            const _step = i + 10000;
            const _result = await (await fetch(`//api.etherscan.io/api?module=account&action=txlist&address=${user}&startblock=${i}&endblock=${_step}&sort=desc&apikey=${etherscanApiKey}`)).json();
            tempData = [...tempData, ..._result.result];
        }
        return formatTransactionLists(tempData);
    } catch (error) { return error.message; }
}

const formatTransactionLists = async (_data) => {
    try {
        let result = await _data.map(item => {
            const { hash, from, to, gasPrice, gasUsed, nonce, value, blockNumber } = item;
            return {
                hash,
                from,
                to,
                gasPrice,
                gasUsed,
                nonce,
                blockNumber,
                value: fromWei(value)
            }
        })

        return result;
    } catch (error) {
        return error.message;
    }
}

const getRefferalHistory = async (user) => {
    try {
        const startBlock = (await axios.get("https://amused-finance-backend.herokuapp.com/api/v1/startBlock")).data;

        const _endBlock = parseInt(await web3.eth.getBlockNumber());
        let _tempData = [];
        
        for(let i = startBlock; i <= _endBlock; i = i + 10000) {
            const _step = i + 10000;
            const _result = await amusedToken.getPastEvents("ReferralReward", { fromBlock: i, toBlock: _step });
            _tempData = [..._tempData, ..._result]
        }
        
        _tempData = _tempData.filter(item => web3.utils.toChecksumAddress(item.returnValues.referrer) === web3.utils.toChecksumAddress(user));

        _tempData = _tempData.map(item => {
            const { blockNumber, returnValues, transactionHash: hash } = item;
            const { user, referrer, purchased, reward, timestamp } = returnValues;
            return {
                user,
                referrer,
                blockNumber,
                purchased: web3.utils.fromWei(purchased, "ether"),
                reward: web3.utils.fromWei(reward, "ether"),
                hash,
                timestamp
            }
        });
        _tempData = _tempData.reverse();
        return _tempData;
    } catch (error) { 
        console.log(error);
        return error.message;
    }
}


module.exports = {
    fromWei,
    toWei,
    getNormalTransactionLists,
    getRefferalHistory,
}