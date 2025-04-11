const path = require('path');

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: '/oc/v1',
  files: {
    excel: path.join(__dirname, '../../data/natureza.xlsx'),
    csv: path.join(__dirname, '../../data/categories.csv')
  }
}; 