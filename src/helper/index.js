require('dotenv/config');
const { connectWeb3 } = require('../web3');
const fetch = require('cross-fetch');


const startBlock = process.env.startBlock;
const etherscanApiKey = process.env.etherscan_Api_Key;

let loading = true;
let web3;

(async () => {
    const _result = await connectWeb3();
    loading = false;
    web3 = _result.web3;
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
        console.log(_data);
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

        result = result.reverse();
        return result;
    } catch (error) {
        return error.message;
    }
}


module.exports = {
    getNormalTransactionLists,
    fromWei,
    toWei
}