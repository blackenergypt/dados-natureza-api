const express = require('express');
const cors = require('cors');
const naturezaRoutes = require('./routes/naturezaRoutes');
const config = require('./config/config');
const CacheService = require('./services/cacheService');

// Configuração do formato de data para Portugal
const formatDate = () => {
  const date = new Date();
  return date.toLocaleString('pt-PT', {
    timeZone: 'Europe/Lisbon',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

const app = express();

// Middleware para obter IP do cliente
app.use((req, res, next) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  req.clientIp = clientIp;
  next();
});

// Middleware para logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${formatDate()} - ${req.clientIp} - ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.use(cors());
app.use(express.json());

// Rotas
app.use(naturezaRoutes);

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(`${formatDate()} - ${req.clientIp} - Erro:`, err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err.message
  });
});

// Inicialização do servidor
const startServer = async () => {
  let server;
  
  try {
    // Inicializar cache
    await CacheService.init();
    
    server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`
🚀 Servidor a correr em http://0.0.0.0:${config.port}
📊 Endpoints disponíveis:
   - GET /oc/v1/natureza
   - GET /oc/v1/natureza/:code
   - GET /oc/v1/categories
   - GET /oc/v1/search
   - GET /health
🌍 Ambiente: ${config.env}
`);
    });

    // Tratamento de sinais
    const signals = ['SIGTERM', 'SIGINT', 'SIGQUIT'];
    signals.forEach(signal => {
      process.on(signal, async () => {
        console.log(`${formatDate()} - Recebido sinal ${signal}, encerrando servidor...`);
        try {
          if (server) {
            await new Promise((resolve) => {
              server.close(() => {
                console.log(`${formatDate()} - Servidor HTTP encerrado`);
                resolve();
              });
            });
          }
          
          await CacheService.close();
          console.log(`${formatDate()} - Servidor encerrado com sucesso`);
          process.exit(0);
        } catch (error) {
          console.error(`${formatDate()} - Erro ao encerrar servidor:`, error);
          process.exit(1);
        }
      });
    });

    // Tratamento de erros não capturados
    process.on('uncaughtException', (error) => {
      console.error(`${formatDate()} - Erro não capturado:`, error);
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

    process.on('unhandledRejection', (error) => {
      console.error(`${formatDate()} - Rejeição não tratada:`, error);
      if (server) {
        server.close(() => {
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    });

  } catch (error) {
    console.error(`${formatDate()} - Erro ao iniciar servidor:`, error);
    if (server) {
      server.close(() => {
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  }
};

// Iniciar o servidor
startServer(); 