// Debug utility to check JWT token validity
// Run this in browser console to debug token issues

function debugJWTToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("❌ No token found in localStorage");
    return null;
  }

  try {
    // Decode JWT token (without verification - just for debugging)
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.log("❌ Invalid token format");
      return null;
    }

    const header = JSON.parse(atob(parts[0]));
    const payload = JSON.parse(atob(parts[1]));

    console.log("📝 Token Header:", header);
    console.log("📝 Token Payload:", payload);
    console.log("🔍 User ID:", payload.userId);
    console.log("📅 Issued at:", new Date(payload.iat * 1000));
    console.log("📅 Expires at:", new Date(payload.exp * 1000));

    const isExpired = Date.now() > payload.exp * 1000;
    console.log("⏰ Is expired?", isExpired);

    if (isExpired) {
      console.log("🧹 Token is expired. Clearing localStorage...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("🔄 Please refresh the page and login again.");
    }

    return payload;
  } catch (error) {
    console.log("❌ Error decoding token:", error);
    console.log("🧹 Clearing potentially corrupted token...");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    return null;
  }
}

// Function to check if current token is valid
function isTokenValid() {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    const payload = JSON.parse(atob(parts[1]));
    return Date.now() < payload.exp * 1000;
  } catch {
    return false;
  }
}

// Auto-run token validation
console.log("🔍 Checking JWT token validity...");
const tokenData = debugJWTToken();

if (!tokenData) {
  console.log("⚠️ No valid token found. Please login.");
} else if (!isTokenValid()) {
  console.log("⚠️ Token is expired. Please login again.");
}
