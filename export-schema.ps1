# Script PowerShell untuk mengekspor skema OpenAPI

# Pastikan server berjalan sebelum mengekspor skema
Write-Host "Memastikan server berjalan di port 3000..."

# Cek apakah server berjalan
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/docs" -Method Head -ErrorAction Stop
    Write-Host "Server terdeteksi berjalan di port 3000"
} catch {
    Write-Host "Server tidak terdeteksi. Pastikan server berjalan di port 3000 sebelum mengekspor skema."
    exit 1
}

# Jalankan script ekspor
Write-Host "Mengekspor skema OpenAPI..."
node export-schema.js

Write-Host "Proses ekspor selesai!"