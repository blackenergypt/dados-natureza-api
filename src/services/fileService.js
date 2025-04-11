const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const config = require('../config/config');

class FileService {
  static readExcel(filePath = config.files.excel) {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Ficheiro não encontrado: ${filePath}`);
      }
      console.log(`A ler ficheiro Excel: ${filePath}`);
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      console.log(`Dados lidos com sucesso do Excel: ${jsonData.length} registos`);
      return jsonData;
    } catch (err) {
      console.error(`Erro ao ler o ficheiro Excel: ${err.message}`);
      throw err;
    }
  }

  static readCSV(filePath = config.files.csv) {
    return new Promise((resolve, reject) => {
      try {
        if (!fs.existsSync(filePath)) {
          throw new Error(`Ficheiro não encontrado: ${filePath}`);
        }
        console.log(`A ler ficheiro CSV: ${filePath}`);
        const results = [];
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            console.log(`Dados lidos com sucesso do CSV: ${results.length} registos`);
            resolve(results);
          })
          .on('error', (err) => {
            console.error(`Erro ao ler o ficheiro CSV: ${err.message}`);
            reject(err);
          });
      } catch (err) {
        console.error(`Erro ao processar o ficheiro CSV: ${err.message}`);
        reject(err);
      }
    });
  }
}

module.exports = FileService; 