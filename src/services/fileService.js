const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const path = require('path');
const config = require('../config/config');
const CacheService = require('./cacheService');

class FileService {
  // Read Excel file (first document: incidents)
  static async readExcel() {
    try {
      console.log('Lendo arquivo Excel...');
      const filePath = path.join(__dirname, '../../data/natureza.xlsx');
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      
      // Convertendo para JSON com headers explícitos
      const data = xlsx.utils.sheet_to_json(worksheet, {
        header: ['code', 'description', 'family', 'species'],
        range: 1 // Pula a primeira linha (cabeçalho)
      });

      console.log(`Arquivo Excel lido com sucesso. ${data.length} registros encontrados.`);
      return data.map(item => ({
        ...item,
        code: String(item.code) // Garantindo que o código seja string
      }));
    } catch (error) {
      console.error('Erro ao ler arquivo Excel:', error);
      throw new Error('Erro ao processar arquivo Excel');
    }
  }

  // Read CSV file (second document: classifications)
  static async readCSV() {
    try {
      console.log('Lendo arquivo CSV...');
      const filePath = path.join(__dirname, '../../data/categories.csv');
      const results = [];

      return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv({
            headers: ['categoryCode', 'description', 'code'],
            skipLines: 1 // Pula a primeira linha (cabeçalho)
          }))
          .on('data', (data) => {
            results.push({
              ...data,
              code: String(data.code) // Garantindo que o código seja string
            });
          })
          .on('end', () => {
            console.log(`Arquivo CSV lido com sucesso. ${results.length} registros encontrados.`);
            resolve(results);
          })
          .on('error', (error) => {
            console.error('Erro ao ler arquivo CSV:', error);
            reject(new Error('Erro ao processar arquivo CSV'));
          });
      });
    } catch (error) {
      console.error('Erro ao ler arquivo CSV:', error);
      throw new Error('Erro ao processar arquivo CSV');
    }
  }

  // Merge incidents and classifications
  static async mergeData() {
    try {
      console.log('Iniciando merge dos dados...');
      const [excelData, csvData] = await Promise.all([
        this.readExcel(),
        this.readCSV()
      ]);

      console.log(`Dados do Excel: ${excelData.length} registros`);
      console.log(`Dados do CSV: ${csvData.length} registros`);

      const mergedData = excelData.map(excelItem => {
        const csvItem = csvData.find(csv => csv.code === excelItem.code);
        return {
          code: excelItem.code,
          description: excelItem.description || csvItem?.description || null,
          family: excelItem.family || csvItem?.family || null,
          species: excelItem.species || csvItem?.species || null
        };
      });

      console.log(`Merge concluído. Total de registros: ${mergedData.length}`);
      return mergedData;
    } catch (error) {
      console.error('Erro ao fazer merge dos dados:', error);
      throw new Error('Erro ao combinar dados dos arquivos');
    }
  }
}

module.exports = FileService;