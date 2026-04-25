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


module.exports = {
    getUserByUsername
}
