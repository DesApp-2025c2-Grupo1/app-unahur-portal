/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('roles').del()
  await knex('roles').insert([
    { id: 1, name: 'ADMIN', description: 'Administrador del sistema', is_active: true, created_at: new Date(), updated_at: new Date() },
    { id: 2, name: 'AFILIADO', description: 'Afiliado del sistema', is_active: true, created_at: new Date(), updated_at: new Date() },
    { id: 3, name: 'PROVEEDOR', description: 'Proveedor del sistema', is_active: true, created_at: new Date(), updated_at: new Date() }
  ]);
};
