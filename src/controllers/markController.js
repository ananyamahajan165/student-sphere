const Student = require('../models/Student');
const Mark = require('../models/Mark');

exports.addMark = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can add marks' });
    }

    const { studentId, subject, marksObtained, maxMarks } = req.body;
    if (!studentId || !subject || marksObtained === undefined || maxMarks === undefined) {
      return res.status(400).json({ message: 'studentId, subject, marksObtained, and maxMarks are required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const parsedMarks = Number(marksObtained);
    const parsedMax = Number(maxMarks);
    if (!Number.isFinite(parsedMarks) || parsedMarks < 0 || !Number.isFinite(parsedMax) || parsedMax <= 0) {
      return res.status(400).json({ message: 'Marks and max marks must be valid positive numbers' });
    }

    const percentage = Math.round((parsedMarks / parsedMax) * 100);
    const mark = await Mark.findOneAndUpdate(
      { studentId, subject },
      { marksObtained: parsedMarks, maxMarks: parsedMax, percentage, mentorId: req.user.userId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: 'Marks saved', mark });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const paramId = req.params.studentId || req.query.studentId;
    let query = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student) return res.status(404).json({ message: 'Student record not found' });
      query.studentId = student._id;
    } else if (paramId) {
      query.studentId = paramId;
    }

    const marks = await Mark.find(query).lean();
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
