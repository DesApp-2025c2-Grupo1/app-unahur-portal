const { findById } = require('../repositories/roles.repository');


const getRoleById = async (id) => {
    try {
        const role = await findById(id);
        if (!role) {
            throw new Error('Role not found');
        }
        return role.name;
    } catch (error) {
        console.error('Error getting role:', error);
        throw error;
    }
};

module.exports = {
    getRoleById
};