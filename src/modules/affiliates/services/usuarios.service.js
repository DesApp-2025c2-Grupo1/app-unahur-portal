const pool = require('../../../config/db.config');

const USE_MOCK = process.env.USE_MOCK === 'true';

const mockUsuarios = [
  {
    id_usuario: 1,
    email: 'ana.garcia@unahur.edu.ar',
    dni: '12345678',
    nombre: 'Ana',
    apellido: 'García',
    activo: true,
    fecha_creacion: '2024-01-15T10:00:00.000Z',
    id_grupo_familiar: 1,
    roles: [{ id_rol: 1, nombre_rol: 'Afiliado' }]
  },
  {
    id_usuario: 2,
    email: 'carlos.lopez@unahur.edu.ar',
    dni: '23456789',
    nombre: 'Carlos',
    apellido: 'López',
    activo: true,
    fecha_creacion: '2024-02-20T09:30:00.000Z',
    id_grupo_familiar: 2,
    roles: [{ id_rol: 2, nombre_rol: 'Admin' }]
  },
  {
    id_usuario: 3,
    email: 'maria.perez@unahur.edu.ar',
    dni: '34567890',
    nombre: 'María',
    apellido: 'Pérez',
    activo: false,
    fecha_creacion: '2024-03-10T14:15:00.000Z',
    id_grupo_familiar: 1,
    roles: []
  },
  {
    id_usuario: 4,
    email: 'juan.martinez@unahur.edu.ar',
    dni: '45678901',
    nombre: 'Juan',
    apellido: 'Martínez',
    activo: true,
    fecha_creacion: '2024-04-05T08:00:00.000Z',
    id_grupo_familiar: 1,
    roles: [{ id_rol: 1, nombre_rol: 'Afiliado' }]
  }
];

const mockGrupoFamiliar = [
  {
    id_grupo_familiar: 1,
    usuarios: [
      { id_usuario: 1, nombre: 'Ana', apellido: 'García', dni: '12345678', relacion: 'Titular' },
      { id_usuario: 3, nombre: 'María', apellido: 'Pérez', dni: '34567890', relacion: 'Hija' },
      { id_usuario: 4, nombre: 'Juan', apellido: 'Martínez', dni: '45678901', relacion: 'Hijo' }
    ]
  },
  {
    id_grupo_familiar: 2,
    usuarios: [
      { id_usuario: 2, nombre: 'Carlos', apellido: 'López', dni: '23456789', relacion: 'Titular' }
    ]
  }
];

const mockRoles = [
  { id_rol: 1, nombre_rol: 'Afiliado' },
  { id_rol: 2, nombre_rol: 'Admin' }
];

const getUserById = async (id_usuario) => {
  if (USE_MOCK) {
    const user = mockUsuarios.find(u => u.id_usuario === parseInt(id_usuario, 10));
    return user || null;
  }

  const query = `
    SELECT
      u.id_usuario,
      u.email,
      u.activo,
      u.fecha_creacion,
      json_agg(json_build_object('id_rol', r.id_rol, 'nombre_rol', r.nombre_rol))
        FILTER (WHERE r.id_rol IS NOT NULL) as roles
    FROM usuarios u
    LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.id_usuario = $1
    GROUP BY u.id_usuario, u.email, u.activo, u.fecha_creacion
  `;

  try {
    const result = await pool.query(query, [id_usuario]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const getAllUsers = async (page = 1, limit = 10) => {
  if (page < 1 || limit < 1) {
    throw new Error('Page and limit must be positive integers');
  }

  if (USE_MOCK) {
    const offset = (page - 1) * limit;
    const paginated = mockUsuarios.slice(offset, offset + limit);
    return {
      usuarios: paginated,
      pagination: { page, limit, total: mockUsuarios.length }
    };
  }

  const offset = (page - 1) * limit;

  const query = `
    SELECT
      u.id_usuario,
      u.email,
      u.activo,
      u.fecha_creacion,
      json_agg(json_build_object('id_rol', r.id_rol, 'nombre_rol', r.nombre_rol))
        FILTER (WHERE r.id_rol IS NOT NULL) as roles
    FROM usuarios u
    LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    GROUP BY u.id_usuario, u.email, u.activo, u.fecha_creacion
    ORDER BY u.id_usuario ASC
    LIMIT $1 OFFSET $2
  `;

  const countQuery = 'SELECT COUNT(*) as total FROM usuarios';

  try {
    const [usersResult, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery)
    ]);

    return {
      usuarios: usersResult.rows,
      pagination: {
        page,
        limit,
        total: parseInt(countResult.rows[0].total, 10)
      }
    };
  } catch (error) {
    throw new Error(`Error fetching users: ${error.message}`);
  }
};

const addRoleToUser = async (id_usuario, id_rol) => {
  if (USE_MOCK) {
    const user = mockUsuarios.find(u => u.id_usuario === parseInt(id_usuario, 10));
    if (!user) throw new Error('USER_NOT_FOUND');

    const role = mockRoles.find(r => r.id_rol === parseInt(id_rol, 10));
    if (!role) throw new Error('ROLE_NOT_FOUND');

    const alreadyHas = user.roles.some(r => r.id_rol === parseInt(id_rol, 10));
    if (alreadyHas) throw new Error('ROLE_ALREADY_ASSIGNED');

    user.roles.push(role);
    return { id_usuario: parseInt(id_usuario, 10), id_rol: parseInt(id_rol, 10) };
  }

  const checkUserQuery = 'SELECT id_usuario FROM usuarios WHERE id_usuario = $1';
  const checkRoleQuery = 'SELECT id_rol FROM roles WHERE id_rol = $1';
  const insertQuery = `
    INSERT INTO usuario_roles (id_usuario, id_rol)
    VALUES ($1, $2)
    ON CONFLICT (id_usuario, id_rol) DO NOTHING
  `;

  try {
    const userResult = await pool.query(checkUserQuery, [id_usuario]);
    if (userResult.rows.length === 0) {
      throw new Error('USER_NOT_FOUND');
    }

    const roleResult = await pool.query(checkRoleQuery, [id_rol]);
    if (roleResult.rows.length === 0) {
      throw new Error('ROLE_NOT_FOUND');
    }

    const insertResult = await pool.query(insertQuery, [id_usuario, id_rol]);

    if (insertResult.rowCount === 0) {
      throw new Error('ROLE_ALREADY_ASSIGNED');
    }

    return { id_usuario, id_rol };
  } catch (error) {
    throw error;
  }
};

const toggleUserStatus = async (id_usuario) => {
  if (USE_MOCK) {
    const user = mockUsuarios.find(u => u.id_usuario === parseInt(id_usuario, 10));
    if (!user) throw new Error('USER_NOT_FOUND');

    user.activo = !user.activo;
    const { roles, ...userWithoutRoles } = user;
    return userWithoutRoles;
  }

  const checkUserQuery = 'SELECT id_usuario FROM usuarios WHERE id_usuario = $1';
  const updateQuery = `
    UPDATE usuarios
    SET activo = NOT activo
    WHERE id_usuario = $1
    RETURNING id_usuario, email, activo, fecha_creacion
  `;

  try {
    const userResult = await pool.query(checkUserQuery, [id_usuario]);
    if (userResult.rows.length === 0) {
      throw new Error('USER_NOT_FOUND');
    }

    const updateResult = await pool.query(updateQuery, [id_usuario]);
    return updateResult.rows[0];
  } catch (error) {
    throw error;
  }
};

const loginUser = async (dni, password) => {
  if (USE_MOCK) {
    const user = mockUsuarios.find(u => u.dni === dni);
    if (!user) throw new Error('INVALID_CREDENTIALS');
    const { roles, id_grupo_familiar, ...userWithoutRoles } = user;
    return userWithoutRoles;
  }

  const query = `
    SELECT id_usuario, email, dni, nombre, apellido, activo, fecha_creacion
    FROM usuarios
    WHERE dni = $1 AND activo = true
  `;

  try {
    const result = await pool.query(query, [dni]);
    if (result.rows.length === 0) {
      throw new Error('INVALID_CREDENTIALS');
    }
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const getUserMe = async (id_usuario) => {
  if (USE_MOCK) {
    const user = mockUsuarios.find(u => u.id_usuario === parseInt(id_usuario, 10));
    if (!user) throw new Error('USER_NOT_FOUND');
    return user;
  }

  const query = `
    SELECT
      u.id_usuario,
      u.email,
      u.dni,
      u.nombre,
      u.apellido,
      u.activo,
      u.fecha_creacion,
      json_agg(json_build_object('id_rol', r.id_rol, 'nombre_rol', r.nombre_rol))
        FILTER (WHERE r.id_rol IS NOT NULL) as roles
    FROM usuarios u
    LEFT JOIN usuario_roles ur ON u.id_usuario = ur.id_usuario
    LEFT JOIN roles r ON ur.id_rol = r.id_rol
    WHERE u.id_usuario = $1
    GROUP BY u.id_usuario, u.email, u.dni, u.nombre, u.apellido, u.activo, u.fecha_creacion
  `;

  try {
    const result = await pool.query(query, [id_usuario]);
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

const getFamiliaUsuario = async (id_usuario) => {
  if (USE_MOCK) {
    const user = mockUsuarios.find(u => u.id_usuario === parseInt(id_usuario, 10));
    if (!user) throw new Error('USER_NOT_FOUND');

    const grupo = mockGrupoFamiliar.find(g => g.id_grupo_familiar === user.id_grupo_familiar);
    if (!grupo) return [];

    return grupo.usuarios;
  }

  const query = `
    SELECT
      u.id_usuario,
      u.nombre,
      u.apellido,
      u.dni,
      gf.relacion
    FROM usuarios u
    JOIN grupo_familiar gf ON u.id_usuario = gf.id_usuario
    WHERE gf.id_grupo_familiar = (
      SELECT id_grupo_familiar FROM usuarios WHERE id_usuario = $1
    )
    ORDER BY gf.relacion DESC, u.nombre ASC
  `;

  try {
    const result = await pool.query(query, [id_usuario]);
    return result.rows;
  } catch (error) {
    throw new Error(`Error fetching familia: ${error.message}`);
  }
};

module.exports = {
  getUserById,
  getAllUsers,
  addRoleToUser,
  toggleUserStatus,
  loginUser,
  getUserMe,
  getFamiliaUsuario
};
