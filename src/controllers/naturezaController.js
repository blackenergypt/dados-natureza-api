const FileService = require('../services/fileService');
const CacheService = require('../services/cacheService');

class NaturezaController {
  // Get all incidents with classifications
  async getNatureza(req, res) {
    try {
      const cacheKey = 'natureza_data';
      
      // Tentar obter dados do cache
      const cachedData = await CacheService.get(cacheKey);
      if (cachedData) {
        console.log('Dados obtidos do cache');
        return res.json(cachedData);
      }

      // Se não houver cache, buscar dados
      console.log('Buscando dados do ficheiro');
      const data = await FileService.mergeData();
      
      // Armazenar no cache por 1 hora
      await CacheService.set(cacheKey, data);
      
      res.json(data);
    } catch (err) {
      console.error('Erro ao obter dados:', err);
      res.status(500).json({ error: 'Erro ao processar os dados' });
    }
  }

  // Get incidents by category
  async getCategories(req, res) {
    try {
      const cacheKey = 'categories_data';
      
      // Tentar obter dados do cache
      const cachedData = await CacheService.get(cacheKey);
      if (cachedData) {
        console.log('Dados obtidos do cache');
        return res.json(cachedData);
      }

      // Se não houver cache, buscar dados
      console.log('Buscando dados do ficheiro');
      const data = await FileService.readCSV();
      
      // Armazenar no cache por 1 hora
      await CacheService.set(cacheKey, data);
      
      res.json(data);
    } catch (err) {
      console.error('Erro ao obter categorias:', err);
      res.status(500).json({ error: 'Erro ao processar as categorias' });
    }
  }

  // Get incident by code
  async getByCode(req, res) {
    try {
      const cacheKey = `natureza_code_${req.params.code}`;
      
      // Tentar obter dados do cache
      const cachedData = await CacheService.get(cacheKey);
      if (cachedData) {
        console.log('Dados obtidos do cache');
        return res.json(cachedData);
      }

      // Se não houver cache, buscar dados
      console.log('Buscando dados do ficheiro');
      const data = await FileService.mergeData();
      const code = req.params.code;
      const incident = data.find(item => item.code === code);
      
      if (!incident) {
        return res.status(404).json({ error: 'Incidente não encontrado' });
      }

      // Armazenar no cache por 1 hora
      await CacheService.set(cacheKey, incident);
      
      res.json(incident);
    } catch (err) {
      console.error('Erro ao obter incidente por código:', err);
      res.status(500).json({ error: 'Erro ao processar o incidente' });
    }
  }

  // Search incidents
  async search(req, res) {
    try {
      const cacheKey = `natureza_search_${JSON.stringify(req.query)}`;
      
      // Tentar obter dados do cache
      const cachedData = await CacheService.get(cacheKey);
      if (cachedData) {
        console.log('Dados obtidos do cache');
        return res.json(cachedData);
      }

      // Se não houver cache, buscar dados
      console.log('Buscando dados do ficheiro');
      const data = await FileService.mergeData();
      
      // Filtrar dados baseado nos parâmetros de busca
      const filteredData = data.filter(item => {
        for (const [key, value] of Object.entries(req.query)) {
          if (!item[key] || !item[key].toString().toLowerCase().includes(value.toLowerCase())) {
            return false;
          }
        }
        return true;
      });

      // Armazenar no cache por 1 hora
      await CacheService.set(cacheKey, filteredData);
      
      res.json(filteredData);
    } catch (err) {
      console.error('Erro ao buscar incidentes:', err);
      res.status(500).json({ error: 'Erro ao processar a busca' });
    }
  }

  // Health check
  async getHealth(req, res) {
    try {
      const cacheKey = 'health_data';
      const healthData = {
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: process.env.PORT || 3000
      };
      
      // Armazenar no cache por 5 minutos
      await CacheService.set(cacheKey, healthData, 300);
      
      res.json(healthData);
    } catch (err) {
      console.error('Erro ao verificar saúde:', err);
      res.status(500).json({ error: 'Erro ao verificar saúde do sistema' });
    }
  }
}

module.exports = new NaturezaController();