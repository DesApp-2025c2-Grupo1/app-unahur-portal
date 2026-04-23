const db = require('../../../database/db');
const bcrypt = require('bcryptjs');

const USE_MOCK = process.env.USE_MOCK === 'true';

const mockUsuarios = [
  {
    id_usuario: 1,
    email: 'ana.garcia@unahur.edu.ar',
    dni: '12345678',
    password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
    nombre: 'Ana',
    apellido: 'García',
    activo: true,
    fecha_creacion: '2024-01-15T10:00:00.000Z',
    id_grupo_familiar: 1,
    roles: 2
  },
  {
    id_usuario: 2,
    email: 'carlos.lopez@unahur.edu.ar',
    dni: '23456789',
    nombre: 'Carlos',
    password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
    apellido: 'López',
    activo: true,
    fecha_creacion: '2024-02-20T09:30:00.000Z',
    id_grupo_familiar: 2,
    roles: 2
  },
  {
    id_usuario: 3,
    email: 'maria.perez@unahur.edu.ar',
    dni: '34567890',
    nombre: 'María',
    password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
    apellido: 'Pérez',
    activo: false,
    fecha_creacion: '2024-03-10T14:15:00.000Z',
    id_grupo_familiar: 1,
    roles: 2
  },
  {
    id_usuario: 4,
    email: 'juan.martinez@unahur.edu.ar',
    dni: '45678901',
    nombre: 'Juan',
    apellido: 'Martínez',
    password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
    activo: true,
    fecha_creacion: '2024-04-05T08:00:00.000Z',
    id_grupo_familiar: 1,
    roles: 2
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

  try {
    const user = await db('usuarios as u')
      .select(
        'u.id_usuario',
        'u.email',
        'u.activo',
        'u.fecha_creacion',
        db.raw("json_agg(json_build_object('id_rol', r.id_rol, 'nombre_rol', r.nombre_rol)) FILTER (WHERE r.id_rol IS NOT NULL) as roles")
      )
      .leftJoin('usuario_roles as ur', 'u.id_usuario', 'ur.id_usuario')
      .leftJoin('roles as r', 'ur.id_rol', 'r.id_rol')
      .where('u.id_usuario', id_usuario)
      .groupBy('u.id_usuario', 'u.email', 'u.activo', 'u.fecha_creacion')
      .first();

    return user || null;
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

  try {
    const users = await db('usuarios as u')
      .select(
        'u.id_usuario',
        'u.email',
        'u.activo',
        'u.fecha_creacion',
        db.raw("json_agg(json_build_object('id_rol', r.id_rol, 'nombre_rol', r.nombre_rol)) FILTER (WHERE r.id_rol IS NOT NULL) as roles")
      )
      .leftJoin('usuario_roles as ur', 'u.id_usuario', 'ur.id_usuario')
      .leftJoin('roles as r', 'ur.id_rol', 'r.id_rol')
      .groupBy('u.id_usuario', 'u.email', 'u.activo', 'u.fecha_creacion')
      .orderBy('u.id_usuario', 'asc')
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db('usuarios').count('id_usuario as total');

    return {
      usuarios: users,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total: parseInt(total, 10)
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

  try {
    const user = await db('usuarios').where('id_usuario', id_usuario).first();
    if (!user) throw new Error('USER_NOT_FOUND');

    const role = await db('roles').where('id_rol', id_rol).first();
    if (!role) throw new Error('ROLE_NOT_FOUND');

    await db('usuario_roles')
      .insert({ id_usuario, id_rol })
      .onConflict(['id_usuario', id_rol])
      .ignore();

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

  try {
    const user = await db('usuarios').where('id_usuario', id_usuario).first();
    if (!user) throw new Error('USER_NOT_FOUND');

    const [updatedUser] = await db('usuarios')
      .where('id_usuario', id_usuario)
      .update({ activo: !user.activo })
      .returning(['id_usuario', 'email', 'activo', 'fecha_creacion']);

    return updatedUser;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (dni, password) => {
  if (USE_MOCK) {
    console.log("PRUEBAAAAA DNI", dni, password)
    const user = mockUsuarios.find(u => u.dni === dni && u.activo);
    if (!user) throw new Error('INVALID_CREDENTIALS');

    // Check if user has AFILIADO role in mock data
    const hasRole = user.roles.some(r => r.nombre_rol.toUpperCase() === 'AFILIADO');
    if (!hasRole) throw new Error('INVALID_CREDENTIALS');
    console.log("PRUEBAAAAA 4", user)

    const { roles, id_grupo_familiar, ...userWithoutRoles } = user;
    return userWithoutRoles;
  }

  try {
    //obtengo el usuario con su unico rol
    const user = await db('usuarios as u')
      .select('u.*')
      .join('roles as r', 'u.role_id', 'r.id')
      .where({
        'u.dni': dni,
        'u.is_active': true,
        'r.name': 'AFILIADO'
      })
      .first();

    if (!user) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw new Error('INVALID_CREDENTIALS');
    }

    const { password_hash, ...userPublic } = user;
    return userPublic;
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

  try {
    const user = await db('usuarios as u')
      .select(
        'u.id_usuario',
        'u.email',
        'u.dni',
        'u.nombre',
        'u.apellido',
        'u.activo',
        'u.fecha_creacion',
        db.raw("json_agg(json_build_object('id_rol', r.id_rol, 'nombre_rol', r.nombre_rol)) FILTER (WHERE r.id_rol IS NOT NULL) as roles")
      )
      .leftJoin('usuario_roles as ur', 'u.id_usuario', 'ur.id_usuario')
      .leftJoin('roles as r', 'ur.id_rol', 'r.id_rol')
      .where('u.id_usuario', id_usuario)
      .groupBy('u.id_usuario', 'u.email', 'u.dni', 'u.nombre', 'u.apellido', 'u.activo', 'u.fecha_creacion')
      .first();

    return user || null;
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

  try {
    const user = await db('usuarios').where('id_usuario', id_usuario).first();
    if (!user) throw new Error('USER_NOT_FOUND');

    const familia = await db('usuarios as u')
      .select('u.id_usuario', 'u.nombre', 'u.apellido', 'u.dni', 'gf.relacion')
      .join('grupo_familiar as gf', 'u.id_usuario', 'gf.id_usuario')
      .where('gf.id_grupo_familiar', function () {
        this.select('id_grupo_familiar').from('usuarios').where('id_usuario', id_usuario);
      })
      .orderBy([
        { column: 'gf.relacion', order: 'desc' },
        { column: 'u.nombre', order: 'asc' }
      ]);

    return familia;
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

