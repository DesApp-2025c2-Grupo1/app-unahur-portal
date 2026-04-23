const rolesRepository = require('../repositories/roles.repository');

const getRoleById = async (id) => {
    return await rolesRepository.findById(id);
};

module.exports = {
    getRoleById
};