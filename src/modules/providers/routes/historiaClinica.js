const express = require('express');
const router = express.Router();
const historiaService = require('../services/historiaClinica.service');

/**
 * @swagger
 * /providers/historia-clinica/afiliado/{id}:
 *   get:
 *     summary: Obtiene la historia clínica de un afiliado
 *     tags: [Providers/HistoriaClinica]
 */
router.get('/afiliado/:id', async (req, res) => {
  try {
    const cuitPrestador = req.user?.cuit;
    const historia = await historiaService.getHistoriaByAfiliado(req.params.id, cuitPrestador);
    res.json(historia);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
