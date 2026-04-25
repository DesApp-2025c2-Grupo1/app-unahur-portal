const affiliateRepository = require('../repository/affiliate.repository');

const createAffiliate = async (req, res) => {
  const { affiliate } = req.body;

  if (await existsAffiliate(affiliate.document_number, affiliate.document_type)) {
    return res.status(400).json({ message: 'El afiliado ya existe' });
  }

  return affiliateRepository.createAffiliate(affiliate);
}

// Metodo auxiliar para verificar si existe un afiliado
const existsAffiliate = async (req, res) => {
  const { affiliate } = req.body;
  return affiliateRepository.existsAffiliate(affiliate.document_number, affiliate.document_type);
}

const getAffiliatesByStatus = async (req, res) => {
  const { status } = req.query;

  if (status) {
    return res.status(200).json(await affiliateRepository.getAffiliatesByStatus(status));
  }

  return res.status(200).json(await affiliateRepository.getAllAffiliates());
}

const getAffiliateById = async (req, res) => {
  const { id } = req.params;
  const affiliate = await affiliateRepository.getAffiliateById(id);
  if (!affiliate) {
    return res.status(404).json({ message: 'El afiliado no existe' });
  }
  return res.status(200).json(affiliate);
}

const getAffiliateByUserId = async (id) => {
  const affiliate = await affiliateRepository.getAffiliateByUserId(id);
  if (!affiliate) {
    return res.status(404).json({ message: 'El afiliado no existe' });
  }
  return affiliate;
}

const activateAffiliate = async (req, res) => {
  const { id } = req.params;
  const affiliate = await affiliateRepository.activateAffiliate(id);
  if (!affiliate) {
    return res.status(404).json({ message: 'El afiliado no existe' });
  }
  return res.status(200).json(affiliate);
}

const deactivateAffiliate = async (req, res) => {
  const { id } = req.params;
  const affiliate = await affiliateRepository.deactivateAffiliate(id);
  if (!affiliate) {
    return res.status(404).json({ message: 'El afiliado no existe' });
  }
  return res.status(200).json(affiliate);
}

module.exports = {
  createAffiliate,
  getAffiliatesByStatus,
  getAffiliateById,
  activateAffiliate,
  deactivateAffiliate,
  getAffiliateByUserId
}