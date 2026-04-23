const express = require('express');
const router = express.Router();

// service
const authService = require('../services/auth.service');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada correctamente
 */
router.post('/login', authService.login);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Usuario registrado correctamente
 */
router.post('/register', authService.register);

module.exports = router;