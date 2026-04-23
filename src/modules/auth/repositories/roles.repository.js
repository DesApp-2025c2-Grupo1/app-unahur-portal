const db = require('../../../database/db');

const findById = async (id) => {
    return await db('roles').where({ id }).first();
};

module.exports = {
    findById
};