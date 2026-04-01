const express = require("express");
const router = express.Router();
const {
  getStudents,
  addStudent,
  getRankings
} = require("../controllers/studentController");

router.get("/", getStudents);
router.post("/", addStudent);
router.get("/rank", getRankings);

module.exports = router;    