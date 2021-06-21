const router = require('express').Router();
const { getNormalTransactionLists } = require('../helper');

router.get('/', async (req, res) => {
    try {
        const { user } = req.body;
        const _userNormalTransaction = await getNormalTransactionLists(user);
        return res.status(200).json(_userNormalTransaction);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
    }
})

module.exports = router;