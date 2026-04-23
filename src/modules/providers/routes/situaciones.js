const express = require('express');
const router = express.Router();
const situacionesService = require('../services/situaciones.service');

/**
 * @swagger
 * /providers/situaciones/tipos:
 *   get:
 *     summary: Obtiene los tipos de situaciones terapéuticas disponibles
 *     tags: [Providers/Situaciones]
 */
router.get('/tipos', async (req, res) => {
  try {
    const tipos = await situacionesService.getTiposSituacion();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

/**
 * @swagger
 * /providers/situaciones/afiliado/{id}:
 *   get:
 *     summary: Obtiene las situaciones terapéuticas de un afiliado
 *     tags: [Providers/Situaciones]
 */
router.get('/afiliado/:id', async (req, res) => {
  try {
    const situaciones = await situacionesService.getSituacionesByAfiliado(req.params.id);
    res.json(situaciones);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

/**
 * @swagger
 * /providers/situaciones/afiliado/{id}:
 *   post:
 *     summary: Crea una nueva situación terapéutica
 *     tags: [Providers/Situaciones]
 */
router.post('/afiliado/:id', async (req, res) => {
  try {
    const nueva = await situacionesService.createSituacion(req.params.id, req.body);
    res.json(nueva);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

/**
 * @swagger
 * /providers/situaciones/afiliado/{id}/{idSituacion}:
 *   put:
 *     summary: Actualiza una situación (ej. editar o dar de baja)
 *     tags: [Providers/Situaciones]
 */
router.put('/afiliado/:id/:idSituacion', async (req, res) => {
  try {
    const updated = await situacionesService.updateSituacion(req.params.id, req.params.idSituacion, req.body);
    if (!updated) {
      return res.status(404).json({ status: 404, message: 'Situación no encontrada' });
    }
    res.json(updated);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
