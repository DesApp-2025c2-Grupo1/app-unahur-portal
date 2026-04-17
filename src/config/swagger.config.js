const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API UNAHUR',
            version: '1.0.0',
            description: 'Documentación de la API de la UNAHUR',
        },
        servers: [{ url: 'http://localhost:9002' }],
    },
    apis: ['./src/modules/**/*.js', './src/routes/**/*.js'],
};

module.exports = swaggerJsdoc(options);