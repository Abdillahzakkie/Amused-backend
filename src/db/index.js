require('dotenv/config');
const Mongoose = require("mongoose");

const connectDB = async () => {
    try {
        Mongoose.connect(process.env.CONNECTION_URI, {
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: true,
            useUnifiedTopology: true
        }, async () => console.log("Database Connected"));
    } catch (error) { return error; }
}

module.exports = { connectDB }