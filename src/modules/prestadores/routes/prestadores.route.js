const express = require('express');
const router = express.Router();

const prestadoresService = require('../services/prestadores.service');
const adminProvidersService = require('../services/admin.providers.service');
const authorize = require('../../auth/middleware/token.middleware');

router.post('/login', prestadoresService.login);
router.post('/prestadores/login', prestadoresService.login);

// Admin Providers CRUD
router.get('/', authorize('ADMIN'), adminProvidersService.getAll);
router.get('/:cuit', authorize('ADMIN', 'PRESTADOR'), adminProvidersService.getByCuit);
router.post('/', authorize('ADMIN'), adminProvidersService.create);
router.put('/:cuit', authorize('ADMIN'), adminProvidersService.update);
router.delete('/:cuit', authorize('ADMIN'), adminProvidersService.remove);

// Agendas util for providers
router.get('/:cuit/agendas-by-specialty', authorize('ADMIN', 'PRESTADOR'), adminProvidersService.getAgendasBySpecialty);
router.get('/:cuit/agendas-by-places', authorize('ADMIN', 'PRESTADOR'), adminProvidersService.getAgendasByPlaces);

router.get('/dashboard/stats', authorize('PRESTADOR'), prestadoresService.getDashboardStats);

router.get('/solicitudes', authorize('PRESTADOR'), prestadoresService.getRequests);
router.post('/solicitudes', authorize('PRESTADOR'), prestadoresService.createRequest);
router.put('/solicitudes/:id/estado', authorize('PRESTADOR'), prestadoresService.updateRequestStatus);

router.get('/turnos', authorize('PRESTADOR'), prestadoresService.getAppointments);
router.get('/turnos/mes', authorize('PRESTADOR'), prestadoresService.getAppointmentsByMonth);
router.post('/turnos', authorize('PRESTADOR'), prestadoresService.createAppointment);
router.put('/turnos/:id/nota', authorize('PRESTADOR'), prestadoresService.updateAppointmentNote);

router.get('/notificaciones', authorize('PRESTADOR'), prestadoresService.getNotifications);
router.put('/notificaciones/:id/leida', authorize('PRESTADOR'), prestadoresService.markNotificationAsRead);

router.get('/afiliados/search', authorize('PRESTADOR'), prestadoresService.searchAffiliates);

router.get('/historia-clinica/afiliado/:id', authorize('PRESTADOR'), prestadoresService.getClinicalHistory);

router.get('/situaciones/tipos', authorize('PRESTADOR', 'ADMIN'), prestadoresService.getSituationTypes);
router.get('/situaciones/afiliado/:affiliateId', authorize('PRESTADOR', 'ADMIN'), prestadoresService.getSituations);
router.post('/situaciones/afiliado/:affiliateId', authorize('PRESTADOR'), prestadoresService.createSituation);
router.put('/situaciones/afiliado/:affiliateId/:situationId', authorize('PRESTADOR'), prestadoresService.updateSituation);
router.delete('/situaciones/afiliado/:affiliateId/:situationId', authorize('PRESTADOR'), prestadoresService.deleteSituation);

module.exports = router;
