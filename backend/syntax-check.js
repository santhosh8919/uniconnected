// Simple syntax check script
try {
  console.log("Testing server.js...");
  require("./server.js");
  console.log("✅ server.js syntax is valid");
} catch (error) {
  console.error("❌ Syntax error in server.js:", error.message);
  console.error("Stack trace:", error.stack);
}
