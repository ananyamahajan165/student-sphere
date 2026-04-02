const express = require("express");
const router = express.Router();

const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getRankings,
  getTopper
} = require("../controllers/studentController");

router.post("/", createStudent);
router.get("/", getStudents);
router.get("/rank", getRankings);
router.get("/topper", getTopper);
router.get("/:id", getStudentById);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;