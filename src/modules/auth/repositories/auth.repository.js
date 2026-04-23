const db = require('../../../database/db');

const findByEmail = async (email) => {
    return await db('usuarios as u')
        .select('u.*', db.raw("json_agg(r.name) as roles"))
        .leftJoin('usuario_roles as ur', 'u.id_usuario', 'ur.id_usuario')
        .leftJoin('roles as r', 'ur.id_rol', 'r.id_rol')
        .where({ 'u.email': email })
        .groupBy('u.id_usuario')
        .first();
};

const createUser = async (userData) => {
    const [user] = await db('usuarios').insert(userData).returning('*');
    return user;
};

module.exports = {
    findByEmail,
    createUser
};

