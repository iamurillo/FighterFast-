const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ error: 'Un token es requerido para la autenticación' });
    }

    try {
        const bearerToken = token.split(' ')[1]; // Formato: "Bearer <token>"
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ error: 'Token inválido' });
    }
    return next();
};

module.exports = verifyToken;
