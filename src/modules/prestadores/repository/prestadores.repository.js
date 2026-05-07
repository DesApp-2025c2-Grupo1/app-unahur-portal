const db = require('../../../database/db');

const getPrestadorByCuit = async (cuit, trx = db) => {
  return trx('prestadores')
    .select(
      'prestadores.*',
      'users.password',
      'users.must_change_password',
      'users.email as user_email',
      'roles.role_name'
    )
    .join('users', 'prestadores.user_id', 'users.id')
    .join('user_roles', 'users.id', 'user_roles.user_id')
    .join('roles', 'user_roles.role_id', 'roles.id')
    .where('prestadores.cuit', cuit)
    .first();
};

const getPrestadorByUserId = async (userId, trx = db) => {
  return trx('prestadores').where({ user_id: userId }).first();
};

const getDefaultPrestador = async (trx = db) => {
  return trx('prestadores').orderBy('id').first();
};

const getDashboardStats = async (prestadorId, trx = db) => {
  const requests = await trx('prestador_requests')
    .where({ prestador_id: prestadorId })
    .orderBy('request_date', 'desc')
    .orderBy('id', 'desc');

  return {
    pendientes: requests.filter((item) => item.status === 'Pendiente').length,
    observadas: requests.filter((item) => item.status === 'Observada').length,
    actividadReciente: requests.slice(0, 5),
  };
};

const getRequests = async (prestadorId, trx = db) => {
  return trx('prestador_requests')
    .where({ prestador_id: prestadorId })
    .orderBy('request_date', 'desc')
    .orderBy('id', 'desc');
};

const updateRequestStatus = async (id, status, trx = db) => {
  const [request] = await trx('prestador_requests')
    .where({ id })
    .update({ status, updated_at: trx.fn.now() })
    .returning('*');

  return request;
};

const createRequest = async (prestadorId, data, trx = db) => {
  const [request] = await trx('prestador_requests')
    .insert({
      prestador_id: prestadorId,
      request_number: data.nro,
      affiliate_name: data.afiliado,
      type: data.tipo,
      status: data.estado,
      request_date: data.fecha,
      description: data.descripcion,
    })
    .returning('*');

  return request;
};

const getAppointmentsByDate = async (prestadorId, date, trx = db) => {
  return trx('prestador_appointments')
    .where({ prestador_id: prestadorId, appointment_date: date })
    .orderBy('start_time', 'asc');
};

const getAppointmentsByMonth = async (prestadorId, year, month, trx = db) => {
  // SQLite and Postgres support might vary for native dates, but we can just use string LIKE for `YYYY-MM-%` since `appointment_date` is likely standard YYYY-MM-DD
  const prefix = `${year}-${String(month).padStart(2, '0')}-%`;
  return trx('prestador_appointments')
    .where('prestador_id', prestadorId)
    .andWhere('appointment_date', 'like', prefix)
    .select('appointment_date')
    .groupBy('appointment_date');
};

const createAppointment = async (prestadorId, data, trx = db) => {
  const [appointment] = await trx('prestador_appointments')
    .insert({
      prestador_id: prestadorId,
      affiliate_name: data.afiliado,
      appointment_date: data.date,
      start_time: data.horaIni,
      end_time: data.horaFin,
      reason: data.motivo,
      note: data.notas || null,
    })
    .returning('*');

  return appointment;
};

const updateAppointmentNote = async (id, note, trx = db) => {
  const [appointment] = await trx('prestador_appointments')
    .where({ id })
    .update({ note, updated_at: trx.fn.now() })
    .returning('*');

  return appointment;
};

const searchAffiliates = async (query, trx = db) => {
  const like = `%${query.toLowerCase()}%`;

  return trx('affiliates')
    .select('*')
    .where(function () {
      this.whereRaw('LOWER(first_name) LIKE ?', [like])
        .orWhereRaw('LOWER(last_name) LIKE ?', [like])
        .orWhereRaw('LOWER(credencial_number) LIKE ?', [like])
        .orWhereRaw('LOWER(document_number) LIKE ?', [like]);
    })
    .limit(10);
};

const getClinicalHistoryByAffiliate = async (affiliateId, trx = db) => {
  return trx('prestador_clinical_history')
    .where({ affiliate_id: affiliateId })
    .orderBy('entry_date', 'desc')
    .orderBy('id', 'desc');
};

const getSituationTypes = async (trx = db) => {
  return trx('prestador_situation_types').select('id', 'name').orderBy('name');
};

const getSituationsByAffiliate = async (affiliateId, trx = db) => {
  return trx('prestador_affiliate_situations')
    .where({ affiliate_id: affiliateId })
    .orderBy('start_date', 'desc')
    .orderBy('id', 'desc');
};

const createSituation = async (affiliateId, data, trx = db) => {
  const [situation] = await trx('prestador_affiliate_situations')
    .insert({
      affiliate_id: affiliateId,
      type: data.tipo,
      start_date: data.fechaInicio,
      end_date: data.fechaFin || null,
      active: data.activa !== false,
    })
    .returning('*');

  return situation;
};

const updateSituation = async (affiliateId, situationId, data, trx = db) => {
  const patch = {
    updated_at: trx.fn.now(),
  };

  if (data.tipo !== undefined) patch.type = data.tipo;
  if (data.fechaInicio !== undefined) patch.start_date = data.fechaInicio;
  if (data.fechaFin !== undefined) patch.end_date = data.fechaFin || null;
  if (data.activa !== undefined) patch.active = data.activa;

  const [situation] = await trx('prestador_affiliate_situations')
    .where({ id: situationId, affiliate_id: affiliateId })
    .update(patch)
    .returning('*');

  return situation;
};

const deleteSituation = async (affiliateId, situationId, trx = db) => {
  const [deleted] = await trx('prestador_affiliate_situations')
    .where({ id: situationId, affiliate_id: affiliateId })
    .del()
    .returning('*');
  return deleted;
};

const getNotifications = async (prestadorId, trx = db) => {
  return trx('prestador_notifications')
    .where({ prestador_id: prestadorId })
    .orderBy('created_at', 'desc');
};

const markNotificationAsRead = async (id, prestadorId, trx = db) => {
  const [notification] = await trx('prestador_notifications')
    .where({ id, prestador_id: prestadorId })
    .update({ unread: false })
    .returning('*');
  return notification;
};

module.exports = {
  getPrestadorByCuit,
  getPrestadorByUserId,
  getDefaultPrestador,
  getDashboardStats,
  getRequests,
  updateRequestStatus,
  createRequest,
  getAppointmentsByDate,
  getAppointmentsByMonth,
  createAppointment,
  updateAppointmentNote,
  searchAffiliates,
  getClinicalHistoryByAffiliate,
  getSituationTypes,
  getSituationsByAffiliate,
  createSituation,
  updateSituation,
  deleteSituation,
  getNotifications,
  markNotificationAsRead,
};
