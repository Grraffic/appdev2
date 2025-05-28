const mongoose = require("mongoose");
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo Atlas connected successfully.");
    } catch (error) {
        console.error("Mongo Connection Error:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;