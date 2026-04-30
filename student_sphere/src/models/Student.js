const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, sparse: true },
  mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  enrollmentNumber: { type: String, required: true, unique: true },
  department: { type: String, required: true },
  semester: { type: String, required: true },
  year: { type: String, required: true },
  phone: { type: String, required: true },
});

module.exports = mongoose.model('Student', studentSchema);
