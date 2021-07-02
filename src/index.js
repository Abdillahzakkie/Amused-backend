const express = require('express');
const cors = require('cors');
const { connectDB } = require('./db');
const { connectWeb3 } = require('./web3');
const transactionRoute = require('./routes/transaction.route');
const faucetRoute = require('./routes/faucet.route');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use('/api/v1/transactions', transactionRoute);
app.use('/api/v1/faucets', faucetRoute);
app.get('/api/v1/startBlock', async (_, res) => res.status(200).json(process.env.startBlock));


app.listen(PORT, async () => {
    console.log(`Server listening on PORT: ${PORT}`);
    await connectDB();
    await connectWeb3();
})