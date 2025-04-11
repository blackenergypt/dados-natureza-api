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
  static redis = null;

  static async init() {
    if (this.redis) return;

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

    this.redis = new Redis(redisConfig);

    this.redis.on('error', (error) => {
      console.error(`${formatDate()} - Erro no Redis:`, error);
    });

    this.redis.on('connect', () => {
      console.log(`${formatDate()} - Conectado ao Redis com sucesso`);
    });

    return new Promise((resolve, reject) => {
      this.redis.on('ready', () => resolve());
      this.redis.on('error', (err) => reject(err));
    });
  }

  static async close() {
    if (this.redis) {
      await this.redis.quit();
      this.redis = null;
    }
  }

  static async get(key, clientIp = 'unknown') {
    try {
      const value = await this.redis.get(key);
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
      await this.redis.set(key, JSON.stringify(value), 'EX', ttl);
      console.log(`${formatDate()} - ${clientIp} - Dados armazenados no cache para a chave: ${key} (TTL: ${ttl}s)`);
    } catch (error) {
      console.error(`${formatDate()} - ${clientIp} - Erro ao armazenar no cache:`, error);
    }
  }

  static async delete(key, clientIp = 'unknown') {
    try {
      await this.redis.del(key);
      console.log(`${formatDate()} - ${clientIp} - Dados removidos do cache para a chave: ${key}`);
    } catch (error) {
      console.error(`${formatDate()} - ${clientIp} - Erro ao remover do cache:`, error);
    }
  }

  static async clear(clientIp = 'unknown') {
    try {
      await this.redis.flushall();
      console.log(`${formatDate()} - ${clientIp} - Cache limpo com sucesso`);
    } catch (error) {
      console.error(`${formatDate()} - ${clientIp} - Erro ao limpar cache:`, error);
    }
  }
}

module.exports = CacheService; 