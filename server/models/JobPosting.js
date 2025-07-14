const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  responsibilities: [{
    type: String
  }],
  location: {
    type: String,
    required: true
  },
  locationType: {
    type: String,
    enum: ['onsite', 'remote', 'hybrid'],
    default: 'onsite'
  },
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'internship', 'contract'],
    required: true
  },
  experience: {
    min: {
      type: Number,
      default: 0
    },
    max: {
      type: Number,
      default: 0
    }
  },
  skills: [{
    type: String
  }],
  benefits: [{
    type: String
  }],
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interviewed', 'selected', 'rejected'],
      default: 'applied'
    },
    resume: String,
    coverLetter: String
  }],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  },
  applications: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Index for search and filtering
jobPostingSchema.index({ title: 'text', company: 'text', description: 'text' });
jobPostingSchema.index({ type: 1, status: 1 });
jobPostingSchema.index({ postedBy: 1 });
jobPostingSchema.index({ createdAt: -1 });
jobPostingSchema.index({ expiresAt: 1 });

module.exports = mongoose.model('JobPosting', jobPostingSchema);