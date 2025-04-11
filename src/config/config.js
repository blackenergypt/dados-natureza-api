module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: '/oc/v1',
  files: {
    excel: './data/natureza.xlsx',
    csv: './data/categories.csv'
  }
}; 