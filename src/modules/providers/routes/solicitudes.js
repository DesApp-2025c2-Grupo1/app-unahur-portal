const express = require('express');
const router = express.Router();
const solicitudesService = require('../services/solicitudes.service');

/**
 * @swagger
 * /providers/solicitudes:
 *   get:
 *     summary: Obtiene la lista de solicitudes asignables/visibles para el prestador logueado
 *     tags: [Providers/Solicitudes]
 *     responses:
 *       200:
 *         description: Lista de solicitudes
 */
router.get('/', async (req, res) => {
  try {
    const cuitPrestador = req.user?.cuit; // Asumiendo middleware de auth
    const solicitudes = await solicitudesService.getSolicitudes(cuitPrestador);
    res.json(solicitudes);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

/**
 * @swagger
 * /providers/solicitudes/{id}:
 *   get:
 *     summary: Obtiene el detalle de una solicitud específica
 *     tags: [Providers/Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Detalle de la solicitud
 */
router.get('/:id', async (req, res) => {
  try {
    const solicitud = await solicitudesService.getSolicitudById(req.params.id);
    if (!solicitud) {
      return res.status(404).json({ status: 404, message: 'Solicitud no encontrada' });
    }
    res.json(solicitud);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

/**
 * @swagger
 * /providers/solicitudes/{id}/estado:
 *   put:
 *     summary: Cambia el estado de una solicitud (Aprobar, Rechazar, Observar, En análisis)
 *     tags: [Providers/Solicitudes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *               motivo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.put('/:id/estado', async (req, res) => {
  try {
    const cuitPrestador = req.user?.cuit;
    const { estado, motivo } = req.body;
    
    if (!estado) {
      return res.status(400).json({ status: 400, message: 'El nuevo estado es requerido' });
    }

    const actualizada = await solicitudesService.updateEstadoSolicitud(req.params.id, estado, cuitPrestador, motivo);
    if (!actualizada) {
      return res.status(404).json({ status: 404, message: 'Solicitud no encontrada o no se pudo actualizar' });
    }
    
    res.json(actualizada);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
