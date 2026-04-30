const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const markController = require('../controllers/markController');

router.post('/', auth, markController.addMark);
router.get('/', auth, markController.getMarks);
router.get('/:studentId', auth, markController.getMarksByStudent);
router.put('/:id', auth, markController.updateMark);
router.delete('/:id', auth, markController.deleteMark);

module.exports = router;
