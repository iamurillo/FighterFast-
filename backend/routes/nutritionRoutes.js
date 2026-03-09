const express = require('express');
const router = express.Router();
const metabolicController = require('../controllers/metabolicController');
const verifyToken = require('../middleware/authMiddleware');

router.get('/calculate', verifyToken, metabolicController.calculateMacros);
router.post('/meal', verifyToken, metabolicController.addMeal);
router.get('/daily-meals', verifyToken, metabolicController.getDailyMeals);

module.exports = router;
