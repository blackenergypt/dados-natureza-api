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
router.get(`${config.apiPrefix}/natureza`, (req, res) => NaturezaController.getNatureza(req, res));
router.get(`${config.apiPrefix}/natureza/:code`, (req, res) => NaturezaController.getBycode(req, res));
router.get(`${config.apiPrefix}/categories`, (req, res) => NaturezaController.getCategories(req, res));
router.get(`${config.apiPrefix}/search`, (req, res) => NaturezaController.search(req, res));
router.get('/health', (req, res) => NaturezaController.getHealth(req, res));

// Global error handler
router.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = router;