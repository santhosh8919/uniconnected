const mongoose = require("mongoose");
require("dotenv").config();

async function testBackendSetup() {
  try {
    console.log("🧪 Testing backend setup...\n");

    // Test MongoDB connection
    console.log("1️⃣ Testing MongoDB connection...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connection successful!");

    // Test environment variables
    console.log("\n2️⃣ Checking environment variables...");
    const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT"];
    const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

    if (missingVars.length > 0) {
      throw new Error(
        `Missing environment variables: ${missingVars.join(", ")}`
      );
    }
    console.log("✅ All required environment variables found!");

    // Test models loading
    console.log("\n3️⃣ Testing model imports...");
    require("./models/User");
    require("./models/Connection");
    require("./models/Message");
    console.log("✅ All models loaded successfully!");

    // Test basic express setup
    console.log("\n4️⃣ Testing express setup...");
    const express = require("express");
    const app = express();
    console.log("✅ Express initialized successfully!");

    // Test socket.io setup
    console.log("\n5️⃣ Testing Socket.IO setup...");
    const http = require("http");
    const server = http.createServer(app);
    const SocketService = require("./services/socketService");
    const socketService = new SocketService(server);
    console.log("✅ Socket.IO service initialized!");

    console.log("\n🎉 All tests passed! Backend is ready to start.");
    console.log("\nTo start the server:");
    console.log("1. Run: cd backend");
    console.log("2. Run: npm start");
    console.log('3. Wait for "Server running on port 5000"');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("\n❌ Test failed:", error.message);
    console.error("\nDebug information:");
    console.error(
      "- MongoDB URI:",
      process.env.MONGO_URI ? "✓ Present" : "✗ Missing"
    );
    console.error(
      "- JWT Secret:",
      process.env.JWT_SECRET ? "✓ Present" : "✗ Missing"
    );
    console.error("- Port:", process.env.PORT || "5000 (default)");
    console.error("\nFull error:", error);

    try {
      await mongoose.disconnect();
    } catch {}

    process.exit(1);
  }
}

testBackendSetup();
