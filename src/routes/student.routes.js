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

router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

module.exports = router;    
