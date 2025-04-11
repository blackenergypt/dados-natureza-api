const express = require('express');
const router = express.Router();
const NaturezaController = require('../controllers/naturezaController');
const config = require('../config/config');

// Middleware para logging
router.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rotas da API
router.get(`${config.apiPrefix}/natureza`, NaturezaController.getNatureza);
router.get(`${config.apiPrefix}/categories`, NaturezaController.getCategories);

// Rota de saúde
router.get('/health', NaturezaController.getHealth);

// Tratamento de erros global
router.use((err, req, res, next) => {
  console.error('Erro não tratado:', err);
  res.status(500).json({ 
    error: 'Erro interno do servidor',
    message: err.message 
  });
});

module.exports = router; 