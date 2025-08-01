// Test script to check API and user authentication
// Run this in browser console to debug

async function testJobAPI() {
  console.log("=== JOB API TEST ===");

  // Check user data
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("👤 User data:", user);
  console.log("👤 User role:", user.role);
  console.log("👤 Has token:", !!user.token);

  if (!user.token) {
    console.error("❌ No token found - user not logged in");
    return;
  }

  if (user.role !== "alumni") {
    console.warn(
      "⚠️ User role is not 'alumni' - job posting may be restricted"
    );
  }

  // Test backend health
  try {
    console.log("🔍 Testing backend health...");
    const healthResponse = await fetch("http://localhost:5000/api/health");
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Backend is running:", healthData);
    } else {
      console.error("❌ Backend health check failed:", healthResponse.status);
      return;
    }
  } catch (error) {
    console.error("❌ Backend is not running:", error.message);
    return;
  }

  // Test job API with minimal data
  try {
    console.log("🔍 Testing job creation...");

    const testJobData = {
      title: "Test Job",
      description: "Test description",
      company: "Test Company",
      location: "Test Location",
      type: "Full-time",
      branch: "Computer Science",
      contactEmail: "test@test.com",
      requirements: ["Test requirement"],
      technologies: ["JavaScript"],
      salary: { min: 50000, max: 100000, currency: "INR" },
      experienceRequired: { min: 0, max: 2, unit: "years" },
      applicationDeadline: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      workplaceType: "onsite",
      status: "open",
      isRemote: false,
    };

    console.log("📝 Test job data:", testJobData);

    const response = await fetch("http://localhost:5000/api/jobs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(testJobData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Job created successfully:", result);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("❌ Job creation failed:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
      });
    }
  } catch (error) {
    console.error("❌ Error testing job API:", error);
  }

  console.log("=== TEST COMPLETE ===");
}

// Run the test
testJobAPI();
