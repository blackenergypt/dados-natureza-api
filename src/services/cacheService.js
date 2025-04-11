const Redis = require('ioredis');
const config = require('../config/config');

class CacheService {
  constructor() {
    const redisConfig = {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      }
    };

    this.client = new Redis(redisConfig);

    this.client.on('error', (err) => {
      console.error('Erro no Redis:', err);
    });

    this.client.on('connect', () => {
      console.log('Conectado ao Redis com sucesso');
    });
  }

  async get(key) {
    try {
      const data = await this.client.get(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error(`Erro ao obter cache para chave ${key}:`, err);
      return null;
    }
  }

  async set(key, value, ttl = 3600) { // TTL padrão de 1 hora
    try {
      await this.client.set(key, JSON.stringify(value), 'EX', ttl);
      return true;
    } catch (err) {
      console.error(`Erro ao definir cache para chave ${key}:`, err);
      return false;
    }
  }

  async delete(key) {
    try {
      await this.client.del(key);
      return true;
    } catch (err) {
      console.error(`Erro ao remover cache para chave ${key}:`, err);
      return false;
    }
  }

  async clear() {
    try {
      await this.client.flushall();
      return true;
    } catch (err) {
      console.error('Erro ao limpar cache:', err);
      return false;
    }
  }
}

module.exports = new CacheService(); 