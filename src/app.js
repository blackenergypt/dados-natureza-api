const express = require('express');
const naturezaRoutes = require('./routes/naturezaRoutes');
const config = require('./config/config');

const app = express();

// Middleware para parsing JSON
app.use(express.json());

// Rotas
app.use('/', naturezaRoutes);

// Iniciar o servidor
const startServer = () => {
  try {
    app.listen(config.port, () => {
      console.log(`🚀 Servidor a correr em http://localhost:${config.port}`);
      console.log(`📊 Endpoints disponíveis:`);
      console.log(`   - GET ${config.apiPrefix}/natureza`);
      console.log(`   - GET ${config.apiPrefix}/categories`);
      console.log(`   - GET /health`);
      console.log(`🌍 Ambiente: ${config.nodeEnv}`);
    });
  } catch (err) {
    console.error('Erro ao iniciar o servidor:', err);
    process.exit(1);
  }
};

startServer(); 