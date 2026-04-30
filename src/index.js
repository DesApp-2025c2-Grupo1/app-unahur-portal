const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./config/swagger.config');

// routes
const authRoute = require('./modules/auth/routes/auth.route');
const affiliatesRoute = require('./modules/affiliates/routes/affiliates.route');

const app = express();

app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:9002'],
    credentials: true
}));
app.use(cookieParser());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.get('/health', (req, res) => {
    res.send('OK');
});

// Limitador de peticiones para la ruta de auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: { message: 'Demasiadas peticiones desde esta IP, inténtalo más tarde' }
});

app.use('/auth', authLimiter, authRoute);
app.use('/affiliates', affiliatesRoute);
// app.use('/admin', adminRoutes);

module.exports = app;
