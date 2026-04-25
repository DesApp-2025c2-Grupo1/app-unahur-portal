const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.config');

// routes
const authRoute = require('./modules/auth/routes/auth.route');
const affiliatesRoute = require('./modules/affiliates/routes/affiliates.route');

const app = express();

app.use(cors({
    origin: ['http://localhost:5174', 'http://localhost:9002'],
    credentials: true
}));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('OK');
});

app.use('/auth', authRoute);
app.use('/affiliates', affiliatesRoute);
// app.use('/admin', adminRoutes);

module.exports = app;
