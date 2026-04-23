const express = require('express');
const router = express.Router();
const turnosService = require('../services/turnos.service');

/**
 * @swagger
 * /providers/turnos:
 *   get:
 *     summary: Obtiene los turnos para una fecha
 */
router.get('/', async (req, res) => {
  try {
    const { date } = req.query; // format YYYY-MM-DD
    const cuitPrestador = req.user?.cuit;
    const turnos = await turnosService.getTurnosByDate(cuitPrestador, date);
    res.json(turnos);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

/**
 * @swagger
 * /providers/turnos:
 *   post:
 *     summary: Crea un nuevo turno manual
 */
router.post('/', async (req, res) => {
  try {
    const nuevo = await turnosService.createTurno(req.body);
    res.json(nuevo);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

/**
 * @swagger
 * /providers/turnos/{id}/nota:
 *   put:
 *     summary: Agrega una nota médica al turno finalizado
 */
router.put('/:id/nota', async (req, res) => {
  try {
    const result = await turnosService.addNotaToTurno(req.params.id, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
