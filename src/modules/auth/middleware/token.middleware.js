const jwt = require('jsonwebtoken');

const authorize = (...allowedRoles) => {
    return (req, res, next) => {
        const token = req.cookies.token; //extraigo el token de la cookie
        if (!token) {
            return res.status(401).json({ error: 'Acceso denegado' });
        }
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
            if (!allowedRoles.includes(decodedToken.role)) {
                return res.status(403).json({ error: 'Permisos insuficientes' });
            }

            req.user = decodedToken; //aca guardo el usuario decodificado para usarlo en los controladores
            next();
        } catch (err) {
            return res.status(403).json({ error: 'Token inválido' });
        }
    };
}

module.exports = authorize;