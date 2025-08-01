// Debug utility to check current user data
const user = JSON.parse(localStorage.getItem("user") || "{}");

console.log("=== USER DEBUG INFO ===");
console.log("User data:", user);
console.log("User role:", user.role);
console.log("User token:", user.token ? "Present" : "Missing");
console.log(
  "Is demo mode:",
  user?.isDemo === true || !user?.token || user?.token?.startsWith("demo_")
);

if (user.token) {
  try {
    const payload = JSON.parse(atob(user.token.split(".")[1]));
    console.log("Token payload:", payload);
    console.log("Token expires:", new Date(payload.exp * 1000));
    console.log("Token expired:", Date.now() > payload.exp * 1000);
  } catch (e) {
    console.log("Error parsing token:", e.message);
  }
}

console.log("=======================");
