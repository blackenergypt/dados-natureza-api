const FileService = require('../services/fileService');

class NaturezaController {
  static async getNatureza(req, res) {
    try {
      const data = FileService.readExcel();
      res.json(data);
    } catch (err) {
      console.error(`Erro no endpoint /oc/v1/natureza: ${err.message}`);
      res.status(500).json({ error: 'Erro ao ler natureza.xlsx', details: err.message });
    }
  }

  static async getCategories(req, res) {
    try {
      const data = await FileService.readCSV();
      res.json(data);
    } catch (err) {
      console.error(`Erro no endpoint /oc/v1/categories: ${err.message}`);
      res.status(500).json({ error: 'Erro ao ler categories.csv', details: err.message });
    }
  }

  static getHealth(req, res) {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      port: process.env.PORT || 3000
    });
  }
}

module.exports = NaturezaController; 