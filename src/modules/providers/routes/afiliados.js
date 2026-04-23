const express = require('express');
const router = express.Router();
const afiliadosService = require('../services/afiliados.service');

/**
 * @swagger
 * /providers/afiliados/search:
 *   get:
 *     summary: Busca afiliados por nombre, nro o telefono
 *     tags: [Providers/Afiliados]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de afiliados coincidentes
 */
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    const resultados = await afiliadosService.searchAfiliados(q);
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
