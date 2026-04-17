const express = require('express');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger');

// routes
const authRoutes = require('./modules/auth/routes/auth');
// const adminRoutes = require('./modules/admin/routes/admin');
// const affiliateRoutes = require('./modules/affiliate/routes/affiliate');
// const providerRoutes = require('./modules/provider/routes/provider');

dotenv.config();

const PORT = process.env.PORT;

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

