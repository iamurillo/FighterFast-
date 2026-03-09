const db = require('../config/db');

// Iniciar un nuevo período de ayuno
const startFast = async (req, res) => {
    try {
        const { target_hours, is_fighter_mode } = req.body;

        // Verificar si ya hay un ayuno activo
        const activeFast = await db.query(
            `SELECT * FROM fasts WHERE user_id = $1 AND status = 'active'`,
            [req.user.id]
        );

        if (activeFast.rows.length > 0) {
            return res.status(400).json({ error: 'Ya tienes un ayuno en curso' });
        }

        const newFast = await db.query(
            `INSERT INTO fasts (user_id, start_time, target_hours, is_fighter_mode, status) 
       VALUES ($1, CURRENT_TIMESTAMP, $2, $3, 'active') RETURNING *`,
            [req.user.id, target_hours || 16, is_fighter_mode || false]
        );

        res.status(201).json(newFast.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error iniciando ayuno' });
    }
};

// Detener el ayuno activo y registrar tiempo final
const stopFast = async (req, res) => {
    try {
        const activeFast = await db.query(
            `SELECT * FROM fasts WHERE user_id = $1 AND status = 'active'`,
            [req.user.id]
        );

        if (activeFast.rows.length === 0) {
            return res.status(404).json({ error: 'No hay ayunos activos actualmente' });
        }

        const fastId = activeFast.rows[0].id;

        const completedFast = await db.query(
            `UPDATE fasts SET end_time = CURRENT_TIMESTAMP, status = 'completed' 
       WHERE id = $1 RETURNING *`,
            [fastId]
        );

        res.status(200).json(completedFast.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error finalizando ayuno' });
    }
};

// Obtener el estado del ayuno actual y el historial
const getFasts = async (req, res) => {
    try {
        const active = await db.query(
            `SELECT * FROM fasts WHERE user_id = $1 AND status = 'active' LIMIT 1`,
            [req.user.id]
        );

        const history = await db.query(
            `SELECT * FROM fasts WHERE user_id = $1 AND status != 'active' ORDER BY created_at DESC LIMIT 10`,
            [req.user.id]
        );

        res.status(200).json({
            active: active.rows.length > 0 ? active.rows[0] : null,
            history: history.rows
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error obteniendo historial de ayuno' });
    }
};

module.exports = {
    startFast,
    stopFast,
    getFasts
};
