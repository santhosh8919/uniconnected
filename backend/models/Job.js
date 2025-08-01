const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    branch: {
      type: String,
      required: true,
      enum: [
        "Computer Science",
        "Information Technology",
        "Electronics",
        "Mechanical",
        "Civil",
        "Chemical",
        "Other",
      ],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
    },
    applyLink: {
      type: String,
      trim: true,
    },
    logo: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    isRemote: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      required: true,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
    },
    experienceRequired: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      unit: {
        type: String,
        enum: ["years", "months"],
        default: "years",
      },
    },
    technologies: [
      {
        type: String,
        trim: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        required: true,
      },
    ],
    salary: {
      min: {
        type: Number,
        required: true,
      },
      max: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    applicants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        status: {
          type: String,
          enum: ["pending", "reviewed", "shortlisted", "rejected"],
          default: "pending",
        },
        appliedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["open", "closed", "draft", "interviewing"],
      default: "open",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    totalApplications: {
      type: Number,
      default: 0,
    },
    applicationDeadline: {
      type: Date,
      required: true,
    },
    workplaceType: {
      type: String,
      enum: ["onsite", "remote", "hybrid"],
      default: "onsite",
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching
jobSchema.index({
  title: "text",
  company: "text",
  description: "text",
  location: "text",
});

module.exports = mongoose.model("Job", jobSchema);
