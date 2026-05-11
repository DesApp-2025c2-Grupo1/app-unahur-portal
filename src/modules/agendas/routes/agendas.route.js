const express = require('express');
const router = express.Router();
const agendasService = require('../services/agendas.service');
<<<<<<< HEAD
const authorize = require('../../auth/middleware/token.middleware');

router.get('/', authorize('ADMIN', 'PRESTADOR', 'AFILIADO'), agendasService.getAll);
router.get('/:id', authorize('ADMIN', 'PRESTADOR', 'AFILIADO'), agendasService.getById);
router.post('/', authorize('ADMIN', 'PRESTADOR'), agendasService.create);
router.put('/:id', authorize('ADMIN', 'PRESTADOR'), agendasService.update);
router.delete('/:id', authorize('ADMIN'), agendasService.remove);
=======

router.get('/', agendasService.getAll);
router.get('/:id', agendasService.getById);
router.post('/', agendasService.create);
router.put('/:id', agendasService.update);
router.delete('/:id', agendasService.remove);
>>>>>>> 6154655138dc766b6168d5025a9e90b0d3ab704e

module.exports = router;
