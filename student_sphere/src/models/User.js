const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'mentor'], default: 'student' },
  profile: {
    enrollmentNumber: { type: String },
    department: { type: String },
    semester: { type: String },
    year: { type: String },
    phone: { type: String },
  },
  profileImage: { type: String },
});

module.exports = mongoose.model('User', userSchema);
