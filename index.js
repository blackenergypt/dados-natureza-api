const express = require('express');
const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Lê o Excel (.xlsx)
function readExcel(filePath) {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Ficheiro não encontrado: ${filePath}`);
    }
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    return jsonData;
  } catch (err) {
    console.error(`Erro ao ler o ficheiro Excel: ${err.message}`);
    throw err;
  }
}

// Lê o CSV (.csv)
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    try {
      if (!fs.existsSync(filePath)) {
        throw new Error(`Ficheiro não encontrado: ${filePath}`);
      }
      const results = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => resolve(results))
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

// Endpoint para o Excel
app.get('/api/natureza', (req, res) => {
  try {
    const data = readExcel('./natureza.xlsx');
    res.json(data);
  } catch (err) {
    console.error(`Erro no endpoint /api/natureza: ${err.message}`);
    res.status(500).json({ error: 'Erro ao ler natureza.xlsx', details: err.message });
  }
});

// Endpoint para o CSV
app.get('/api/categories', async (req, res) => {
  try {
    const data = await readCSV('./categories.csv');
    res.json(data);
  } catch (err) {
    console.error(`Erro no endpoint /api/categories: ${err.message}`);
    res.status(500).json({ error: 'Erro ao ler categories.csv', details: err.message });
  }
});

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponíveis:`);
  console.log(`   - GET /api/natureza`);
  console.log(`   - GET /api/categories`);
  console.log(`   - GET /health`);
});
