const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Db Connected')
        mongoose.connection.once("open", () => {
            console.log("✅ Connected to MongoDB successfully");
        });
        mongoose.connection.on("error", (err) => {
            console.error("❌ MongoDB Connection Error:", err);
        });
        
    } catch (error) {
        console.log('DB Connection Error');
    }
}

module.exports = {db}