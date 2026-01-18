const fs = require('fs');
const axios = require('axios');
const path = require('path');

async function exportOpenAPISchema() {
  try {
    // Mengambil skema OpenAPI dari endpoint Swagger
    const response = await axios.get('http://localhost:3000/docs-json');
    const openAPISchema = response.data;
    
    // Menyimpan skema sebagai file JSON
    const outputPath = path.join(__dirname, 'openapi-schema.json');
    fs.writeFileSync(outputPath, JSON.stringify(openAPISchema, null, 2));
    
    console.log(`Schema berhasil diekspor ke ${outputPath}`);
  } catch (error) {
    console.error('Error mengekspor schema:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

exportOpenAPISchema();