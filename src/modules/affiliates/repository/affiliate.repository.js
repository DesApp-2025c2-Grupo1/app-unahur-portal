const db = require('../../../database/db');

const createAffiliate = async (affiliate) => {
    return db('affiliates').insert(affiliate);
}

const existsAffiliate = async (document_number, document_type) => {
    return db('affiliates').where({ document_number, document_type }).first();
}

const getAffiliateById = async (id) => {
    return db('affiliates').where({ id }).first();
}

const getAffiliatesByStatus = async (status) => {
    return db('affiliates').where({ status });
}

const getAllAffiliates = async () => {
    return db('affiliates');
}

// Metodo para obtener el afiliado por id de usuario
const getAffiliateByUserId = async (userId) => {
    return db('affiliates').where({ user_id: userId }).first();
}

const activateAffiliate = async (id) => {
    return db('affiliates').where({ id }).update({ status: true });
}

const deactivateAffiliate = async (id) => {
    return db('affiliates').where({ id }).update({ status: false });
}

module.exports = {
    createAffiliate,
    existsAffiliate,
    getAffiliateById,
    getAffiliatesByStatus,
    getAllAffiliates,
    activateAffiliate,
    deactivateAffiliate,
    getAffiliateByUserId
}