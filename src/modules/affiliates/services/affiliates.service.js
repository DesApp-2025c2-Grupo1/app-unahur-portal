const affiliateRepository = require('../repository/affiliate.repository');
const authService = require('../../auth/services/auth.service');
const affiliateModel = require('../model/affiliate.model');
const mailService = require('../../mail/mail.service');
const { affiliateSchema } = require('../utils/validation');
const db = require('../../../database/db');

const createAffiliate = async (req, res) => {
  // 1. Validar el input
  const { error, value } = affiliateSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: 'Datos inválidos', details: error.details });
  }

  const affiliate = new affiliateModel(value);

  // 2. Iniciar Transacción
  const trx = await db.transaction();

  try {
    if (await existsAffiliate(affiliate.document_number, affiliate.document_type, trx)) {
      await trx.rollback();
      return res.status(400).json({ message: 'El afiliado ya existe' });
    }

    const credencialNumber = await generateCredencialNumber(trx);
    
    // Crear usuario vinculado en la misma transacción
    const user = await authService.registerInternal(affiliate.email, trx);

    affiliate.user_id = user.id;
    affiliate.credencial_number = credencialNumber;

    const newAffiliate = await affiliateRepository.createAffiliate(affiliate, trx);

    await trx.commit();
    return res.status(200).json({ id: newAffiliate.id, message: 'Afiliado creado exitosamente' });

  } catch (error) {
    await trx.rollback();
    console.error('Error al crear afiliado:', error);
    return res.status(500).json({ message: 'Error interno al procesar la solicitud' });
  }
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
    return null;
  }

  return affiliate;
}

const activateAffiliate = async (req, res) => {
  const { id } = req.params;

  // Obtener el afiliado para tener su email y nombre
  const affiliate = await affiliateRepository.getAffiliateById(id);
  if (!affiliate) {
    return res.status(404).json({ message: 'El afiliado no existe' });
  }

  const result = await affiliateRepository.activateAffiliate(id);

  if (result) {
    // Enviar email de activación
    try {
      await mailService.sendEmail(
        affiliate.email,
        'Tu cuenta ha sido activada - Portal UNAHUR',
        'account_activated',
        { name: `${affiliate.first_name} ${affiliate.last_name}` }
      );
    } catch (mailError) {
      console.error('Error al enviar email de activación:', mailError);
    }
  }

  return res.status(200).json({ message: 'Afiliado activado exitosamente' });
}

const deactivateAffiliate = async (req, res) => {
  const { id } = req.params;

  // Obtener el afiliado para tener su email y nombre
  const affiliate = await affiliateRepository.getAffiliateById(id);
  if (!affiliate) {
    return res.status(404).json({ message: 'El afiliado no existe' });
  }

  const result = await affiliateRepository.deactivateAffiliate(id);

  if (result) {
    // Enviar email de desactivación
    try {
      await mailService.sendEmail(
        affiliate.email,
        'Tu cuenta ha sido desactivada - Portal UNAHUR',
        'account_deactivated',
        { name: `${affiliate.first_name} ${affiliate.last_name}` }
      );
    } catch (mailError) {
      console.error('Error al enviar email de desactivación:', mailError);
    }
  }

  return res.status(200).json({ message: 'Afiliado desactivado exitosamente' });
}


const getAllAffiliates = async (req, res) => {
  const affiliates = await affiliateRepository.getAllAffiliates();
  return res.status(200).json(affiliates);
}


/* metodos auxiliares para la creacion de un afiliado */

const existsAffiliate = async (document_number, document_type, trx) => {
  return affiliateRepository.existsAffiliate(document_number, document_type, trx);
}

const generateCredencialNumber = async (trx) => {
  const result = await affiliateRepository.getLastCredencialNumber(trx);
  const max = result ? result.max : null;

  if (!max) {
    return '0000001-01';
  }
  
  // max es algo como "0000001-01"
  const [numberPart] = max.split('-');
  const nextNumber = parseInt(numberPart) + 1;
  return `${nextNumber.toString().padStart(7, '0')}-01`;
}

module.exports = {
  createAffiliate,
  getAffiliatesByStatus,
  getAffiliateById,
  activateAffiliate,
  deactivateAffiliate,
  getAffiliateByUserId,
  getAllAffiliates
}