const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.config');

// routes
const authRoutes = require('./modules/auth/routes/auth');
const affiliatesRoutes = require('./modules/affiliates/routes/usuarios');
const providersRoutes = require('./modules/providers/routes/prestadores');

const app = express();

app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/auth', authRoutes);
app.use('/affiliates', affiliatesRoutes);
app.use('/providers', providersRoutes);
// app.use('/admin', adminRoutes);

module.exports = app;
