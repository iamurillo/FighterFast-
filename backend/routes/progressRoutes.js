const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progressController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/', verifyToken, progressController.getProgress);
router.post('/weight', verifyToken, progressController.addWeight);
router.post('/workout', verifyToken, progressController.addWorkout);

module.exports = router;
