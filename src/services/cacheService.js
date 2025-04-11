const Redis = require('ioredis');
const config = require('../config/config');

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

class CacheService {
  static init() {
    const redisConfig = {
      host: config.redis.host,
      port: config.redis.port,
      username: config.redis.username,
      password: config.redis.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    };

    // Log da configuração (sem senha)
    console.log(`${formatDate()} - Configuração Redis:`, {
      ...redisConfig,
      password: '******'
    });

    this.client = new Redis(redisConfig);

    this.client.on('error', (error) => {
      console.error(`${formatDate()} - Erro no Redis:`, error);
    });

    this.client.on('connect', () => {
      console.log(`${formatDate()} - Conectado ao Redis com sucesso`);
    });

    return new Promise((resolve, reject) => {
      this.client.on('ready', () => resolve());
      this.client.on('error', (err) => reject(err));
    });
  }

  static async get(key, clientIp = 'unknown') {
    try {
      const value = await this.client.get(key);
      if (value) {
        console.log(`${formatDate()} - ${clientIp} - Dados obtidos do cache para a chave: ${key}`);
        return JSON.parse(value);
      }
      return null;
    } catch (error) {
      console.error(`${formatDate()} - ${clientIp} - Erro ao obter do cache:`, error);
      return null;
    }
  }

  static async set(key, value, ttl = 3600, clientIp = 'unknown') {
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
      console.log(`${formatDate()} - ${clientIp} - Dados armazenados no cache para a chave: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error(`${formatDate()} - ${clientIp} - Erro ao armazenar no cache:`, error);
    }
  }

  static async delete(key, clientIp = 'unknown') {
    try {
      await this.client.del(key);
      console.log(`${formatDate()} - ${clientIp} - Dados removidos do cache para a chave: ${key}`);
    } catch (error) {
      console.error(`${formatDate()} - ${clientIp} - Erro ao remover do cache:`, error);
    }
  }

  static async clear(clientIp = 'unknown') {
    try {
      await this.client.flushall();
      console.log(`${formatDate()} - ${clientIp} - Cache limpo com sucesso`);
    } catch (error) {
      console.error(`${formatDate()} - ${clientIp} - Erro ao limpar cache:`, error);
    }
  }
}

module.exports = CacheService; 