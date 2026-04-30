const Student = require('../models/Student');
const Attendance = require('../models/Attendance');

exports.addAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can add attendance records' });
    }

    const { studentId, totalClasses, attendedClasses } = req.body;
    if (!studentId || totalClasses === undefined || attendedClasses === undefined) {
      return res.status(400).json({ message: 'studentId, totalClasses, and attendedClasses are required' });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const parsedTotal = Number(totalClasses);
    const parsedAttended = Number(attendedClasses);
    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0 || !Number.isFinite(parsedAttended) || parsedAttended < 0) {
      return res.status(400).json({ message: 'Attendance values must be valid numbers' });
    }
    if (parsedAttended > parsedTotal) {
      return res.status(400).json({ message: 'Attended classes cannot exceed total classes' });
    }

    const percentage = Math.round((parsedAttended / parsedTotal) * 100);
    const attendance = await Attendance.findOneAndUpdate(
      { studentId },
      { totalClasses: parsedTotal, attendedClasses: parsedAttended, percentage },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(201).json({ message: 'Attendance saved', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendance = async (req, res) => {
  try {
    const studentId = req.query.studentId;
    let query = {};

    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student) return res.status(404).json({ message: 'Student record not found' });
      query.studentId = student._id;
    } else if (studentId) {
      query.studentId = studentId;
    }

    const attendance = await Attendance.find(query).lean();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAttendanceByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (req.user.role === 'student') {
      const student = await Student.findOne({ user: req.user.userId });
      if (!student || student._id.toString() !== studentId) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (req.user.role === 'mentor' && student.mentorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const attendance = await Attendance.find({ studentId }).lean();
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can update attendance records' });
    }
    const { id } = req.params;
    const { totalClasses, attendedClasses } = req.body;
    if (totalClasses === undefined || attendedClasses === undefined) {
      return res.status(400).json({ message: 'totalClasses and attendedClasses are required' });
    }
    const attendance = await Attendance.findById(id);
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    const student = await Student.findById(attendance.studentId);
    if (!student || student.mentorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const parsedTotal = Number(totalClasses);
    const parsedAttended = Number(attendedClasses);
    if (!Number.isFinite(parsedTotal) || parsedTotal <= 0 || !Number.isFinite(parsedAttended) || parsedAttended < 0) {
      return res.status(400).json({ message: 'Attendance values must be valid numbers' });
    }
    if (parsedAttended > parsedTotal) {
      return res.status(400).json({ message: 'Attended classes cannot exceed total classes' });
    }
    attendance.totalClasses = parsedTotal;
    attendance.attendedClasses = parsedAttended;
    attendance.percentage = Math.round((parsedAttended / parsedTotal) * 100);
    await attendance.save();
    res.json({ message: 'Attendance updated', attendance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAttendance = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can delete attendance records' });
    }
    const { id } = req.params;
    const attendance = await Attendance.findById(id);
    if (!attendance) return res.status(404).json({ message: 'Attendance record not found' });
    const student = await Student.findById(attendance.studentId);
    if (!student || student.mentorId.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await attendance.deleteOne();
    res.json({ message: 'Attendance record deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
