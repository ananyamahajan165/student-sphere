const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const attendanceController = require('../controllers/attendanceController');

router.post('/', auth, attendanceController.addAttendance);
router.get('/', auth, attendanceController.getAttendance);
router.get('/:studentId', auth, attendanceController.getAttendanceByStudent);
router.put('/:id', auth, attendanceController.updateAttendance);
router.delete('/:id', auth, attendanceController.deleteAttendance);

module.exports = router;
