const db = require('../config/db');

// Función existente
const calculateMacros = async (req, res) => {
    try {
        const userResult = await db.query('SELECT age, gender, height, current_weight, target_weight, activity_level FROM users WHERE id = $1', [req.user.id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const { age, gender, height, current_weight, activity_level, target_weight } = userResult.rows[0];

        let tmb = (10 * current_weight) + (6.25 * height) - (5 * age);
        tmb += gender === 'M' ? 5 : -161;

        const activityMultipliers = {
            light: 1.375,
            moderate: 1.55,
            active: 1.725,
            fighter: 1.9
        };

        const multiplier = activityMultipliers[activity_level] || 1.2;
        let dailyEnergyExpenditure = tmb * multiplier;

        let dailyCalories = dailyEnergyExpenditure;
        let goalType = 'maintenance';

        if (target_weight < current_weight) {
            dailyCalories -= 500;
            goalType = 'weight_loss';
        } else if (target_weight > current_weight) {
            dailyCalories += 500;
            goalType = 'muscle_gain';
        }

        const isFighterProtocol = activity_level === 'fighter';
        const proteinFactor = (goalType === 'weight_loss' || isFighterProtocol) ? 2.2 : 1.8;

        const proteinGrams = proteinFactor * current_weight;
        const proteinCalories = proteinGrams * 4;

        const fatCalories = dailyCalories * 0.25;
        const fatGrams = fatCalories / 9;

        const carbCalories = dailyCalories - proteinCalories - fatCalories;
        const carbGrams = Math.max(0, carbCalories / 4);

        return res.status(200).json({
            metrics: {
                imc: (current_weight / Math.pow(height / 100, 2)).toFixed(2),
                tmb: Math.round(tmb),
                daily_energy_expenditure: Math.round(dailyEnergyExpenditure),
                target_calories: Math.round(dailyCalories),
                goal: goalType
            },
            macros: {
                protein_grams: Math.round(proteinGrams),
                fat_grams: Math.round(fatGrams),
                carbs_grams: Math.round(carbGrams)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error interno calculando métricas metabólicas" });
    }
};

// NUEVAS FUNCIONES
const addMeal = async (req, res) => {
    try {
        const { meal_type, name, calories, protein, carbs, fats, portion } = req.body;

        if (!name || isNaN(calories)) {
            return res.status(400).json({ error: 'Faltan datos de la comida' });
        }

        const newMeal = await db.query(
            `INSERT INTO meals (user_id, meal_type, name, calories, protein, carbs, fats, portion) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.user.id, meal_type, name, calories, protein || 0, carbs || 0, fats || 0, portion || '1 porción']
        );

        res.status(201).json(newMeal.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registrando comida' });
    }
};

const getDailyMeals = async (req, res) => {
    try {
        // Obtener las comidas de las últimas 24 horas o del día actual
        const meals = await db.query(
            `SELECT * FROM meals WHERE user_id = $1 AND consumed_at >= CURRENT_DATE ORDER BY consumed_at DESC`,
            [req.user.id]
        );

        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFats = 0;

        meals.rows.forEach(meal => {
            totalCalories += meal.calories;
            totalProtein += Number(meal.protein);
            totalCarbs += Number(meal.carbs);
            totalFats += Number(meal.fats);
        });

        res.status(200).json({
            meals: meals.rows,
            summary: {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fats: totalFats
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo comidas del día' });
    }
};

module.exports = {
    calculateMacros,
    addMeal,
    getDailyMeals
};
