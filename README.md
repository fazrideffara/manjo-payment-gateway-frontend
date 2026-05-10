# Manjo Merchant Dashboard (Frontend) 🎨

![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)

Dashboard Merchant premium milik **PT Manjo Teknologi Indonesia**. Aplikasi ini berfungsi sebagai pusat monitoring transaksi sekaligus alat simulasi pembayaran QRIS secara interaktif.

## ✨ Fitur Utama

- **Real-time Dashboard**: Pantau total transaksi, MDR revenue, dan volume secara real-time.
- **Transaction Table**: Daftar transaksi lengkap dengan status (Success, Pending, Cancelled, Expired).
- **Payment Simulator**: Simulasi pembayaran langsung dari dashboard:
    - **BAYAR**: Simulasi pembayaran sukses.
    - **BATAL**: Simulasi pembatalan oleh pengguna.
    - **GAGAL**: Simulasi kegagalan sistem.
- **QR Generator**: Inisialisasi transaksi baru dengan modal elegan.
- **Responsive Design**: UI premium dengan Dark Mode support dan animasi smooth menggunakan Tailwind CSS.

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts
- **Icons**: Lucide React
- **API Client**: Axios
- **Crypto**: CryptoJS (untuk validasi HMAC Signature)

## 🚀 Instalasi & Persiapan

### 1. Prasyarat
- **Node.js** 18+ (disarankan v20+).
- **npm** atau **yarn**.

### 2. Konfigurasi API
Pastikan backend sudah berjalan di port `8080`. Konfigurasi API dapat ditemukan di `src/api/axios.js`.

### 3. Menjalankan Aplikasi
Clone repository ini dan jalankan perintah:
```bash
npm install
npm run dev
```
Aplikasi akan berjalan di: `http://localhost:5173`

## 🔗 Hubungan dengan Backend

Frontend ini membutuhkan **Manjo Payment Gateway Backend** untuk memproses data.
- **Repo Backend**: [manjo-payment-gateway](https://github.com/fazrideffara/manjo-payment-gateway)
- **API Base URL**: `http://localhost:8080/api`
- **Secret Key HMAC**: `MANJO-SECRET-KEY-2025-PAYMENT-GATEWAY` (Harus sama di kedua sisi).

## 🧩 Cara Kerja Simulasi

1. Klik tombol **"Generate QR"** di pojok kanan atas.
2. Masukkan nama merchant dan nominal, lalu klik **"Generate QR"**.
3. Di dalam modal QR, klik salah satu tombol simulasi (**BAYAR**, **BATAL**, atau **GAGAL**).
4. Status pada tabel akan terupdate secara otomatis melalui mekanisme webhook/callback ke backend.

---
© 2026 PT Manjo Teknologi Indonesia. All Rights Reserved.
