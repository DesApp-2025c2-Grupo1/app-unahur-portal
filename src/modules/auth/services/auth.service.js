const bcrypt = require('bcryptjs');

//servicios
const affiliateService = require('../../affiliates/services/affiliates.service');

//repositorios
const authRepository = require('../repository/auth.repository');

//utils
const { generateToken } = require('../utils/jwt.service');

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        console.log(email, password);

        if (!email || !password) {
            return res.status(400).json({ message: 'Faltan datos requeridos' });
        }

        const user = await authRepository.getUserByUsername(email);

        console.log("user", user);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // si el usuario es administrador no se valida su cuenta de afiliado
        if (user.role_name !== 'ADMIN') {
            const affiliate = await affiliateService.getAffiliateByUserId(user.id);
            console.log("affiliate", affiliate);
            if (affiliate && !affiliate.status) {
                return res.status(401).json({ message: 'Su cuenta de afiliado no esta activa' });
            }
        }

        const isPasswordValid = await validatePassword(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Los datos ingresados son incorrectos' });
        }

        const token = await generateToken(user);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 día
        });

        return res.status(200).json({
            message: 'OK',
            user: {
                id: user.id,
                role: user.role_name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
};

const validatePassword = async (password, hash) => {
    return bcrypt.compare(password, hash);
}

module.exports = {
    login
};
