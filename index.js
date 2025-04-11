const express = require('express');
const fs = require('fs');
const xlsx = require('xlsx');
const csv = require('csv-parser');

const app = express();
const PORT = 3000;

// Lê o Excel (.xlsx)
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const jsonData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
  return jsonData;
}

// Lê o CSV (.csv)
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

// Endpoint para o Excel
app.get('/api/natureza', (req, res) => {
  try {
    const data = readExcel('./natureza.xlsx');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler natureza.xlsx' });
  }
});

// Endpoint para o CSV
app.get('/api/categories', async (req, res) => {
  try {
    const data = await readCSV('./categories.csv');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao ler categories.csv' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
