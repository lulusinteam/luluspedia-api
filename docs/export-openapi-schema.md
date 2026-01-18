# Mengekspor dan Menggunakan Skema OpenAPI

Dokumen ini menjelaskan cara mengekspor skema OpenAPI dari aplikasi NestJS dan bagaimana menggunakannya.

## Mengekspor Skema OpenAPI

Ada beberapa cara untuk mengekspor skema OpenAPI dari aplikasi:

### 1. Menggunakan Script Otomatis

#### Untuk Windows (PowerShell)

```powershell
.\export-schema.ps1
```

#### Untuk Linux/Mac (Bash)

```bash
chmod +x ./export-schema.sh  # Hanya perlu dilakukan sekali untuk memberi izin eksekusi
./export-schema.sh
```

### 2. Mengekspor Secara Manual

1. Pastikan server aplikasi berjalan di port 3000
2. Jalankan perintah berikut:

```bash
node export-schema.js
```

### 3. Mengunduh Langsung dari Browser

1. Buka browser dan akses `http://localhost:3000/docs-json`
2. Skema OpenAPI akan ditampilkan di browser
3. Simpan halaman sebagai file JSON

## Menggunakan Skema OpenAPI

Setelah diekspor, skema OpenAPI (`openapi-schema.json`) dapat digunakan untuk:

1. **Mengimpor ke Postman**:
   - Buka Postman
   - Klik "Import" > "File" > Pilih file `openapi-schema.json`
   - Postman akan membuat koleksi berdasarkan API yang didefinisikan

2. **Mengimpor ke Insomnia**:
   - Buka Insomnia
   - Klik "Create" > "Import From" > "File" > Pilih file `openapi-schema.json`

3. **Mengimpor ke Swagger UI**:
   - Jika Anda memiliki instance Swagger UI terpisah, Anda dapat memuat file skema

4. **Menghasilkan Kode Klien**:
   - Gunakan alat seperti [OpenAPI Generator](https://openapi-generator.tech/) untuk menghasilkan kode klien dalam berbagai bahasa

5. **Dokumentasi API**:
   - Gunakan alat seperti [ReDoc](https://github.com/Redocly/redoc) untuk menghasilkan dokumentasi statis

## Contoh Penggunaan dengan OpenAPI Generator

Untuk menghasilkan kode klien TypeScript:

```bash
npm install @openapitools/openapi-generator-cli -g
openapi-generator-cli generate -i openapi-schema.json -g typescript-axios -o ./generated-client
```

Untuk menghasilkan dokumentasi statis dengan ReDoc:

```bash
npm install redoc-cli -g
redoc-cli bundle openapi-schema.json -o api-docs.html
```