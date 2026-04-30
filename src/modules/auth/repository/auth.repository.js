const db = require('../../../database/db');

const getUserByUsername = async (email) => {
    if (!email) return null;
    return db('users')
        .select('users.*', 'roles.role_name')
        .join('user_roles', 'users.id', 'user_roles.user_id')
        .join('roles', 'user_roles.role_id', 'roles.id')
        .where('users.email', email)
        .first();
}

const createUser = async (email, password) => {
    return db('users')
        .insert({ email: email, password: password })
        .returning('*');
}

// metodos para la base de datos de roles
const getRoleByRoleName = async (roleName) => {
    if (!roleName) return null;
    return db('roles').where({ role_name: roleName }).first();
}

// lo inserta en la tabla de usuarios y roles
const createUserRole = async (userId, roleId) => {
    if (!userId || !roleId) return null;
    return db('user_roles').insert({ user_id: userId, role_id: roleId }).returning('*');
}

module.exports = {
    getUserByUsername,
    createUser,
    getRoleByRoleName,
    createUserRole
}
