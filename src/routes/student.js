const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.post('/', auth, studentController.addStudent);
router.get('/', auth, studentController.getStudents);
router.get('/me', auth, studentController.getCurrentStudent);
router.delete('/:id', auth, studentController.deleteStudent);
router.get('/circulars', auth, studentController.getCirculars);
router.get('/:id', auth, studentController.getStudentById);

module.exports = router;
