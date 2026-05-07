const express = require('express');
const router = express.Router();
const plansService = require('../services/plans.service');

router.get('/', plansService.getAll);
router.get('/:id', plansService.getById);

module.exports = router;
