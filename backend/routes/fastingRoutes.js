const express = require('express');
const router = express.Router();
const fastingController = require('../controllers/fastingController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/start', verifyToken, fastingController.startFast);
router.post('/stop', verifyToken, fastingController.stopFast);
router.get('/', verifyToken, fastingController.getFasts);

module.exports = router;
