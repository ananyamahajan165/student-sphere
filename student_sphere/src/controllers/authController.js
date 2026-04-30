const User = require('../models/User');
const Student = require('../models/Student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

function createCaseInsensitiveEmailQuery(email) {
  return new RegExp(`^${normalizeEmail(email).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i');
}

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, profile = {} } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    if (role !== 'mentor' && role !== 'student') {
      return res.status(400).json({ message: 'Role must be student or mentor' });
    }

    const existingUser = await User.findOne({ email: createCaseInsensitiveEmailQuery(normalizedEmail) });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      role,
      profile: role === 'student' ? {
        enrollmentNumber: String(profile.enrollmentNumber || ''),
        department: String(profile.department || ''),
        semester: String(profile.semester || ''),
        year: String(profile.year || ''),
        phone: String(profile.phone || ''),
      } : undefined,
    });
    await user.save();
    if (role === 'student') {
      const student = new Student({
        user: user._id,
        mentorId: null,
        name,
        enrollmentNumber: String(profile.enrollmentNumber || ''),
        department: String(profile.department || ''),
        semester: String(profile.semester || ''),
        year: String(profile.year || ''),
        phone: String(profile.phone || ''),
      });
      await student.save();
    }
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: createCaseInsensitiveEmailQuery(normalizedEmail) });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
