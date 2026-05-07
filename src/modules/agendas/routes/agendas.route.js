const express = require('express');
const router = express.Router();
const agendasService = require('../services/agendas.service');

router.get('/', agendasService.getAll);
router.get('/:id', agendasService.getById);
router.post('/', agendasService.create);
router.put('/:id', agendasService.update);
router.delete('/:id', agendasService.remove);

module.exports = router;
