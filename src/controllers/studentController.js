const crypto = require("crypto");
const { readData, writeData } = require("../utils/file.util");
const { calculateRank } = require("../utils/ranking");

// ---------------- VALIDATION ----------------
const isValidStudent = ({ name, email, age, marks }) => {
  return (
    name &&
    email &&
    age !== undefined &&
    age !== "" &&
    marks !== undefined &&
    marks !== ""
  );
};

// ---------------- CREATE ----------------
exports.createStudent = (req, res) => {
  const { name, email, age, marks } = req.body;

  if (!isValidStudent({ name, email, age, marks })) {
    return res
      .status(400)
      .json({ message: "Name, email, age and marks are required" });
  }

  const students = readData();

  const newStudent = {
    id: crypto.randomUUID(),
    name,
    email,
    age: Number(age),
    marks: Number(marks),
  };

  students.push(newStudent);
  writeData(students);

  res.status(201).json(newStudent);
};

// ---------------- GET ALL ----------------
exports.getStudents = (req, res) => {
  const students = readData();
  res.json(students);
};

// ---------------- GET BY ID ----------------
exports.getStudentById = (req, res) => {
  const students = readData();

  const student = students.find(function (item) {
    return item.id === req.params.id;
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};

// ---------------- UPDATE ----------------
exports.updateStudent = (req, res) => {
  const students = readData();
  const id = req.params.id;

  let found = false;

  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      students[i].name = req.body.name || students[i].name;
      students[i].email = req.body.email || students[i].email;
      students[i].age = req.body.age
        ? Number(req.body.age)
        : students[i].age;
      students[i].marks = req.body.marks
        ? Number(req.body.marks)
        : students[i].marks;

      found = true;
    }
  }

  if (!found) {
    return res.status(404).json({ message: "Student not found" });
  }

  writeData(students);

  res.json({ message: "Student updated" });
};

// ---------------- DELETE ----------------
exports.deleteStudent = (req, res) => {
  const students = readData();
  const id = req.params.id;

  const filtered = students.filter(function (s) {
    return s.id !== id;
  });

  if (filtered.length === students.length) {
    return res.status(404).json({ message: "Student not found" });
  }

  writeData(filtered);

  res.json({ message: "Student deleted" });
};

// ---------------- RANKING ----------------
exports.getRankings = (req, res) => {
  const students = readData();

  const ranked = calculateRank(students);

  res.json(ranked);
};

// ---------------- TOPPER ----------------
exports.getTopper = (req, res) => {
  const students = readData();

  if (students.length === 0) {
    return res.status(404).json({ message: "No students found" });
  }

  const ranked = calculateRank(students);

  res.json(ranked[0]); // highest marks
};