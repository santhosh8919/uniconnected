const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    college: {
      type: String,
      required: [true, "College is required"],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Alumni"],
    },
    role: {
      type: String,
      enum: ["student", "alumni"],
      default: function () {
        return this.year === "Alumni" ? "alumni" : "student";
      },
    },
    // Alumni specific fields
    isWorking: {
      type: Boolean,
      default: false,
      required: function () {
        return this.year === "Alumni";
      },
    },
    companyName: {
      type: String,
      trim: true,
      required: function () {
        return this.year === "Alumni" && this.isWorking;
      },
    },
    jobRole: {
      type: String,
      trim: true,
      required: function () {
        return this.year === "Alumni" && this.isWorking;
      },
    },
    // Profile fields
    profilePicture: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    socialLinks: {
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
      twitter: { type: String, default: "" },
    },
    // Connection fields
    connections: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        connectedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Preferences
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      profileVisibility: {
        type: String,
        enum: ["public", "connections", "private"],
        default: "public",
      },
    },
    // Timestamps
    lastLogin: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full profile completion
userSchema.virtual("profileCompletion").get(function () {
  let completion = 0;
  const fields = ["fullName", "email", "college", "branch", "year"];

  fields.forEach((field) => {
    if (this[field]) completion += 20;
  });

  if (this.bio) completion += 10;
  if (this.skills && this.skills.length > 0) completion += 10;
  if (this.profilePicture) completion += 10;

  return Math.min(completion, 100);
});

// Index for search functionality
userSchema.index({
  fullName: "text",
  college: "text",
  branch: "text",
  companyName: "text",
});
userSchema.index({ college: 1, branch: 1 });
userSchema.index({ year: 1, role: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Static method to find users by college and branch
userSchema.statics.findByCollegeAndBranch = function (college, branch) {
  return this.find({ college, branch, isActive: true });
};

module.exports = mongoose.model("User", userSchema);
