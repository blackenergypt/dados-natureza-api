const FileService = require('../services/fileService');
const CacheService = require('../services/cacheService');

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

class NaturezaController {
  // Get all incidents with classifications
  async getNatureza(req, res) {
    try {
      const cacheKey = 'natureza:all';
      const clientIp = req.clientIp || 'unknown';

      // Tentar obter do cache
      const cachedData = await CacheService.get(cacheKey, clientIp);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Se não estiver em cache, ler e processar os dados
      const data = await FileService.mergeData();
      
      // Armazenar no cache
      await CacheService.set(cacheKey, data, 3600, clientIp); // TTL de 1 hora
      
      res.json(data);
    } catch (error) {
      console.error(`${formatDate()} - ${req.clientIp || 'unknown'} - Erro ao obter dados:`, error);
      res.status(500).json({
        error: 'Erro ao processar requisição',
        message: error.message
      });
    }
  }

  // Get incidents by category
  async getCategories(req, res) {
    try {
      const cacheKey = 'categories:all';
      const clientIp = req.clientIp || 'unknown';

      // Tentar obter do cache
      const cachedData = await CacheService.get(cacheKey, clientIp);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Se não estiver em cache, ler o arquivo
      const data = await FileService.readCSV();
      
      // Armazenar no cache
      await CacheService.set(cacheKey, data, 3600, clientIp); // TTL de 1 hora
      
      res.json(data);
    } catch (error) {
      console.error(`${formatDate()} - ${req.clientIp || 'unknown'} - Erro ao obter categorias:`, error);
      res.status(500).json({
        error: 'Erro ao processar requisição',
        message: error.message
      });
    }
  }

  // Get incident by code
  async getBycode(req, res) {
    try {
      const { code } = req.params;
      const cacheKey = `natureza:${code}`;
      const clientIp = req.clientIp || 'unknown';

      // Tentar obter do cache
      const cachedData = await CacheService.get(cacheKey, clientIp);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Se não estiver em cache, buscar nos dados
      const allData = await FileService.mergeData();
      const item = allData.find(item => item.code === code);

      if (!item) {
        return res.status(404).json({
          error: 'Não encontrado',
          message: 'Código não encontrado'
        });
      }

      // Armazenar no cache
      await CacheService.set(cacheKey, item, 3600, clientIp); // TTL de 1 hora
      
      res.json(item);
    } catch (error) {
      console.error(`${formatDate()} - ${req.clientIp || 'unknown'} - Erro ao buscar código:`, error);
      res.status(500).json({
        error: 'Erro ao processar requisição',
        message: error.message
      });
    }
  }

  // Search incidents
  async search(req, res) {
    try {
      const { query } = req.query;
      const cacheKey = `search:${query}`;
      const clientIp = req.clientIp || 'unknown';

      if (!query) {
        return res.status(400).json({
          error: 'Parâmetro inválido',
          message: 'O parâmetro de busca é obrigatório'
        });
      }

      // Tentar obter do cache
      const cachedData = await CacheService.get(cacheKey, clientIp);
      if (cachedData) {
        return res.json(cachedData);
      }

      // Se não estiver em cache, realizar a busca
      const allData = await FileService.mergeData();
      const results = allData.filter(item => 
        item.code.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        (item.family && item.family.toLowerCase().includes(query.toLowerCase())) ||
        (item.species && item.species.toLowerCase().includes(query.toLowerCase()))
      );

      // Armazenar no cache
      await CacheService.set(cacheKey, results, 3600, clientIp); // TTL de 1 hora
      
      res.json(results);
    } catch (error) {
      console.error(`${formatDate()} - ${req.clientIp || 'unknown'} - Erro na busca:`, error);
      res.status(500).json({
        error: 'Erro ao processar requisição',
        message: error.message
      });
    }
  }

  // Health check
  async getHealth(req, res) {
    try {
      const cacheKey = 'health:status';
      const clientIp = req.clientIp || 'unknown';

      // Tentar obter do cache
      const cachedData = await CacheService.get(cacheKey, clientIp);
      if (cachedData) {
        return res.json(cachedData);
      }

      const status = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
      };

      // Armazenar no cache
      await CacheService.set(cacheKey, status, 300, clientIp); // TTL de 5 minutos
      
      res.json(status);
    } catch (error) {
      console.error(`${formatDate()} - ${req.clientIp || 'unknown'} - Erro no health check:`, error);
      res.status(500).json({
        error: 'Erro ao verificar saúde do serviço',
        message: error.message
      });
    }
  }
}

module.exports = new NaturezaController();