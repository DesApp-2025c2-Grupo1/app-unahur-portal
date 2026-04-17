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

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cierra sesión
 *     responses:
 *       200:
 *         description: Sesión cerrada correctamente
 */
router.post('/logout', authService.logout);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresca el token de acceso
 *     responses:
 *       200:
 *         description: Token de acceso refrescado correctamente
 */
router.post('/refresh-token', authService.refreshToken);

module.exports = router;