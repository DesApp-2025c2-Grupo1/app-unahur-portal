const express = require('express');
const router = express.Router();
const specialtiesService = require('../services/specialties.service');

router.get('/', specialtiesService.getAll);
router.get('/:id', specialtiesService.getById);

module.exports = router;
