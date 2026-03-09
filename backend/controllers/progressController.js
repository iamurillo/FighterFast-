const db = require('../config/db');

// Obtener el perfil extendido y el progreso de peso
const getProgress = async (req, res) => {
    try {
        // Info del usuario
        const userResult = await db.query(`SELECT * FROM users WHERE id = $1`, [req.user.id]);

        // Historial de pesos
        const weightsResult = await db.query(
            `SELECT * FROM weights WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 30`,
            [req.user.id]
        );

        // Historial de Entrenamientos
        const workoutsResult = await db.query(
            `SELECT * FROM workouts WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 10`,
            [req.user.id]
        );

        // Eliminamos data sensible
        const userData = { ...userResult.rows[0] };
        delete userData.password_hash;

        res.status(200).json({
            user: userData,
            weights: weightsResult.rows,
            workouts: workoutsResult.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo progreso' });
    }
};

// Registrar un nuevo peso y actualizar el peso actual en la tabla User
const addWeight = async (req, res) => {
    try {
        const { weight, body_fat_percentage } = req.body;

        if (!weight) return res.status(400).json({ error: 'El peso es obligatorio' });

        // 1. Insertar en tabla histórica `weights`
        const newWeight = await db.query(
            `INSERT INTO weights (user_id, weight, body_fat_percentage) VALUES ($1, $2, $3) RETURNING *`,
            [req.user.id, weight, body_fat_percentage || null]
        );

        // 2. Actualizar `current_weight` en la tabla principal `users`
        await db.query(
            `UPDATE users SET current_weight = $1 WHERE id = $2`,
            [weight, req.user.id]
        );

        res.status(201).json(newWeight.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registrando peso' });
    }
};

// Registrar entrenamiento (ej: BJJ, Gym)
const addWorkout = async (req, res) => {
    try {
        const { type, duration_minutes, calories_burned } = req.body;

        if (!type || !duration_minutes) return res.status(400).json({ error: 'Tipo de entreno y duración son obligatorios' });

        const newWorkout = await db.query(
            `INSERT INTO workouts (user_id, type, duration_minutes, calories_burned) VALUES ($1, $2, $3, $4) RETURNING *`,
            [req.user.id, type, duration_minutes, calories_burned || null]
        );

        res.status(201).json(newWorkout.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registrando entrenamiento' });
    }
};

module.exports = {
    getProgress,
    addWeight,
    addWorkout
};
