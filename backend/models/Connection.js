const mongoose = require("mongoose");

const connectionSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "blocked"],
      default: "pending",
    },
    message: {
      type: String,
      maxlength: [300, "Connection message cannot exceed 300 characters"],
      trim: true,
    },
    acceptedAt: {
      type: Date,
    },
    rejectedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure unique connection between two users
connectionSchema.index({ requester: 1, recipient: 1 }, { unique: true });

// Static method to check if connection exists
connectionSchema.statics.connectionExists = async function (userId1, userId2) {
  const connection = await this.findOne({
    $or: [
      { requester: userId1, recipient: userId2 },
      { requester: userId2, recipient: userId1 },
    ],
  });
  return connection;
};

// Static method to get user connections
connectionSchema.statics.getUserConnections = async function (
  userId,
  status = "accepted"
) {
  return await this.find({
    $or: [
      { requester: userId, status },
      { recipient: userId, status },
    ],
  }).populate(
    "requester recipient",
    "fullName email college branch year role companyName jobRole profilePicture"
  );
};

module.exports = mongoose.model("Connection", connectionSchema);
