#!/bin/bash

# Pastikan server berjalan sebelum mengekspor skema
echo "Memastikan server berjalan di port 3000..."

# Cek apakah server berjalan
if curl -s http://localhost:3000/docs -o /dev/null; then
  echo "Server terdeteksi berjalan di port 3000"
else
  echo "Server tidak terdeteksi. Pastikan server berjalan di port 3000 sebelum mengekspor skema."
  exit 1
fi

# Jalankan script ekspor
echo "Mengekspor skema OpenAPI..."
node export-schema.js

echo "Proses ekspor selesai!"