# Prettier Configuration

Proyek ini menggunakan Prettier untuk memastikan konsistensi format kode di seluruh codebase. Prettier akan secara otomatis memformat kode saat file disimpan.

## Konfigurasi

Konfigurasi Prettier didefinisikan dalam file `.prettierrc` di root proyek:

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "bracketSpacing": true,
  "arrowParens": "avoid",
  "endOfLine": "lf"
}
```

### Penjelasan Konfigurasi

- `singleQuote`: Menggunakan tanda kutip tunggal (`'`) daripada tanda kutip ganda (`"`).
- `trailingComma`: Menambahkan koma di akhir elemen terakhir dalam array dan objek.
- `printWidth`: Batas lebar baris maksimum sebelum wrapping.
- `tabWidth`: Jumlah spasi per level indentasi.
- `useTabs`: Menggunakan spasi daripada tab untuk indentasi.
- `semi`: Menambahkan titik koma di akhir pernyataan.
- `bracketSpacing`: Menambahkan spasi di dalam kurung kurawal objek.
- `arrowParens`: Menghilangkan tanda kurung di sekitar parameter tunggal pada arrow function.
- `endOfLine`: Menggunakan line feed (LF) untuk line endings.

## File yang Diabaikan

Beberapa file dan direktori dikecualikan dari pemformatan Prettier, seperti yang didefinisikan dalam file `.prettierignore`.

## Penggunaan

### Format Otomatis saat Menyimpan

VSCode akan secara otomatis memformat file saat disimpan berdasarkan konfigurasi di `.vscode/settings.json`.

### Format Manual

Untuk memformat kode secara manual, gunakan perintah berikut:

```bash
# Format semua file TypeScript di direktori src dan test
npm run format

# Periksa apakah semua file sudah diformat dengan benar
npm run format:check
```

## Integrasi dengan ESLint

Proyek ini menggunakan `eslint-plugin-prettier` dan `eslint-config-prettier` untuk mengintegrasikan Prettier dengan ESLint, memastikan tidak ada konflik antara aturan ESLint dan Prettier.