const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  marks: { type: Number, required: true },
  role: { type: String, enum: ['student', 'teacher'], default: 'student' },
  password: { type: String, required: true }
});

module.exports = mongoose.model('Student', studentSchema);
