const router = require('express').Router();
const { getNormalTransactionLists, getRefferalHistory } = require('../helper');

router.get('/', async (req, res) => {
    try {
        const { user } = req.query;
        const _userNormalTransaction = await getNormalTransactionLists(user);
        return res.status(200).json(_userNormalTransaction);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
})

router.get('/refferalHistory/', async (req, res) => {
    try {
        const { user } = req.query;
        const _refferalHistory = await getRefferalHistory(user);
        return res.status(200).json(_refferalHistory);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
})

module.exports = router;