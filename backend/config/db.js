const mongoose = require("mongoose");

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        console.error("CRITICAL ERROR: MONGO_URI environment variable is not defined!");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};
module.exports = connectDB;