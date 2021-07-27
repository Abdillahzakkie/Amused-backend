const { validateSignature, requestFaucet } = require("../helper");

const router = require("express").Router();

router.post("/requestFaucet", async (req, res) => {
	try {
		const { user, signature, chainId, amount } = req.body;

		const { status, signer, error } = await validateSignature(
			user,
			signature,
			chainId,
			amount
		);
		if (!status) return res.status(200).json({ status, error });
		const _response = await requestFaucet(user, amount);
		return res.status(200).json({ status, signer, ..._response });
	} catch (error) {
		console.log(error);
		return res.status(500).json({ error });
	}
});

module.exports = router;
