# Product Requirement Document (PRD)

**Nama Proyek:** AIaaS Catatan Keuangan (Web-Based)
**Versi:** 1.1
**Tanggal Revisi:** Juni 2026
**Status:** Draft — Siap untuk Review Tim

---

## 1. Ringkasan Eksekutif & Tujuan Proyek

Aplikasi pencatatan keuangan konvensional sering ditinggalkan pengguna karena input data yang manual dan repetitif — mengisi nominal, memilih kategori, mengetik deskripsi, dan tanggal secara terpisah. Proyek ini membangun platform web MVP yang mengotomatisasi proses tersebut menggunakan AI.

Pengguna cukup mengetik satu kalimat bebas tentang transaksi mereka, dan sistem akan mengolah serta menyimpannya secara otomatis.

**Batasan Scope MVP:** Tidak ada autentikasi pengguna. Aplikasi berjalan single-user di localhost. Fitur multi-user dan autentikasi dijadwalkan untuk v2.

---

## 2. Cakupan Fitur Utama

| ID | Nama Fitur | Deskripsi Fungsional | Prioritas |
|----|-----------|---------------------|-----------|
| FT-01 | Input Teks Alami (AI Parser) | Textarea tunggal untuk input kalimat transaksi bebas. Teks dikirim ke AI, hasilnya divalidasi sebelum disimpan. Teks asli turut disimpan untuk keperluan audit/debugging. | High |
| FT-02 | Riwayat Transaksi | Tabel transaksi terproses, diurutkan tanggal terbaru. Menampilkan: tanggal, kategori, deskripsi, nominal, jenis. | High |
| FT-03 | Kategori Standar Terdefinisi | AI diarahkan menggunakan daftar kategori tetap yang sudah ditentukan. Tidak ada input kategori bebas dari pengguna. | Medium |
| FT-04 | Dashboard Ringkasan Finansial | Menampilkan total pemasukan, total pengeluaran, dan saldo bersih untuk periode bulan berjalan. | Medium |

---

## 3. Arsitektur Teknis

- **Frontend:** Vite, React, TypeScript (TSX), Tailwind CSS. Desain Neobrutalism (high contrast, bold, interaktif).
- **Backend:** PHP Native sebagai REST API. Menangani validasi input, prompt assembly (AI), interaksi database (PDO PostgreSQL), dan komunikasi cURL ke Gemini API.
- **Database:** PostgreSQL untuk penyimpanan relasional data transaksi.
- **AI Integration:** Google Gemini API via HTTP REST.
- **Keamanan:** API key disimpan di file `.env` di luar webroot, tidak di-commit ke repository.

---

## 4. Spesifikasi Database (PostgreSQL Schema)

```sql
CREATE TABLE transactions (
    id               SERIAL PRIMARY KEY,
    transaction_date DATE        NOT NULL DEFAULT CURRENT_DATE,
    category         VARCHAR(50) NOT NULL,
    description      TEXT        NOT NULL,
    amount           INT         NOT NULL CHECK (amount > 0),
    type             VARCHAR(15) NOT NULL CHECK (type IN ('pemasukan', 'pengeluaran')),
    raw_input        TEXT        NOT NULL,
    created_at       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP
);
```

**Catatan perubahan dari v1.0:**

- Tambah kolom `raw_input` — menyimpan teks asli dari user untuk keperluan audit dan debugging AI parsing.
- Tambah constraint `CHECK (amount > 0)` pada kolom `amount` untuk mencegah nominal nol atau negatif masuk ke database.

---

## 5. Spesifikasi Integrasi AI & Kontrak Payload

### System Prompt

```
Kamu adalah API parser keuangan. Ekstrak teks transaksi pengguna menjadi objek JSON murni.

Aturan wajib:
- Response hanya JSON, tanpa markdown, tanpa penjelasan tambahan.
- Key yang wajib ada: "kategori", "nominal", "deskripsi", "jenis", "tanggal".
- "jenis" hanya boleh bernilai "pemasukan" atau "pengeluaran".
- "nominal" harus bilangan bulat positif. Konversi singkatan: 50rb=50000, 1jt=1000000, 25k=25000.
- "tanggal" format ISO 8601 (YYYY-MM-DD). Jika tidak disebutkan, gunakan tanggal hari ini.
  Untuk referensi relatif ("kemarin", "3 hari lalu"), hitung dari tanggal saat ini
  yang akan disertakan dalam prompt.
- "kategori" harus salah satu dari: Makanan & Minuman, Transportasi, Hiburan,
  Tagihan & Utilitas, Belanja, Kesehatan, Pendapatan, Lainnya.
```

### Konstruksi User Prompt (PHP)

Tanggal hari ini disertakan secara dinamis agar AI bisa menangani referensi tanggal relatif:

```php
$today = date('Y-m-d');
$userPrompt = "Tanggal hari ini: {$today}.\nTeks transaksi: \"{$userInput}\"";
```

### Target Output JSON dari AI

```json
{
  "kategori": "Makanan & Minuman",
  "nominal": 25000,
  "deskripsi": "Beli kopi susu di kafe",
  "jenis": "pengeluaran",
  "tanggal": "2026-06-05"
}
```

---

## 6. Spesifikasi Error Handling

| Kondisi Error | Penanganan Backend | Pesan ke User |
|--------------|-------------------|---------------|
| Response AI bukan JSON valid | Log error, batalkan insert | *"Gagal memproses teks. Coba tulis ulang dengan lebih jelas."* |
| Field wajib tidak lengkap di JSON | Validasi PHP sebelum insert, tolak | *"Data tidak lengkap dari AI. Coba lagi."* |
| `nominal` ≤ 0 atau bukan angka | Tolak insert | *"Nominal tidak valid. Pastikan jumlah uang disebutkan dengan jelas."* |
| `jenis` di luar nilai yang diizinkan | Tolak insert | *"Jenis transaksi tidak dikenali."* |
| Timeout / error koneksi ke AI API | Log error | *"Layanan AI tidak tersedia saat ini. Coba lagi dalam beberapa saat."* |

---

## 7. Kebutuhan Antarmuka & UX

### Prinsip Desain

Neobrutalism (High contrast, bold pastel/vibrant colors, hard black drop shadows, thick borders, dan tipografi yang berani). Desain harus terlihat menonjol, unik, premium, dan terasa hidup.

### Layout Halaman Utama

**Bagian Atas — Ringkasan Finansial:**
Tiga kartu berdampingan menampilkan total pemasukan, total pengeluaran, dan saldo bersih untuk bulan berjalan.

**Bagian Tengah — Input Transaksi:**
- Textarea besar dengan placeholder: *"Ketik transaksimu di sini, contoh: gajian masuk 5 juta rupiah..."*
- Tombol Simpan
- Loading state saat AI sedang memproses (spinner atau teks status)
- Pesan error ditampilkan inline di bawah textarea

**Bagian Bawah — Riwayat Transaksi:**
Tabel dengan kolom: Tanggal | Kategori | Deskripsi | Nominal | Jenis. Diurutkan berdasarkan `transaction_date` terbaru.

---

## 8. Kategori Standar

Daftar kategori yang dikenali AI (tetap, tidak dapat ditambah oleh user di MVP):

| Kategori | Contoh Transaksi |
|---------|-----------------|
| Makanan & Minuman | Beli makan siang, bayar kopi |
| Transportasi | Isi bensin, bayar Grab |
| Hiburan | Nonton bioskop, beli game |
| Tagihan & Utilitas | Bayar internet, listrik, air |
| Belanja | Beli baju, peralatan rumah |
| Kesehatan | Beli obat, bayar dokter |
| Pendapatan | Gajian, transfer dari klien |
| Lainnya | Transaksi yang tidak masuk kategori di atas |

---

## 9. Parameter Keberhasilan MVP

| Kriteria | Target | Metode Verifikasi |
|---------|--------|-------------------|
| Parsing nominal singkatan (rb, jt, k) | 100% dari 20 test case | Manual test dengan dataset terdefinisi |
| JSON valid dari AI response | ≥ 95% dari 50 test case beragam | Log response AI, hitung rasio valid/invalid |
| Penanganan referensi tanggal relatif (kemarin, minggu lalu) | ≥ 90% akurasi dari 10 test case | Bandingkan `tanggal` hasil parsing vs expected |
| Waktu respons end-to-end (input → data tersimpan) | < 5 detik | Ukur di localhost dengan koneksi normal |

---

## 10. Changelog

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | — | Dokumen awal |
| 1.1 | Juni 2026 | Tambah kolom `raw_input` di schema DB; tambah key `tanggal` di JSON contract; tambah konstruksi prompt dinamis di PHP; tambah seksi Error Handling; perjelas scope MVP (no-auth); tambah `CHECK (amount > 0)`; pisahkan FT-03 menjadi daftar kategori terdefinisi; perbaiki parameter keberhasilan dengan metode verifikasi konkret |