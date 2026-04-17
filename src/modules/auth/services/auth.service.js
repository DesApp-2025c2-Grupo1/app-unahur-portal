const login = (req, res) => {
    res.status(200).json({ message: 'Login' });
};

const register = (req, res) => {
    res.status(200).json({ message: 'Register' });
};

const logout = (req, res) => {
    res.status(200).json({ message: 'Logout' });
};

const refreshToken = (req, res) => {
    res.status(200).json({ message: 'Refresh Token' });
};

module.exports = {
    login,
    register,
    logout,
    refreshToken
};