require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/nutrition', require('./routes/nutritionRoutes'));
app.use('/api/fasts', require('./routes/fastingRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/foods', require('./routes/foodsRoutes'));

// Main health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'FighterFast API is running 🥊' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
