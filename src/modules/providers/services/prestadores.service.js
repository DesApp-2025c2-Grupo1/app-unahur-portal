const pool = require('../../../config/db.config');

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
    // Normalizamos el CUIT para comparar sin guiones
    const cuitNormalizado = cuit.replace(/-/g, '');
    const prestador = mockPrestadores.find(
      (p) => p.cuit.replace(/-/g, '') === cuitNormalizado && p.activo
    );
    if (!prestador) throw new Error('INVALID_CREDENTIALS');

    // Devolvemos sin el campo roles para no exponer info innecesaria en el login
    const { roles, ...prestadorPublico } = prestador;
    return prestadorPublico;
  }

  // Normalizar CUIT: quitar guiones para buscar en DB
  const cuitNormalizado = cuit.replace(/-/g, '');

  const query = `
    SELECT
      u.id_usuario,
      u.email,
      u.cuit,
      u.nombre,
      u.activo,
      u.fecha_creacion,
      u.password_hash
    FROM usuarios u
    JOIN usuarios_roles ur ON u.id_usuario = ur.id_usuario
    JOIN roles r            ON ur.id_rol   = r.id_rol
    WHERE REPLACE(u.cuit, '-', '') = $1
      AND r.nombre = 'prestador'
      AND u.activo = true
  `;

  try {
    const result = await pool.query(query, [cuitNormalizado]);

    if (result.rows.length === 0) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const prestador = result.rows[0];

    // TODO: cuando se integre bcrypt reemplazar esta comparación
    // const passwordValida = await bcrypt.compare(password, prestador.password_hash);
    const passwordValida = password === prestador.password_hash;
    if (!passwordValida) {
      throw new Error('INVALID_CREDENTIALS');
    }

    // No devolver el hash al cliente
    const { password_hash, ...prestadorPublico } = prestador;
    return prestadorPublico;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  loginPrestador
};
