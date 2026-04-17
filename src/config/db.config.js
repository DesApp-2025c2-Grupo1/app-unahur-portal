const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    type: 'postgres',
});

pool.connect()
    .then(() => {
        console.log('Base de datos conectada con éxito');
    })
    .catch((err) => {
        console.error('Error inesperado en el cliente de la base de datos', err);
    });

module.exports = pool;