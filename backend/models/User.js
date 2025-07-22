const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  college: { type: String, required: true },
  branch: { type: String, required: true },
  year: { type: String, required: true },
  isWorking: { type: String },
  company: { type: String },
  role: { type: String },
  image: { type: String }, // base64 or URL
  requests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notifications: [{ type: String }]
});

module.exports = mongoose.model('User', userSchema);
