const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");
const User = require("../models/User");
const validate = require("../middleware/validation");
const { auth } = require("../middleware/auth");

const router = express.Router();

// Validation rules
const registerValidation = [
  body("fullName")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Full name must be between 2 and 100 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("college").trim().notEmpty().withMessage("College is required"),
  body("branch").trim().notEmpty().withMessage("Branch is required"),
  body("year")
    .isIn(["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"])
    .withMessage("Invalid year selection"),
  body("isWorking")
    .optional()
    .isBoolean()
    .withMessage("isWorking must be a boolean"),
  body("companyName")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.year === "Alumni" && req.body.isWorking === true) {
        if (!value || value.trim() === "") {
          throw new Error("Company name is required for working alumni");
        }
      }
      return true;
    }),
  body("jobRole")
    .optional()
    .trim()
    .custom((value, { req }) => {
      if (req.body.year === "Alumni" && req.body.isWorking === true) {
        if (!value || value.trim() === "") {
          throw new Error("Job role is required for working alumni");
        }
      }
      return true;
    }),
];

const loginValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post("/register", registerValidation, validate, async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      college,
      branch,
      year,
      isWorking,
      companyName,
      jobRole,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
      });
    }

    // Create user object
    const userData = {
      fullName,
      email,
      password,
      college,
      branch,
      year,
    };

    // Add alumni-specific fields if applicable
    if (year === "Alumni") {
      userData.isWorking = isWorking || false;
      if (isWorking) {
        userData.companyName = companyName;
        userData.jobRole = jobRole;
      }
    }

    // Create new user
    const user = new User(userData);
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return response without password
    const userResponse = user.getPublicProfile();

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    res.status(500).json({
      message: "Server error during registration",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post("/login", loginValidation, validate, async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        message: "Account is deactivated. Please contact support.",
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Return response without password
    const userResponse = user.getPublicProfile();

    res.json({
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Server error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: user.getPublicProfile(),
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post("/logout", auth, async (req, res) => {
  try {
    // In a JWT implementation, logout is typically handled client-side
    // by removing the token. Here we could add token to a blacklist
    // or update user's last activity

    res.json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({
      message: "Server error during logout",
    });
  }
});

// @route   PUT /api/auth/change-password
// @desc    Change user password
// @access  Private
router.put(
  "/change-password",
  [
    auth,
    body("currentPassword")
      .notEmpty()
      .withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long"),
  ],
  validate,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id).select("+password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      // Verify current password
      const isCurrentPasswordValid = await user.comparePassword(
        currentPassword
      );

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          message: "Current password is incorrect",
        });
      }

      // Update password
      user.password = newPassword;
      await user.save();

      res.json({
        message: "Password changed successfully",
      });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({
        message: "Server error during password change",
      });
    }
  }
);

module.exports = router;
