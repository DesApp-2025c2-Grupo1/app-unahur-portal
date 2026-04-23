const db = require('../../../database/db');

const findByEmail = async (email) => {
    return await db('users').where({ email }).first();
};

const createUser = async (userData) => {
    const [user] = await db('users').insert(userData).returning('*');
    return user;
};


module.exports = {
    findByEmail,
    createUser
};
