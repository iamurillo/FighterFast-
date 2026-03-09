const express = require('express');
const router = express.Router();
const foodsController = require('../controllers/foodsController');
const verifyToken = require('../middleware/authMiddleware');

router.post('/seed', verifyToken, foodsController.seedFoods);
router.get('/search', verifyToken, foodsController.searchFoods);

module.exports = router;
