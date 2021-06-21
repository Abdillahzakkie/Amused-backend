require('dotenv/config');
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./DB');
const transactionRoute = require('./routes/transaction.route');
const { connectWeb3 } = require('./web3');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());
app.use('/api/v1/transactions', transactionRoute);


app.listen(PORT, async () => {
    console.log(`Server listening on PORT: ${PORT}`);
    await connectDB();
    await connectWeb3();
})