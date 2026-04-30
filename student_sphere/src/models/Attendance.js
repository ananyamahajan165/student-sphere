const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, unique: true },
    totalClasses: { type: Number, required: true, min: 0 },
    attendedClasses: { type: Number, required: true, min: 0 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Attendance', attendanceSchema);
