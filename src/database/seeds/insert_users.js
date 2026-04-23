/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {
      email: 'admin@mediunahur.com',
      password_hash: '$2a$12$TCWUqRe9RYYBiAiO5kk8.uryyCnIFVKymY7Jm41Lu8RC2tpWB0ij.',
      name: 'admin',
      role_id: 1,
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }
  ]);
};
