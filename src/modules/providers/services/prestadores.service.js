const db = require('../../../database/db');
const bcrypt = require('bcryptjs');

const USE_MOCK = process.env.USE_MOCK === 'true';

const mockPrestadores = [
  {
    id_usuario: 101,
    email: 'clinica.norte@mediuanhur.com',
    cuit: '30-12345678-9',
    nombre: 'Clínica del Norte',
    activo: true,
    fecha_creacion: '2024-01-10T08:00:00.000Z',
    roles: [{ id_rol: 3, nombre_rol: 'prestador' }]
  },
  {
    id_usuario: 102,
    email: 'dr.gomez@mediunahur.com',
    cuit: '20-23456789-4',
    nombre: 'Dr. Héctor Gómez',
    activo: true,
    fecha_creacion: '2024-02-15T09:00:00.000Z',
    roles: [{ id_rol: 3, nombre_rol: 'prestador' }]
  },
  {
    id_usuario: 103,
    email: 'farmacia.central@mediunahur.com',
    cuit: '30-34567890-5',
    nombre: 'Farmacia Central',
    activo: false,
    fecha_creacion: '2024-03-20T11:00:00.000Z',
    roles: [{ id_rol: 3, nombre_rol: 'prestador' }]
  }
];

/**
 * Autentica un prestador por CUIT y contraseña.
 * En producción valida contra la tabla `usuarios` filtrando
 * solo usuarios con rol 'prestador'.
 *
 * @param {string} cuit     - CUIT del prestador (puede venir con o sin guiones)
 * @param {string} password - Contraseña en texto plano (se compara con password_hash)
 * @returns {Promise<Object>} Datos del prestador autenticado
 */
const loginPrestador = async (cuit, password) => {
  if (USE_MOCK) {
    const cuitNormalizado = cuit.replace(/-/g, '');
    const prestador = mockPrestadores.find(
      (p) => p.cuit.replace(/-/g, '') === cuitNormalizado && p.activo
    );
    if (!prestador) throw new Error('INVALID_CREDENTIALS');

    const { roles, ...prestadorPublico } = prestador;
    return prestadorPublico;
  }

  const cuitNormalizado = cuit.replace(/-/g, '');

  try {
    const prestador = await db('usuarios as u')
      .select('u.id_usuario', 'u.email', 'u.cuit', 'u.nombre', 'u.activo', 'u.fecha_creacion', 'u.password_hash')
      .join('usuario_roles as ur', 'u.id_usuario', 'ur.id_usuario')
      .join('roles as r', 'ur.id_rol', 'r.id_rol')
      .whereRaw("REPLACE(u.cuit, '-', '') = ?", [cuitNormalizado])
      .andWhere('r.name', 'PROVEEDOR') // In the seed it was 'PROVEEDOR'
      .andWhere('u.activo', true)
      .first();

    if (!prestador) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const passwordValida = await bcrypt.compare(password, prestador.password_hash);
    if (!passwordValida) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const { password_hash, ...prestadorPublico } = prestador;
    return prestadorPublico;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  loginPrestador
};

