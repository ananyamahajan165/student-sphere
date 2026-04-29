const Student = require('../models/Student');
const Mark = require('../models/Mark');
const Attendance = require('../models/Attendance');

const CIRCULARS = [
  {
    title: 'Mid-semester examination schedule',
    message: 'University exams will begin next Monday. Check your timetable and be on time.',
    date: '2026-04-28',
  },
  {
    title: 'Library access update',
    message: 'Library timings are extended till 8 PM for the upcoming assessment week.',
    date: '2026-04-27',
  },
  {
    title: 'Internal marks submission',
    message: 'All subject mentors must upload internal marks before Friday evening.',
    date: '2026-04-26',
  },
];

function calculateAverageMarks(marks = []) {
  if (!marks.length) return 0;
  const total = marks.reduce((sum, record) => sum + (record.percentage || 0), 0);
  return Math.round(total / marks.length);
}

function buildStudentResponse(student, marks = [], attendanceRecord = null) {
  return {
    _id: student._id,
    id: student._id,
    name: student.name,
    enrollmentNumber: student.enrollmentNumber,
    department: student.department,
    semester: student.semester,
    year: student.year,
    phone: student.phone,
    mentorId: student.mentorId,
    user: student.user,
    personalDetails: {
      enrollmentNumber: student.enrollmentNumber,
      department: student.department,
      semester: student.semester,
      year: student.year,
      phone: student.phone,
    },
    marks,
    attendance: attendanceRecord,
    marksAverage: calculateAverageMarks(marks),
    attendancePercentage: attendanceRecord ? attendanceRecord.percentage : null,
  };
}

exports.getCirculars = async (req, res) => {
  try {
    res.json(CIRCULARS);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addStudent = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can add students' });
    }

    const { name, enrollmentNumber, department, semester, year, phone } = req.body;
    if (!name || !enrollmentNumber || !department || !semester || !year || !phone) {
      return res.status(400).json({ message: 'All student fields are required' });
    }

    const existingStudent = await Student.findOne({ enrollmentNumber: enrollmentNumber.trim() });
    if (existingStudent) {
      return res.status(400).json({ message: 'A student with that enrollment number already exists' });
    }

    const student = new Student({
      name: name.trim(),
      enrollmentNumber: enrollmentNumber.trim(),
      department: department.trim(),
      semester: semester.trim(),
      year: year.trim(),
      phone: phone.trim(),
      mentorId: req.user.userId,
    });
    await student.save();
    res.status(201).json({ message: 'Student added', student: buildStudentResponse(student.toObject(), [], null) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCurrentStudent = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can access this endpoint' });
    }

    const student = await Student.findOne({ user: req.user.userId }).lean();
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }

    const marks = await Mark.find({ studentId: student._id }).lean();
    const attendanceRecord = await Attendance.findOne({ studentId: student._id }).lean();
    res.json(buildStudentResponse(student, marks, attendanceRecord));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudents = async (req, res) => {
  try {
    if (req.user.role === 'mentor') {
      const students = await Student.find({ mentorId: req.user.userId }).lean();
      const studentIds = students.map((student) => student._id);
      const marks = await Mark.find({ studentId: { $in: studentIds } }).lean();
      const attendance = await Attendance.find({ studentId: { $in: studentIds } }).lean();

      const studentsWithStats = students.map((student) => {
        const studentMarks = marks.filter((record) => record.studentId.toString() === student._id.toString());
        const attendanceRecord = attendance.find((record) => record.studentId.toString() === student._id.toString()) || null;
        return buildStudentResponse(student, studentMarks, attendanceRecord);
      });
      return res.json(studentsWithStats);
    }

    const student = await Student.findOne({ user: req.user.userId }).lean();
    if (!student) {
      return res.status(404).json({ message: 'Student record not found' });
    }
    const marks = await Mark.find({ studentId: student._id }).lean();
    const attendanceRecord = await Attendance.findOne({ studentId: student._id }).lean();
    return res.json([buildStudentResponse(student, marks, attendanceRecord)]);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can access student details by ID' });
    }
    const { id } = req.params;
    const student = await Student.findOne({ _id: id, mentorId: req.user.userId }).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const marks = await Mark.find({ studentId: student._id }).lean();
    const attendanceRecord = await Attendance.findOne({ studentId: student._id }).lean();
    res.json(buildStudentResponse(student, marks, attendanceRecord));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can update students' });
    }
    const { id } = req.params;
    const { name, enrollmentNumber, department, semester, year, phone } = req.body;
    const student = await Student.findOne({ _id: id, mentorId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    student.name = name?.trim() || student.name;
    student.enrollmentNumber = enrollmentNumber?.trim() || student.enrollmentNumber;
    student.department = department?.trim() || student.department;
    student.semester = semester?.trim() || student.semester;
    student.year = year?.trim() || student.year;
    student.phone = phone?.trim() || student.phone;
    await student.save();
    const marks = await Mark.find({ studentId: student._id }).lean();
    const attendanceRecord = await Attendance.findOne({ studentId: student._id }).lean();
    res.json({ message: 'Student updated', student: buildStudentResponse(student.toObject(), marks, attendanceRecord) });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    if (req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Only mentors can delete students' });
    }
    const { id } = req.params;
    const student = await Student.findOneAndDelete({ _id: id, mentorId: req.user.userId });
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    await Mark.deleteMany({ studentId: id });
    await Attendance.deleteMany({ studentId: id });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
