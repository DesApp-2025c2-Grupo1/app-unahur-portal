/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
    await knex.schema.createTable('usuarios', function (table) {
        table.increments('id_usuario').primary();
        table.string('email').notNullable().unique();
        table.string('password_hash').notNullable();
        table.string('dni').nullable().unique();
        table.string('cuit').nullable().unique();
        table.string('nombre').notNullable();
        table.string('apellido').nullable();
        table.boolean('activo').defaultTo(true);
        table.timestamp('fecha_creacion').defaultTo(knex.fn.now());
        table.timestamp('fecha_actualizacion').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('usuario_roles', function (table) {
        table.integer('id_usuario').unsigned().references('id_usuario').inTable('usuarios').onDelete('CASCADE');
        table.integer('id_rol').unsigned().references('id').inTable('roles').onDelete('CASCADE');
        table.primary(['id_usuario', 'id_rol']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('usuario_roles');
    await knex.schema.dropTableIfExists('usuarios');
};


