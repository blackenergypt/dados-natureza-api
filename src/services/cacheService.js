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
  static isInitialized = false;

  static async init() {
    if (this.isInitialized) return;

    const redisConfig = {
      host: config.redis.host,
      port: config.redis.port,
      username: config.redis.username,
      password: config.redis.password,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      connectTimeout: 10000,
      commandTimeout: 5000
    };

    console.log(`${formatDate()} - Configuração Redis:`, {
      ...redisConfig,
      password: '******'
    });

    try {
      this.redis = new Redis(redisConfig);

      this.redis.on('error', (error) => {
        console.error(`${formatDate()} - Erro Redis:`, error);
      });

      this.redis.on('connect', () => {
        console.log(`${formatDate()} - Conectado ao Redis com sucesso`);
      });

      this.redis.on('ready', () => {
        console.log(`${formatDate()} - Redis pronto para uso`);
        this.isInitialized = true;
      });

      this.redis.on('close', () => {
        console.log(`${formatDate()} - Conexão Redis fechada`);
        this.isInitialized = false;
      });

      // Aguardar conexão estar pronta
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Timeout ao conectar ao Redis'));
        }, 10000);

        this.redis.on('ready', () => {
          clearTimeout(timeout);
          resolve();
        });

        this.redis.on('error', (err) => {
          clearTimeout(timeout);
          reject(err);
        });
      });

    } catch (error) {
      console.error(`${formatDate()} - Erro ao inicializar Redis:`, error);
      throw error;
    }
  }

  static async close() {
    if (this.redis) {
      try {
        await this.redis.quit();
        this.redis = null;
        this.isInitialized = false;
        console.log(`${formatDate()} - Conexão Redis encerrada com sucesso`);
      } catch (error) {
        console.error(`${formatDate()} - Erro ao encerrar conexão Redis:`, error);
        throw error;
      }
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