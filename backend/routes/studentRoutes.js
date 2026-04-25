const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');

router.post('/register', studentController.register);
router.post('/login', studentController.login);
router.get('/', studentController.getAll);
router.post('/', studentController.addStudent);
router.get('/topper', studentController.getTopper);
router.get('/rank', studentController.getRanking);

module.exports = router;
