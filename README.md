# Manjo Merchant Dashboard (Frontend) 🎨

![React](https://img.shields.io/badge/React-19-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-6-646CFF.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38B2AC.svg)

Dashboard Merchant premium milik **PT Manjo Teknologi Indonesia**. Aplikasi ini berfungsi sebagai pusat monitoring transaksi sekaligus alat simulasi pembayaran QRIS secara interaktif yang terintegrasi dengan Payment Gateway.

## ✨ Fitur Utama

- **Real-time Stats**: Pantau total revenue, success rate, dan settlement volume secara real-time.
- **Transaction Monitoring**: Tabel transaksi interaktif dengan filter status dan pagination.
- **Payment Simulator (Modal QR)**: Simulasi siklus hidup transaksi QRIS:
    - **BAYAR**: Simulasi notifikasi sukses dari switching/bank.
    - **BATAL**: Simulasi pembatalan transaksi oleh user di aplikasi scanner.
    - **GAGAL**: Simulasi kesalahan sistem/timeout.
- **Dynamic QR Generator**: Inisialisasi transaksi baru langsung dari dashboard.
- **Profile Management**: Pengaturan nama merchant yang tersinkronisasi ke sistem.
- **Premium UI**: Desain modern menggunakan Tailwind CSS 4 dengan animasi halus dan responsivitas penuh.

## 🛠️ Tech Stack

- **Framework**: React 19 (Vite 6)
- **Styling**: Tailwind CSS 4
- **Charts**: Recharts (Dashboard Analytics)
- **Icons**: Lucide React
- **API Client**: Axios (dengan Interceptors untuk JWT)
- **Security**: Web Crypto API (HMAC-SHA256 signature generation)

## 🚀 Instalasi & Persiapan

### 1. Prasyarat
- **Node.js** 20+ installed.
- **npm** or **yarn**.

### 2. Konfigurasi
Pastikan backend sudah berjalan. Jika menggunakan port default:
- **Backend URL**: `http://localhost:8080`
- **Secret Key HMAC**: `MANJO-SECRET-KEY-2026-PAYMENT-GATEWAY` (Harus sinkron dengan backend).

### 3. Menjalankan Aplikasi
```bash
npm install
npm run dev
```
Aplikasi berjalan di: `http://localhost:5173`

## 🔗 Hubungan dengan Backend

Frontend ini berkomunikasi secara intensif dengan **Manjo Payment Gateway Backend**.
- **Repo Backend**: [manjo-payment-gateway](https://github.com/fazrideffara/manjo-payment-gateway)
- **Auth**: Menggunakan JWT untuk akses menu Profile dan Admin Statistics.
- **Signature**: Setiap pembuatan QR menyertakan header `X-Signature` yang divalidasi oleh backend.

## 🧩 Flow Simulasi Pembayaran

1. Klik **"Generate QR"** di dashboard.
2. Masukkan detail transaksi dan klik **Generate**.
3. Dashboard akan mengirim request ke `/v1/qr/generate` dengan Signature.
4. Modal QR akan muncul. Klik salah satu tombol simulasi (**BAYAR/BATAL/GAGAL**).
5. Frontend mengirim "Simulasi Webhook" ke backend.
6. Backend memproses status dan tabel di dashboard akan terupdate otomatis.

---
© 2026 PT Manjo Teknologi Indonesia. All Rights Reserved.
