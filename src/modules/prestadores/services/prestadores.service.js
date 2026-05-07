const bcrypt = require('bcryptjs');
const { generateToken } = require('../../auth/utils/jwt.service');
const prestadoresRepository = require('../repository/prestadores.repository');

const formatDate = (value) => {
  const date = new Date(value);
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(date.getUTCDate()).padStart(2, '0');
  const yyyy = date.getUTCFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const toISODate = (value) => {
  if (!value) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;

  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(String(value).trim());
  if (!match) return value;

  const [, mm, dd, yyyy] = match;
  return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
};

const initials = (name) => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase();

const ageFromBirthDate = (birthDate) => {
  const date = new Date(birthDate);
  const now = new Date();
  let age = now.getUTCFullYear() - date.getUTCFullYear();
  const monthDiff = now.getUTCMonth() - date.getUTCMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getUTCDate() < date.getUTCDate())) age -= 1;
  return age;
};

const statusColor = (status) => {
  const map = {
    Pendiente: 'bg-amber-100 text-amber-700',
    'En análisis': 'bg-indigo-100 text-indigo-700',
    Observada: 'bg-violet-100 text-violet-700',
    Aprobada: 'bg-emerald-100 text-emerald-700',
    Rechazada: 'bg-rose-100 text-rose-700',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
};

const serializeRequest = (request) => ({
  id: request.id,
  nro: request.request_number,
  afiliado: request.affiliate_name,
  tipo: request.type,
  estado: request.status,
  fecha: formatDate(request.request_date),
  descripcion: request.description,
});

const serializeActivity = (request) => ({
  id: request.request_number,
  texto: request.affiliate_name,
  tipo: request.type,
  tiempo: formatDate(request.request_date),
  color: statusColor(request.status),
});

const serializeAppointment = (appointment) => ({
  id: appointment.id,
  hora: appointment.end_time
    ? `${appointment.start_time} - ${appointment.end_time}`
    : appointment.start_time,
  nombre: appointment.affiliate_name,
  motivo: appointment.reason,
  nota: appointment.note,
});

const serializeAffiliate = (affiliate) => {
  const nombre = `${affiliate.first_name} ${affiliate.last_name}`.trim();
  return {
    id: affiliate.id,
    nombre,
    nro: affiliate.credencial_number,
    tipo: affiliate.plan_type || 'Plan UNAHUR',
    edad: ageFromBirthDate(affiliate.birth_date),
    iniciales: initials(nombre),
    color: 'bg-teal-100 text-teal-700',
  };
};

const serializeHistory = (entry) => ({
  id: entry.id,
  fecha: formatDate(entry.entry_date),
  doctor: entry.doctor,
  especialidad: entry.specialty,
  modalidad: entry.modality,
  nota: entry.note,
  mia: !!entry.own_note,
  iniciales: initials(entry.doctor.replace(/^Dr\.?\s+|^Dra\.?\s+/i, '')),
  color: entry.own_note ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600',
});

const serializeSituation = (situation) => ({
  id: situation.id,
  tipo: situation.type,
  fechaInicio: formatDate(situation.start_date),
  fechaFin: situation.end_date ? formatDate(situation.end_date) : '',
  activa: !!situation.active,
});

const getCurrentPrestadorId = async (req) => {
  if (req.user?.id) {
    const prestador = await prestadoresRepository.getPrestadorByUserId(req.user.id);
    if (prestador) return prestador.id;
  }

  const prestador = await prestadoresRepository.getDefaultPrestador();
  return prestador?.id;
};

const login = async (req, res) => {
  try {
    const { cuit: rawCuit, password } = req.body;

    if (!rawCuit || !password) {
      return res.status(400).json({ message: 'Faltan datos requeridos' });
    }

    // Strip dashes so both '20-30405060-7' and '20304050607' work
    const cuit = rawCuit.replace(/-/g, '');

    const prestador = await prestadoresRepository.getPrestadorByCuit(cuit);

    if (!prestador || !prestador.status) {
      return res.status(401).json({ message: 'CUIT o contraseña incorrectos' });
    }

    const isPasswordValid = await bcrypt.compare(password, prestador.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'CUIT o contraseña incorrectos' });
    }

    const token = await generateToken({
      id: prestador.user_id,
      email: prestador.user_email,
      role_name: prestador.role_name,
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: 'OK',
      user: {
        id: prestador.id,
        id_usuario: prestador.user_id,
        nombre: prestador.first_name,
        apellido: prestador.last_name,
        dni: prestador.document_number || '',
        email: prestador.email,
        cuit: prestador.cuit,
        role: prestador.role_name,
        must_change_password: !!prestador.must_change_password,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesion de prestador:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getDashboardStats = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });

  const stats = await prestadoresRepository.getDashboardStats(prestadorId);
  return res.status(200).json({
    pendientes: stats.pendientes,
    observadas: stats.observadas,
    actividadReciente: stats.actividadReciente.map(serializeActivity),
  });
};

const getRequests = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });

  const requests = await prestadoresRepository.getRequests(prestadorId);
  return res.status(200).json(requests.map(serializeRequest));
};

const updateRequestStatus = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) return res.status(400).json({ message: 'El estado es requerido' });

  const request = await prestadoresRepository.updateRequestStatus(id, estado);
  if (!request) return res.status(404).json({ message: 'La solicitud no existe' });

  return res.status(200).json(serializeRequest(request));
};

const createRequest = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });

  const request = await prestadoresRepository.createRequest(prestadorId, {
    ...req.body,
    fecha: toISODate(req.body.fecha),
  });

  return res.status(201).json(serializeRequest(request));
};

const getAppointments = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  const date = req.query.date;

  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });
  if (!date) return res.status(400).json({ message: 'La fecha es requerida' });

  const appointments = await prestadoresRepository.getAppointmentsByDate(prestadorId, date);
  return res.status(200).json(appointments.map(serializeAppointment));
};

const getAppointmentsByMonth = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  const { year, month } = req.query;

  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });
  if (!year || !month) return res.status(400).json({ message: 'El año y mes son requeridos' });

  const rows = await prestadoresRepository.getAppointmentsByMonth(prestadorId, year, month);
  
  // Extraer solo los días
  const dias = rows.map(r => parseInt(r.appointment_date.split('-')[2], 10));
  
  return res.status(200).json(dias);
};

const createAppointment = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });

  const appointment = await prestadoresRepository.createAppointment(prestadorId, {
    ...req.body,
    date: toISODate(req.body.fecha),
  });

  return res.status(201).json(serializeAppointment(appointment));
};

const updateAppointmentNote = async (req, res) => {
  const { id } = req.params;
  const { nota } = req.body;

  const appointment = await prestadoresRepository.updateAppointmentNote(id, nota || '');
  if (!appointment) return res.status(404).json({ message: 'El turno no existe' });

  return res.status(200).json(serializeAppointment(appointment));
};

const searchAffiliates = async (req, res) => {
  const query = String(req.query.q || '').trim();
  if (!query) return res.status(200).json([]);

  const affiliates = await prestadoresRepository.searchAffiliates(query);
  return res.status(200).json(affiliates.map(serializeAffiliate));
};

const getClinicalHistory = async (req, res) => {
  const { id } = req.params;
  const history = await prestadoresRepository.getClinicalHistoryByAffiliate(id);
  return res.status(200).json(history.map(serializeHistory));
};

const getSituationTypes = async (req, res) => {
  const types = await prestadoresRepository.getSituationTypes();
  return res.status(200).json(types.map((item) => ({ idSituacion: item.id, nombre: item.name })));
};

const getSituations = async (req, res) => {
  const { affiliateId } = req.params;
  const situations = await prestadoresRepository.getSituationsByAffiliate(affiliateId);
  return res.status(200).json(situations.map(serializeSituation));
};

const createSituation = async (req, res) => {
  const { affiliateId } = req.params;
  const situation = await prestadoresRepository.createSituation(affiliateId, {
    ...req.body,
    fechaInicio: toISODate(req.body.fechaInicio),
    fechaFin: toISODate(req.body.fechaFin),
  });

  return res.status(201).json(serializeSituation(situation));
};

const updateSituation = async (req, res) => {
  const { affiliateId, situationId } = req.params;
  const situation = await prestadoresRepository.updateSituation(affiliateId, situationId, {
    ...req.body,
    fechaInicio: req.body.fechaInicio ? toISODate(req.body.fechaInicio) : undefined,
    fechaFin: req.body.fechaFin ? toISODate(req.body.fechaFin) : req.body.fechaFin,
  });

  if (!situation) return res.status(404).json({ message: 'La situacion no existe' });

  return res.status(200).json(serializeSituation(situation));
};

const deleteSituation = async (req, res) => {
  const { affiliateId, situationId } = req.params;
  const situation = await prestadoresRepository.deleteSituation(affiliateId, situationId);
  
  if (!situation) return res.status(404).json({ message: 'La situacion no existe' });
  
  return res.status(200).json({ message: 'OK' });
};

const getNotifications = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });

  const notifications = await prestadoresRepository.getNotifications(prestadorId);
  return res.status(200).json(notifications.map(n => ({
    id: n.id,
    title: n.title,
    text: n.text,
    time: formatDate(n.created_at || new Date()),
    unread: n.unread,
    iconClass: n.icon_class || 'bg-teal-50 text-teal-600',
  })));
};

const markNotificationAsRead = async (req, res) => {
  const prestadorId = await getCurrentPrestadorId(req);
  const { id } = req.params;
  if (!prestadorId) return res.status(404).json({ message: 'No hay prestador configurado' });

  const notif = await prestadoresRepository.markNotificationAsRead(id, prestadorId);
  if (!notif) return res.status(404).json({ message: 'Notificación no encontrada' });
  return res.status(200).json({ message: 'OK' });
};

module.exports = {
  login,
  getDashboardStats,
  getRequests,
  createRequest,
  updateRequestStatus,
  getAppointments,
  getAppointmentsByMonth,
  createAppointment,
  updateAppointmentNote,
  searchAffiliates,
  getClinicalHistory,
  getSituationTypes,
  getSituations,
  createSituation,
  updateSituation,
  deleteSituation,
  getNotifications,
  markNotificationAsRead,
};
