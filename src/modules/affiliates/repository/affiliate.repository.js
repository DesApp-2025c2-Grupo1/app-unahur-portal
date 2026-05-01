const db = require('../../../database/db');

const createAffiliate = async (affiliate, trx = db) => {
    return trx('affiliates').insert(affiliate);
}

const existsAffiliate = async (document_number, document_type, trx = db) => {
    return trx('affiliates').where({ document_number, document_type }).first();
}

const getAffiliateById = async (id, trx = db) => {
    return trx('affiliates')
        .join('plans', 'affiliates.plan_id', '=', 'plans.id')
        .select('affiliates.*', 'plans.plan_name as plan_type', 'plans.plan_code')
        .where('affiliates.id', id)
        .first();
}

const getAffiliatesByStatus = async (status, trx = db) => {
    return trx('affiliates')
        .join('plans', 'affiliates.plan_id', '=', 'plans.id')
        .select('affiliates.*', 'plans.plan_name as plan_type', 'plans.plan_code')
        .where('affiliates.status', status);
}

const getAllAffiliates = async (trx = db) => {
    return trx('affiliates')
        .join('plans', 'affiliates.plan_id', '=', 'plans.id')
        .select('affiliates.*', 'plans.plan_name as plan_type', 'plans.plan_code');
}

// Metodo para obtener el afiliado por id de usuario
const getAffiliateByUserId = async (userId, trx = db) => {
    return trx('affiliates')
        .join('plans', 'affiliates.plan_id', '=', 'plans.id')
        .select('affiliates.*', 'plans.plan_name as plan_type', 'plans.plan_code')
        .where('affiliates.user_id', userId)
        .first();
}

const activateAffiliate = async (id, trx = db) => {
    return trx('affiliates').where({ id }).update({ status: true });
}

const deactivateAffiliate = async (id, trx = db) => {
    return trx('affiliates').where({ id }).update({ status: false });
}

const getLastCredencialNumber = async (trx = db) => {
    return trx('affiliates').max('credencial_number').first();
}

module.exports = {
    createAffiliate,
    existsAffiliate,
    getAffiliateById,
    getAffiliatesByStatus,
    getAllAffiliates,
    activateAffiliate,
    deactivateAffiliate,
    getAffiliateByUserId,
    getLastCredencialNumber
}