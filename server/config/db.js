/**
 * @file db.js
 * @description MongoDB Atlas connection using Mongoose.
 * Handles initial connection and emits process-level events
 * for connection errors after the initial connect.
 */

const mongoose = require("mongoose");

/**
 * Establishes a connection to MongoDB Atlas.
 * Exits the process if the initial connection fails so the
 * server never starts in a broken state.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options are the current Mongoose 8.x defaults but
      // are declared explicitly for clarity and future-proofing.
      serverSelectionTimeoutMS: 5000, // fail fast if Atlas is unreachable
    });

    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);

    // Warn on post-connect disconnections (e.g. network blip)
    mongoose.connection.on("disconnected", () => {
      console.warn("⚠️   MongoDB disconnected. Attempting to reconnect...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("🔄  MongoDB reconnected.");
    });
  } catch (error) {
    console.error(`❌  MongoDB connection error: ${error.message}`);
    process.exit(1); // non-zero exit triggers restart in PM2 / Render
  }
};

module.exports = connectDB;
