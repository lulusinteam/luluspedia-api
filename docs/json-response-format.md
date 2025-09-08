# JSON Response Format

## Overview

API ini menggunakan format respons JSON yang konsisten dengan standar JSend yang telah dimodifikasi untuk menyertakan objek `meta`. Format ini memastikan bahwa semua respons API memiliki struktur yang seragam dan mudah diprediksi.

## Format Respons

Semua respons API mengikuti format berikut:

```json
{
  "status": "success|fail|error",
  "data": { ... },  // untuk status "success" dan "fail"
  "message": "...", // untuk status "error"
  "code": 500,      // untuk status "error"
  "meta": {
    "endpoint": "/api/resource",
    "time": "2023-10-15T12:34:56.789Z",
    "response_time": "123ms",
    "pagination": { // opsional, hanya untuk respons dengan pagination
      "page": 1,
      "limit": 10,
      "has_next_page": true
    }
  }
}
```

### Status

Nilai `status` menunjukkan hasil dari permintaan API:

- **success**: Permintaan berhasil diproses
- **fail**: Permintaan gagal karena kesalahan klien (4xx)
- **error**: Permintaan gagal karena kesalahan server (5xx)

### Data

Untuk respons dengan status `success`, objek `data` berisi data yang diminta. Untuk respons dengan status `fail`, objek `data` berisi informasi tentang kesalahan validasi atau alasan kegagalan lainnya.

### Message dan Code

Untuk respons dengan status `error`, bidang `message` berisi pesan kesalahan dan `code` berisi kode status HTTP.

### Meta

Objek `meta` berisi metadata tentang respons API:

- **endpoint**: Endpoint API yang diakses
- **time**: Timestamp saat respons dibuat
- **response_time**: Waktu yang dibutuhkan untuk memproses permintaan
- **pagination**: (opsional) Informasi pagination untuk respons yang berisi daftar data

## Contoh Respons

### Sukses (Tanpa Pagination)

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "meta": {
    "endpoint": "/api/users/1",
    "time": "2023-10-15T12:34:56.789Z",
    "response_time": "45ms"
  }
}
```

### Sukses (Dengan Pagination)

```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "John Doe" },
    { "id": 2, "name": "Jane Smith" }
  ],
  "meta": {
    "endpoint": "/api/users",
    "time": "2023-10-15T12:34:56.789Z",
    "response_time": "78ms",
    "pagination": {
      "page": 1,
      "limit": 10,
      "has_next_page": true
    }
  }
}
```

### Gagal (Validasi)

```json
{
  "status": "fail",
  "data": {
    "message": "Validation failed",
    "errors": {
      "email": "Email is required",
      "password": "Password must be at least 8 characters"
    }
  },
  "meta": {
    "endpoint": "/api/users",
    "time": "2023-10-15T12:34:56.789Z",
    "response_time": "32ms"
  }
}
```

### Error

```json
{
  "status": "error",
  "message": "Internal server error",
  "code": 500,
  "meta": {
    "endpoint": "/api/users",
    "time": "2023-10-15T12:34:56.789Z",
    "response_time": "145ms",
    "path": "/api/users"
  }
}
```

## Implementasi

Format respons ini diimplementasikan menggunakan:

1. **JSendInterceptor**: Interceptor global yang memformat semua respons sukses
2. **JSendExceptionFilter**: Filter exception global yang memformat semua respons error
3. **ApiJSendResponse**: Decorator Swagger untuk mendokumentasikan format respons

Semua controller dan endpoint API secara otomatis menggunakan format ini tanpa perlu konfigurasi tambahan.