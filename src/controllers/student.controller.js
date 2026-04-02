const crypto = require("crypto");
const { readData, writeData } = require("../utils/file.util");

const isValidStudent = ({ name, email, age }) => {
  return name && email && age !== undefined && age !== "";
};

exports.createStudent = (req, res) => {
  const { name, email, age } = req.body;

  if (!isValidStudent({ name, email, age })) {
    return res.status(400).json({ message: "Name, email and age are required" });
  }

  const students = readData();
  const newStudent = {
    id: crypto.randomUUID(),
    name,
    email,
    age: Number(age)
  };

  students.push(newStudent);
  writeData(students);

  res.status(201).json(newStudent);
};

exports.getStudents = (req, res) => {
  const students = readData();
  res.json(students);
};

exports.getStudentById = (req, res) => {
  const students = readData();
  const student = students.find((item) => item.id === req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(student);
};

exports.updateStudent = (req, res) => {
  const students = JSON.parse(fs.readFileSync(filePath));

  const id = parseInt(req.params.id);

  for (let i = 0; i < students.length; i++) {
    if (students[i].id === id) {
      students[i].name = req.body.name || students[i].name;
      students[i].marks = req.body.marks || students[i].marks;
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(students, null, 2));

  res.json({ message: "Student updated" });
};



exports.deleteStudent = (req, res) => {
  const students = readData();
  const filteredStudents = students.filter((item) => item.id !== req.params.id);

  if (filteredStudents.length === students.length) {
    return res.status(404).json({ message: "Student not found" });
  }

  writeData(filteredStudents);
  res.json({ message: "Student deleted successfully" });
};
