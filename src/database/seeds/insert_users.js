/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('usuario_roles').del()
  await knex('usuarios').del()
  
  await knex('usuarios').insert([
    {
      id_usuario: 1,
      email: 'admin@mediunahur.com',
      password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
      nombre: 'Admin',
      apellido: 'Principal',
      activo: true,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    },
    {
      id_usuario: 2,
      email: 'afil@unahur.edu.ar',
      password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
      dni: '12345678',
      nombre: 'Ana',
      apellido: 'García',
      activo: true,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    },
    {
      id_usuario: 3,
      email: 'clinica@mediunahur.com',
      password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
      cuit: '30123456789',
      nombre: 'Clínica del Norte',
      apellido: null,
      activo: true,
      fecha_creacion: new Date(),
      fecha_actualizacion: new Date()
    }
  ]);

  await knex('usuario_roles').insert([
    { id_usuario: 1, id_rol: 1 }, // Admin
    { id_usuario: 2, id_rol: 2 }, // Afiliado
    { id_usuario: 3, id_rol: 3 }  // Proveedor
  ]);
};


