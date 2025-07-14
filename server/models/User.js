const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'alumni', 'admin'],
    default: 'student'
  },
  college: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  year: {
    type: String,
    required: true
  },
  company: {
    type: String,
    default: ''
  },
  jobRole: {
    type: String,
    default: ''
  },
  isWorking: {
    type: Boolean,
    default: false
  },
  skills: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  github: {
    type: String,
    default: ''
  },
  linkedin: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    default: ''
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  profileViews: {
    type: Number,
    default: 0
  },
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

// Index for search optimization
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ college: 1, branch: 1 });
userSchema.index({ fullName: 'text', bio: 'text' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.verificationToken;
  delete userObject.resetPasswordToken;
  delete userObject.resetPasswordExpires;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);