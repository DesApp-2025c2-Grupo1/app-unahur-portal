const express = require('express');
const router = express.Router();
const prestadoresService = require('../services/prestadores.service');

const solicitudesRoutes = require('./solicitudes');
const afiliadosRoutes = require('./afiliados');
const situacionesRoutes = require('./situaciones');
const turnosRoutes = require('./turnos');
const historiaClinicaRoutes = require('./historiaClinica');
const dashboardRoutes = require('./dashboard');

/**
 * @swagger
 * /providers/prestadores/login:
 *   post:
 *     summary: Autentica un prestador por CUIT y contraseña
 *     tags:
 *       - Providers
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cuit
 *               - password
 *             properties:
 *               cuit:
 *                 type: string
 *                 description: CUIT del prestador (con o sin guiones)
 *                 example: "30-12345678-9"
 *               password:
 *                 type: string
 *                 description: Contraseña del prestador
 *                 example: "miContraseña123"
 *     responses:
 *       200:
 *         description: Autenticación exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 cuit:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 activo:
 *                   type: boolean
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *       400:
 *         description: CUIT o contraseña faltantes
 *       401:
 *         description: Credenciales inválidas
 *       500:
 *         description: Error interno del servidor
 */
router.post('/prestadores/login', async (req, res) => {
  try {
    const { cuit, password } = req.body;

    if (!cuit || !password) {
      return res.status(400).json({ error: 'CUIT y contraseña son requeridos' });
    }

    const prestador = await prestadoresService.loginPrestador(cuit, password);
    res.status(200).json(prestador);
  } catch (error) {
    console.error('Error en POST /providers/prestadores/login:', error);

    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'CUIT o contraseña inválidos' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.use('/solicitudes', solicitudesRoutes);
router.use('/afiliados', afiliadosRoutes);
router.use('/situaciones', situacionesRoutes);
router.use('/turnos', turnosRoutes);
router.use('/historia-clinica', historiaClinicaRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;
