const mongoose = require('mongoose');

const webinarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true,
    default: 60
  },
  link: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    enum: ['zoom', 'teams', 'meet', 'webex', 'other'],
    default: 'zoom'
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  coHosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  attendees: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    registeredAt: {
      type: Date,
      default: Date.now
    },
    attended: {
      type: Boolean,
      default: false
    }
  }],
  maxAttendees: {
    type: Number,
    default: 100
  },
  topics: [{
    type: String
  }],
  targetAudience: {
    type: String,
    enum: ['students', 'alumni', 'both'],
    default: 'both'
  },
  category: {
    type: String,
    enum: ['career', 'technical', 'entrepreneurship', 'personal-development', 'industry-insights'],
    required: true
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  recording: {
    available: {
      type: Boolean,
      default: false
    },
    url: String,
    password: String
  },
  materials: [{
    title: String,
    url: String,
    type: {
      type: String,
      enum: ['slides', 'document', 'video', 'other']
    }
  }],
  feedback: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  reminderSent: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for search and filtering
webinarSchema.index({ title: 'text', description: 'text' });
webinarSchema.index({ date: 1, status: 1 });
webinarSchema.index({ host: 1 });
webinarSchema.index({ category: 1, level: 1 });
webinarSchema.index({ featured: 1, date: 1 });

module.exports = mongoose.model('Webinar', webinarSchema);