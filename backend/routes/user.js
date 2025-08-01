const express = require("express");
const { body, query } = require("express-validator");
const User = require("../models/User");
const Connection = require("../models/Connection");
const validate = require("../middleware/validation");
const { auth, optionalAuth } = require("../middleware/auth");

const router = express.Router();

// @route   GET /api/users/profile/:id
// @desc    Get user profile by ID
// @access  Public (with optional auth for privacy settings)
router.get("/profile/:id", optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(404).json({
        message: "User profile not available",
      });
    }

    // Check privacy settings
    const currentUserId = req.user?._id;

    if (
      user.preferences.profileVisibility === "private" &&
      (!currentUserId || currentUserId.toString() !== user._id.toString())
    ) {
      return res.status(403).json({
        message: "Profile is private",
      });
    }

    if (user.preferences.profileVisibility === "connections" && currentUserId) {
      const connection = await Connection.connectionExists(
        currentUserId,
        user._id
      );
      if (!connection || connection.status !== "accepted") {
        return res.status(403).json({
          message: "Profile is only visible to connections",
        });
      }
    }

    // Check if there's a connection between users
    let connectionStatus = null;
    if (currentUserId && currentUserId.toString() !== user._id.toString()) {
      const connection = await Connection.connectionExists(
        currentUserId,
        user._id
      );
      if (connection) {
        connectionStatus = {
          status: connection.status,
          requester: connection.requester.toString(),
          recipient: connection.recipient.toString(),
        };
      }
    }

    const userProfile = user.getPublicProfile();

    res.json({
      user: userProfile,
      connectionStatus,
      isOwnProfile: currentUserId?.toString() === user._id.toString(),
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      message: "Server error",
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put(
  "/profile",
  [
    auth,
    body("fullName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage("Full name must be between 2 and 100 characters"),
    body("bio")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Bio cannot exceed 500 characters"),
    body("skills").optional().isArray().withMessage("Skills must be an array"),
    body("skills.*")
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Each skill must be between 1 and 50 characters"),
    body("socialLinks.linkedin")
      .optional()
      .isURL()
      .withMessage("LinkedIn must be a valid URL"),
    body("socialLinks.github")
      .optional()
      .isURL()
      .withMessage("GitHub must be a valid URL"),
    body("socialLinks.twitter")
      .optional()
      .isURL()
      .withMessage("Twitter must be a valid URL"),
    body("companyName")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Company name cannot exceed 100 characters"),
    body("jobRole")
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage("Job role cannot exceed 100 characters"),
    body("isWorking")
      .optional()
      .isBoolean()
      .withMessage("isWorking must be a boolean"),
  ],
  validate,
  async (req, res) => {
    try {
      const updates = req.body;
      const userId = req.user._id;

      // Remove fields that shouldn't be updated this way
      delete updates.email;
      delete updates.password;
      delete updates.role;
      delete updates.year;
      delete updates.college;
      delete updates.branch;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updates },
        { new: true, runValidators: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Profile updated successfully",
        user: user.getPublicProfile(),
      });
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(500).json({
        message: "Server error during profile update",
      });
    }
  }
);

// @route   GET /api/users/search
// @desc    Search users by various criteria
// @access  Private
router.get(
  "/search",
  [
    auth,
    query("q")
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage("Search query must not be empty"),
    query("college").optional().trim(),
    query("branch").optional().trim(),
    query("year").optional().trim(),
    query("role")
      .optional()
      .isIn(["student", "alumni"])
      .withMessage("Role must be student or alumni"),
    query("page")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Page must be a positive integer"),
    query("limit")
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage("Limit must be between 1 and 50"),
  ],
  validate,
  async (req, res) => {
    try {
      const {
        q,
        college,
        branch,
        year,
        role,
        page = 1,
        limit = 20,
      } = req.query;
      const currentUserId = req.user._id;

      // Build search query
      let searchQuery = {
        isActive: true,
        _id: { $ne: currentUserId }, // Exclude current user
        "preferences.profileVisibility": { $in: ["public", "connections"] },
      };

      // Text search
      if (q) {
        searchQuery.$text = { $search: q };
      }

      // Filter by specific fields
      if (college) searchQuery.college = new RegExp(college, "i");
      if (branch) searchQuery.branch = new RegExp(branch, "i");
      if (year) searchQuery.year = year;
      if (role) searchQuery.role = role;

      // Calculate pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute search
      const users = await User.find(searchQuery)
        .select("-password")
        .limit(parseInt(limit))
        .skip(skip)
        .sort(q ? { score: { $meta: "textScore" } } : { createdAt: -1 });

      // Get total count for pagination
      const total = await User.countDocuments(searchQuery);

      // Get connection statuses for found users
      const usersWithConnections = await Promise.all(
        users.map(async (user) => {
          const connection = await Connection.connectionExists(
            currentUserId,
            user._id
          );
          const userObj = user.getPublicProfile();

          userObj.connectionStatus = connection
            ? {
                status: connection.status,
                requester: connection.requester.toString(),
                recipient: connection.recipient.toString(),
              }
            : null;

          return userObj;
        })
      );

      res.json({
        users: usersWithConnections,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / parseInt(limit)),
          total,
          limit: parseInt(limit),
        },
      });
    } catch (error) {
      console.error("Search users error:", error);
      res.status(500).json({
        message: "Server error during search",
      });
    }
  }
);

// @route   GET /api/users/suggestions
// @desc    Get connection suggestions based on college/branch
// @access  Private
router.get("/suggestions", auth, async (req, res) => {
  try {
    const currentUser = req.user;
    const { limit = 10 } = req.query;

    // Get users from same college and branch, excluding current user and existing connections
    const existingConnections = await Connection.find({
      $or: [{ requester: currentUser._id }, { recipient: currentUser._id }],
    }).select("requester recipient");

    const excludeUserIds = [currentUser._id];
    existingConnections.forEach((conn) => {
      if (conn.requester.toString() !== currentUser._id.toString()) {
        excludeUserIds.push(conn.requester);
      }
      if (conn.recipient.toString() !== currentUser._id.toString()) {
        excludeUserIds.push(conn.recipient);
      }
    });

    const suggestions = await User.find({
      $and: [
        { _id: { $nin: excludeUserIds } },
        { isActive: true },
        { "preferences.profileVisibility": { $in: ["public", "connections"] } },
        {
          $or: [
            { college: currentUser.college, branch: currentUser.branch },
            { college: currentUser.college },
          ],
        },
      ],
    })
      .select("-password")
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const suggestionList = suggestions.map((user) => user.getPublicProfile());

    res.json({
      suggestions: suggestionList,
    });
  } catch (error) {
    console.error("Get suggestions error:", error);
    res.status(500).json({
      message: "Server error getting suggestions",
    });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put(
  "/preferences",
  [
    auth,
    body("emailNotifications")
      .optional()
      .isBoolean()
      .withMessage("Email notifications must be boolean"),
    body("profileVisibility")
      .optional()
      .isIn(["public", "connections", "private"])
      .withMessage("Invalid profile visibility option"),
  ],
  validate,
  async (req, res) => {
    try {
      const { emailNotifications, profileVisibility } = req.body;
      const userId = req.user._id;

      const updateData = {};
      if (emailNotifications !== undefined)
        updateData["preferences.emailNotifications"] = emailNotifications;
      if (profileVisibility)
        updateData["preferences.profileVisibility"] = profileVisibility;

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.json({
        message: "Preferences updated successfully",
        preferences: user.preferences,
      });
    } catch (error) {
      console.error("Update preferences error:", error);
      res.status(500).json({
        message: "Server error updating preferences",
      });
    }
  }
);

module.exports = router;
