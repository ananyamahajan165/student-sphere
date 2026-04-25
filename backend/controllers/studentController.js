const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, age, marks, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({ name, email, age, marks, role, password: hashedPassword });
    await student.save();
    res.status(201).json({ message: 'Student registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Student.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
    res.json({ name: user.name, email: user.email, role: user.role, age: user.age, marks: user.marks });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  const students = await Student.find({ role: 'student' });
  res.json(students);
};

exports.addStudent = async (req, res) => {
  try {
    const { name, email, age, marks, password } = req.body;
    const hashedPassword = await bcrypt.hash(password || 'student123', 10);
    const student = new Student({ name, email, age, marks, password: hashedPassword });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTopper = async (req, res) => {
  const topper = await Student.findOne({ role: 'student' }).sort({ marks: -1 });
  res.json(topper);
};

exports.getRanking = async (req, res) => {
  const students = await Student.find({ role: 'student' }).sort({ marks: -1 });
  const ranked = students.map((s, i) => ({ ...s.toObject(), rank: i + 1 }));
  res.json(ranked);
};
