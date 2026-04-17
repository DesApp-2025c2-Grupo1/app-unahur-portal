const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.config');

// routes
const authRoutes = require('./modules/auth/routes/auth');

const app = express();

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/auth', authRoutes);
// app.use('/admin', adminRoutes);
// app.use('/affiliate', affiliateRoutes);
// app.use('/provider', providerRoutes);

module.exports = app;
