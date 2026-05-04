# Panduan Integrasi Update Tryout (Admin)

Backend telah memperbarui sistem update tryout untuk mencegah penghapusan soal secara tidak sengaja. Sistem sekarang mendukung **Partial Update** dan **Explicit Deletion**.

## Endpoint
`PATCH /api/v1/admin/tryouts/:id`

## Perubahan Utama

### 1. Partial Update (Soal tidak lagi terhapus otomatis)
Jika Anda mengirim array `questions`, backend hanya akan memproses soal yang ada di dalam array tersebut.
*   **Update**: Soal dengan `id` yang sudah ada akan di-update datanya.
*   **Create**: Soal tanpa `id` akan dianggap soal baru dan ditambahkan.
*   **Retain**: Soal yang sudah ada di database namun **tidak dikirim** dalam array `questions` akan tetap dipertahankan (tidak dihapus).

### 2. Penghapusan Eksplisit (`deleteQuestionIds`)
Untuk menghapus soal, Anda sekarang wajib mengirimkan array ID soal yang ingin dihapus pada field `deleteQuestionIds`.

---

## Contoh Payload

Misalkan tryout memiliki 50 soal. Anda ingin mengedit soal ke-1 dan menghapus soal ke-50.

```json
{
  "title": "Tryout CPNS 2024 Updated",
  "questions": [
    {
      "id": "uuid-soal-1",
      "content": "Pertanyaan 1 yang sudah diperbaiki",
      "options": [
        { "id": "uuid-opt-1", "content": "Pilihan A", "isCorrect": true },
        { "id": "uuid-opt-2", "content": "Pilihan B", "isCorrect": false }
      ]
    }
  ],
  "deleteQuestionIds": [
    "uuid-soal-50"
  ]
}
```

## Tips Implementasi FE:

1.  **Halaman Edit (Pagination)**: Saat user mengedit soal di halaman tertentu (misal page 1), kirim saja list soal yang ada di page tersebut ke dalam array `questions`.
2.  **State Penghapusan**: Simpan ID soal yang dihapus oleh user di state (misal `deletedSoalIds`). Saat tombol "Simpan" diklik, kirim array tersebut ke `deleteQuestionIds`.
3.  **Minimal Payload**: Jika hanya ingin mengubah judul tryout tanpa menyentuh soal, cukup kirim `title` saja (array `questions` tidak perlu dikirim).

---
