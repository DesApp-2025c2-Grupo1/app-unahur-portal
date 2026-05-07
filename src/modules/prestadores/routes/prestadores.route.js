const express = require('express');
const router = express.Router();

const prestadoresService = require('../services/prestadores.service');
const adminProvidersService = require('../services/admin.providers.service');

router.post('/login', prestadoresService.login);
router.post('/prestadores/login', prestadoresService.login);

// Admin Providers CRUD
router.get('/', adminProvidersService.getAll);
router.get('/:cuit', adminProvidersService.getByCuit);
router.post('/', adminProvidersService.create);
router.put('/:cuit', adminProvidersService.update);
router.delete('/:cuit', adminProvidersService.remove);

// Agendas util for providers
router.get('/:cuit/agendas-by-specialty', adminProvidersService.getAgendasBySpecialty);
router.get('/:cuit/agendas-by-places', adminProvidersService.getAgendasByPlaces);

router.get('/dashboard/stats', prestadoresService.getDashboardStats);

router.get('/solicitudes', prestadoresService.getRequests);
router.post('/solicitudes', prestadoresService.createRequest);
router.put('/solicitudes/:id/estado', prestadoresService.updateRequestStatus);

router.get('/turnos', prestadoresService.getAppointments);
router.get('/turnos/mes', prestadoresService.getAppointmentsByMonth);
router.post('/turnos', prestadoresService.createAppointment);
router.put('/turnos/:id/nota', prestadoresService.updateAppointmentNote);

router.get('/notificaciones', prestadoresService.getNotifications);
router.put('/notificaciones/:id/leida', prestadoresService.markNotificationAsRead);

router.get('/afiliados/search', prestadoresService.searchAffiliates);

router.get('/historia-clinica/afiliado/:id', prestadoresService.getClinicalHistory);

router.get('/situaciones/tipos', prestadoresService.getSituationTypes);
router.get('/situaciones/afiliado/:affiliateId', prestadoresService.getSituations);
router.post('/situaciones/afiliado/:affiliateId', prestadoresService.createSituation);
router.put('/situaciones/afiliado/:affiliateId/:situationId', prestadoresService.updateSituation);
router.delete('/situaciones/afiliado/:affiliateId/:situationId', prestadoresService.deleteSituation);

module.exports = router;
