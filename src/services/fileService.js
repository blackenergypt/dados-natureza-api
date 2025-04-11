const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');
const path = require('path');
const config = require('../config/config');

class FileService {
  // Read Excel file (first document: incidents)
  static readExcel(filePath = config.files.excel) {
    try {
      const absolutePath = path.resolve(filePath);
      console.log(`Tentando ler ficheiro Excel: ${absolutePath}`);
      
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`Ficheiro não encontrado: ${absolutePath}`);
      }

      const workbook = xlsx.readFile(absolutePath);
      if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
        throw new Error('O ficheiro Excel não contém folhas');
      }

      const sheetName = workbook.SheetNames[0];
      console.log(`Lendo folha: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet);
      
      console.log('Dados brutos do Excel:', jsonData);
      
      if (!Array.isArray(jsonData)) {
        throw new Error('Os dados do Excel não estão no formato esperado');
      }

      // Processar os dados do Excel
      const processedData = jsonData
        .filter(row => row['__EMPTY_2']) // Filtrar apenas linhas que têm código
        .map(item => {
          // Extrair família e espécie dos campos vazios
          const family = item['CLASSIFICAÇÃO OCORRÊNCIAS'] || item['__EMPTY'] || '';
          const species = item['__EMPTY'] || '';
          const description = item['__EMPTY_1'] || '';
          const code = item['__EMPTY_2'] || '';

          return {
            categoryCode: family.toString().trim(),
            description: description.toString().trim(),
            code: code.toString().trim()
          };
        })
        .filter(item => item.code && item.categoryCode); // Filtrar entradas vazias

      console.log(`Dados processados do Excel: ${processedData.length} registos`);
      console.log('Primeiros 3 registos do Excel:', processedData.slice(0, 3));
      
      return processedData;
    } catch (err) {
      console.error(`Erro ao ler o ficheiro Excel: ${err.message}`);
      throw new Error(`Erro ao ler o ficheiro Excel: ${err.message}`);
    }
  }

  // Read CSV file (second document: classifications)
  static readCSV(filePath = config.files.csv) {
    return new Promise((resolve, reject) => {
      try {
        const absolutePath = path.resolve(filePath);
        console.log(`Tentando ler ficheiro CSV: ${absolutePath}`);

        if (!fs.existsSync(absolutePath)) {
          throw new Error(`Ficheiro não encontrado: ${absolutePath}`);
        }

        const results = [];
        let rowCount = 0;

        fs.createReadStream(absolutePath)
          .pipe(csv())
          .on('headers', (headers) => {
            console.log('Cabeçalhos do CSV:', headers);
          })
          .on('data', (row) => {
            rowCount++;
            console.log(`Lendo linha ${rowCount}:`, row);
            
            // Tentar diferentes formatos de cabeçalhos
            const family = row['Família'] || row['FAMÍLIA'] || row['family'] || '';
            const species = row['Espécie'] || row['ESPÉCIE'] || row['species'] || '';
            const description = row['Descrição'] || row['DESCRIÇÃO'] || row['description'] || '';
            const code = row['Código'] || row['CÓDIGO'] || row['code'] || '';

            if (code) {
              results.push({
                family: family.toString().trim(),
                species: species.toString().trim(),
                description: description.toString().trim(),
                code: code.toString().trim()
              });
            }
          })
          .on('end', () => {
            console.log(`Total de linhas processadas: ${rowCount}`);
            console.log(`Total de registos válidos: ${results.length}`);
            
            if (results.length === 0) {
              reject(new Error('O ficheiro CSV está vazio ou não contém dados válidos'));
              return;
            }
            
            console.log('Primeiros 3 registos:', results.slice(0, 3));
            resolve(results);
          })
          .on('error', (err) => {
            console.error(`Erro ao ler o ficheiro CSV: ${err.message}`);
            reject(new Error(`Erro ao ler o ficheiro CSV: ${err.message}`));
          });
      } catch (err) {
        console.error(`Erro ao processar o ficheiro CSV: ${err.message}`);
        reject(new Error(`Erro ao processar o ficheiro CSV: ${err.message}`));
      }
    });
  }

  // Merge incidents and classifications
  static async mergeData() {
    try {
      console.log('Iniciando combinação de dados...');
      const excelData = await this.readExcel();
      console.log(`Dados do Excel carregados: ${excelData.length} registos`);
      
      const csvData = await this.readCSV();
      console.log(`Dados do CSV carregados: ${csvData.length} registos`);
      
      const mergedData = excelData.map(item => {
        const matchingCsv = csvData.find(csvItem => csvItem.code === item.code);
        console.log(`Procurando correspondência para código ${item.code}:`, matchingCsv);
        
        return {
          ...item,
          family: matchingCsv ? matchingCsv.family : '',
          species: matchingCsv ? matchingCsv.species : ''
        };
      });

      console.log(`Dados combinados: ${mergedData.length} registos`);
      console.log('Primeiros 3 registos combinados:', mergedData.slice(0, 3));
      return mergedData;
    } catch (err) {
      console.error(`Erro ao combinar dados: ${err.message}`);
      throw new Error(`Erro ao combinar dados: ${err.message}`);
    }
  }
}

module.exports = FileService;