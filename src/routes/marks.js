const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const markController = require('../controllers/markController');

router.post('/', auth, markController.addMark);
router.get('/', auth, markController.getMarks);

module.exports = router;
