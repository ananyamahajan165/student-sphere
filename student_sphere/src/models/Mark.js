const mongoose = require('mongoose');

const markSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    subject: { type: String, required: true },
    marksObtained: { type: Number, required: true, min: 0 },
    maxMarks: { type: Number, required: true, min: 1 },
    percentage: { type: Number, required: true, min: 0, max: 100 },
  },
  { timestamps: true }
);

markSchema.index({ studentId: 1, subject: 1 }, { unique: true });

module.exports = mongoose.model('Mark', markSchema);
