const mongoose = require("mongoose");

const db = async () => {
  try {
    mongoose.set("strictQuery", false);

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true, // Keeps the connection alive
      serverSelectionTimeoutMS: 10000, // Wait 10s before timing out
      socketTimeoutMS: 60000, // Close sockets after 60s of inactivity
      minPoolSize: 10, // Minimum 10 active connections
      maxPoolSize: 100, // Allow up to 100 connections
    });

    console.log("✅ MongoDB Connected Successfully");

    mongoose.connection.on("error", (err) => {
      console.error("❌ MongoDB Connection Error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️ MongoDB Disconnected. Reconnecting...");
      reconnectDB();
    });

  } catch (error) {
    console.error("❌ Initial DB Connection Error:", error);
    setTimeout(db, 5000); // Retry after 5s
  }
};

// Auto-reconnect function
const reconnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
    });
    console.log("🔄 MongoDB Reconnected");
  } catch (error) {
    console.error("❌ MongoDB Reconnection Failed:", error);
    setTimeout(reconnectDB, 5000); // Retry after 5s
  }
};

module.exports = { db };
