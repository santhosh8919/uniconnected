const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  responseMessage: {
    type: String,
    default: ''
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate requests
connectionRequestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

// Index for queries
connectionRequestSchema.index({ receiver: 1, status: 1 });
connectionRequestSchema.index({ sender: 1, status: 1 });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);