const mongoose = require("mongoose");

const db = async () => {
  try {
    mongoose.set("strictQuery", false);

    const dbConnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // Timeout after 10s if no server response
      socketTimeoutMS: 60000, // Close sockets after 60s of inactivity
      minPoolSize: 10, // Minimum 10 active connections
      maxPoolSize: 100, // Allow up to 100 connections
    });

    console.log("✅ MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected. Attempting Reconnect...");
      reconnectDB();
    });

    return dbConnection;
  } catch (error) {
    console.error("❌ Initial DB Connection Error:", error);
    setTimeout(db, 5000); // Retry after 5 seconds
  }
};

// 🔄 **Auto-Reconnect Function**
const reconnectDB = async () => {
  try {
    console.log("🔄 Reconnecting to MongoDB...");
    await mongoose.disconnect(); // Ensure clean reconnection
    await db();
  } catch (error) {
    console.error("❌ MongoDB Reconnection Failed:", error);
    setTimeout(reconnectDB, 5000); // Retry after 5 seconds
  }
};

module.exports = { db };
