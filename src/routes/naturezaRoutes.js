const express = require('express');
const router = express.Router();
const NaturezaController = require('../controllers/naturezaController');
const config = require('../config/config');

// Middleware for logging
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// API routes
router.get(`${config.apiPrefix}/natureza`, NaturezaController.getNatureza);
router.get(`${config.apiPrefix}/natureza/:code`, NaturezaController.getByCode);
router.get(`${config.apiPrefix}/categories`, NaturezaController.getCategories);
router.get(`${config.apiPrefix}/search`, NaturezaController.search);
router.get('/health', NaturezaController.getHealth);

// Global error handler
router.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = router;