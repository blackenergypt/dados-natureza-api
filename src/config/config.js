require('dotenv').config();
const path = require('path');

module.exports = {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  apiPrefix: '/oc/v1',
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    ttl: {
      natureza: 3600, // 1 hora
      categories: 3600, // 1 hora
      search: 3600, // 1 hora
      health: 300 // 5 minutos
    }
  },
  files: {
    excel: path.join(__dirname, '../../data/natureza.xlsx'),
    csv: path.join(__dirname, '../../data/categories.csv')
  }
}; 