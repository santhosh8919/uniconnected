// Demo Data and Testing Utilities for UniConnect
// Use this for testing when you need sample data

// Demo user data for testing (without sensitive info)
export const demoUsers = {
  student: {
    _id: "demo_student_123",
    fullName: "John Doe",
    email: "john.doe@student.com",
    college: "IIT Delhi",
    branch: "Computer Science Engineering",
    year: "3rd Year",
    role: "student",
    bio: "Passionate about technology and innovation. Love coding and learning new things.",
    skills: ["JavaScript", "React", "Node.js", "Python", "MongoDB"],
    socialLinks: {
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      twitter: "https://twitter.com/johndoe",
    },
  },

  alumni: {
    _id: "demo_alumni_456",
    fullName: "Jane Smith",
    email: "jane.smith@alumni.com",
    college: "IIT Bombay",
    branch: "Electronics and Communication Engineering",
    year: "Alumni",
    role: "alumni",
    isWorking: true,
    companyName: "Google",
    jobRole: "Software Engineer",
    bio: "Software Engineer at Google with 5+ years of experience in full-stack development.",
    skills: [
      "Java",
      "Python",
      "Machine Learning",
      "Cloud Computing",
      "System Design",
    ],
    socialLinks: {
      linkedin: "https://linkedin.com/in/janesmith",
      github: "https://github.com/janesmith",
      twitter: "",
    },
  },
};

// Function to set demo user data (for testing purposes only)
export const setDemoUser = (userType = "student") => {
  const demoUser = demoUsers[userType];
  const userWithToken = {
    ...demoUser,
    token: "demo_jwt_token_for_testing_" + Date.now(),
  };

  localStorage.setItem("user", JSON.stringify(userWithToken));
  console.log(`Demo ${userType} user set:`, demoUser.fullName);
  return userWithToken;
};

// Function to clear user data
export const clearUser = () => {
  localStorage.removeItem("user");
  console.log("User data cleared from localStorage");
};

// Function to check current user
export const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user) {
    console.log("Current user:", user.fullName, "(" + user.role + ")");
    console.log("Has token:", !!user.token);
  } else {
    console.log("No user currently logged in");
  }
  return user;
};

// Testing instructions
export const testingInstructions = `
🧪 TESTING UTILITIES - Use in Browser Console:

// Import the utilities (in console)
import { setDemoUser, clearUser, getCurrentUser } from './src/utils/demoData.js';

// Set a demo student user
setDemoUser('student');

// Set a demo alumni user  
setDemoUser('alumni');

// Check current user
getCurrentUser();

// Clear user data
clearUser();

// Or manually set in console:
localStorage.setItem('user', JSON.stringify({
  _id: "test_123",
  fullName: "Test User",
  email: "test@example.com",
  college: "Test College",
  branch: "Test Branch",
  year: "3rd Year",
  role: "student",
  token: "test_token_123"
}));
`;

console.log(testingInstructions);
