const express = require('express');
const router = express.Router();
const dashboardService = require('../services/dashboard.service');

/**
 * @swagger
 * /providers/dashboard/stats:
 *   get:
 *     summary: Obtiene estadísticas para el dashboard
 *     tags: [Providers/Dashboard]
 */
router.get('/stats', async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.user?.cuit);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
});

module.exports = router;
