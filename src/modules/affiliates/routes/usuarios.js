const express = require('express');
const router = express.Router();
const usuariosService = require('../services/usuarios.service');

/**
 * @swagger
 * /affiliates/usuarios/{id_usuario}:
 *   get:
 *     summary: Obtiene un usuario por ID con sus roles
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 activo:
 *                   type: boolean
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id_rol:
 *                         type: integer
 *                       nombre_rol:
 *                         type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios/:id_usuario', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!Number.isInteger(parseInt(id_usuario, 10))) {
      return res.status(400).json({ error: 'El ID debe ser un número entero' });
    }

    const user = await usuariosService.getUserById(parseInt(id_usuario, 10));

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error en GET /usuarios/:id_usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /affiliates/usuarios:
 *   get:
 *     summary: Obtiene todos los usuarios con paginación
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Cantidad de usuarios por página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 usuarios:
 *                   type: array
 *                   items:
 *                     type: object
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *       400:
 *         description: Parámetros de paginación inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios', async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = page ? parseInt(page, 10) : 1;
    limit = limit ? parseInt(limit, 10) : 10;

    if (!Number.isInteger(page) || !Number.isInteger(limit) || page < 1 || limit < 1) {
      return res.status(400).json({
        error: 'Los parámetros page y limit deben ser números enteros positivos'
      });
    }

    const result = await usuariosService.getAllUsers(page, limit);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error en GET /usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /affiliates/usuarios/{id_usuario}/roles:
 *   post:
 *     summary: Agrega un rol a un usuario
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id_rol:
 *                 type: integer
 *                 description: ID del rol a asignar
 *             required:
 *               - id_rol
 *     responses:
 *       201:
 *         description: Rol asignado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 id_usuario:
 *                   type: integer
 *                 id_rol:
 *                   type: integer
 *       400:
 *         description: Datos inválidos
 *       404:
 *         description: Usuario o rol no encontrado
 *       409:
 *         description: El usuario ya tiene este rol asignado
 *       500:
 *         description: Error interno del servidor
 */
router.post('/usuarios/:id_usuario/roles', async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { id_rol } = req.body;

    if (!Number.isInteger(parseInt(id_usuario, 10))) {
      return res.status(400).json({ error: 'El ID del usuario debe ser un número entero' });
    }

    if (!id_rol || !Number.isInteger(id_rol)) {
      return res.status(400).json({ error: 'El id_rol es requerido y debe ser un número entero' });
    }

    await usuariosService.addRoleToUser(parseInt(id_usuario, 10), id_rol);

    res.status(201).json({
      message: 'Rol asignado correctamente',
      id_usuario: parseInt(id_usuario, 10),
      id_rol
    });
  } catch (error) {
    console.error('Error en POST /usuarios/:id_usuario/roles:', error);

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    if (error.message === 'ROLE_NOT_FOUND') {
      return res.status(404).json({ error: 'Rol no encontrado' });
    }
    if (error.message === 'ROLE_ALREADY_ASSIGNED') {
      return res.status(409).json({ error: 'El usuario ya tiene este rol asignado' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /affiliates/usuarios/{id_usuario}/estado:
 *   put:
 *     summary: Activa o desactiva un usuario
 *     parameters:
 *       - in: path
 *         name: id_usuario
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Estado del usuario actualizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 activo:
 *                   type: boolean
 *                 fecha_creacion:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put('/usuarios/:id_usuario/estado', async (req, res) => {
  try {
    const { id_usuario } = req.params;

    if (!Number.isInteger(parseInt(id_usuario, 10))) {
      return res.status(400).json({ error: 'El ID debe ser un número entero' });
    }

    const updatedUser = await usuariosService.toggleUserStatus(parseInt(id_usuario, 10));
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error en PUT /usuarios/:id_usuario/estado:', error);

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /affiliates/usuarios/login:
 *   post:
 *     summary: Autentica un usuario por DNI y contraseña
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dni:
 *                 type: string
 *                 description: DNI del usuario
 *               password:
 *                 type: string
 *                 description: Contraseña del usuario
 *             required:
 *               - dni
 *               - password
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
 *                 dni:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 activo:
 *                   type: boolean
 *       400:
 *         description: DNI o contraseña inválidos
 *       500:
 *         description: Error interno del servidor
 */
router.post('/usuarios/login', async (req, res) => {
  try {
    const { dni, password } = req.body;

    if (!dni || !password) {
      return res.status(400).json({ error: 'DNI y contraseña son requeridos' });
    }

    const user = await usuariosService.loginUser(dni, password);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error en POST /usuarios/login:', error);

    if (error.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ error: 'DNI o contraseña inválidos' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /affiliates/usuarios/me:
 *   get:
 *     summary: Obtiene los datos del usuario autenticado
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario (temporal, requiere auth)
 *     responses:
 *       200:
 *         description: Usuario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id_usuario:
 *                   type: integer
 *                 email:
 *                   type: string
 *                 dni:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 activo:
 *                   type: boolean
 *                 roles:
 *                   type: array
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios/me', async (req, res) => {
  try {
    const { id } = req.query;

    if (!id || !Number.isInteger(parseInt(id, 10))) {
      return res.status(400).json({ error: 'El parámetro id es requerido y debe ser un número entero' });
    }

    const user = await usuariosService.getUserMe(parseInt(id, 10));

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error en GET /usuarios/me:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

/**
 * @swagger
 * /affiliates/usuarios/{id}/familia:
 *   get:
 *     summary: Obtiene el grupo familiar de un usuario
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Grupo familiar obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id_usuario:
 *                     type: integer
 *                   nombre:
 *                     type: string
 *                   apellido:
 *                     type: string
 *                   dni:
 *                     type: string
 *                   relacion:
 *                     type: string
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.get('/usuarios/:id/familia', async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(parseInt(id, 10))) {
      return res.status(400).json({ error: 'El ID debe ser un número entero' });
    }

    const familia = await usuariosService.getFamiliaUsuario(parseInt(id, 10));
    res.status(200).json(familia);
  } catch (error) {
    console.error('Error en GET /usuarios/:id/familia:', error);

    if (error.message === 'USER_NOT_FOUND') {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;
