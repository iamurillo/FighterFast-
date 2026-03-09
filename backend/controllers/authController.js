const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const register = async (req, res) => {
    try {
        const { name, email, password, age, gender, height, current_weight, target_weight, activity_level, training_type, training_days } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
        }

        // Verificar si el usuario existe
        const userExists = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insertar usuario
        const newUser = await db.query(
            `INSERT INTO users (name, email, password_hash, age, gender, height, current_weight, target_weight, activity_level, training_type, training_days) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id, name, email`,
            [name, email, passwordHash, age, gender, height, current_weight, target_weight, activity_level, training_type, training_days]
        );

        // Generar Token
        const token = jwt.sign(
            { id: newUser.rows[0].id, email: newUser.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: newUser.rows[0],
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al registrar usuario' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
        }

        // Buscar usuario
        const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(400).json({ error: 'Credenciales inválidas' });
        }

        // Generar Token
        const token = jwt.sign(
            { id: user.rows[0].id, email: user.rows[0].email },
            process.env.JWT_SECRET,
            { expiresIn: '30d' }
        );

        // Remover hash antes de enviar la respuesta
        const userData = { ...user.rows[0] };
        delete userData.password_hash;

        res.status(200).json({
            message: 'Login exitoso',
            user: userData,
            token
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor al iniciar sesión' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await db.query('SELECT id, name, email, age, gender, height, current_weight, target_weight, activity_level, training_type, training_days, created_at FROM users WHERE id = $1', [req.user.id]);

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json(user.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener perfil' });
    }
};

module.exports = {
    register,
    login,
    getMe
};
