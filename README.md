# Arthur Saka — Retro 8-Bit Developer Portfolio

Website portofolio interaktif bergaya **retro 8-bit / pixel art** untuk **I Gede Arthur Saka Dewantara (Arthur Saka)**, mahasiswa Computer Science di BINUS University yang berfokus pada **Full-Stack Development & AI Systems**.

Dibangun dengan **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, dan disintesis dengan audio retro native menggunakan **Web Audio API**.

---

## 📖 Konteks Proyek Lengkap untuk Developer & AI

Untuk memahami seluruh arsitektur, keputusan teknis, daftar komponen, dan panduan modifikasi, silakan baca berkas:
👉 **[`PROJECT_CONTEXT.md`](./PROJECT_CONTEXT.md)**

---

## 🚀 Menjalankan Proyek Secara Lokal

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Jalankan Server Development:**
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) di browser Anda.

3. **Membuat Build Produksi:**
   ```bash
   npm run build
   npm run start
   ```

> **Catatan Windows / OneDrive:** Proyek ini dikonfigurasi menggunakan compiler **Webpack** (`--webpack`) di `package.json` untuk menjamin stabilitas build dan menghindari issue I/O cache bawaan Turbopack.

---

## 📁 Struktur Data

Seluruh konten teks, profil, tautan GitHub, keahlian, dan riwayat proyek terpusat di satu berkas:
```
src/data/portfolio.ts
```

---

## 📄 Berkas CV & Foto Profil

- **Foto Profil:** `public/profileporto.png`
- **File CV / Resume:** `public/CV_I_Gede_Arthur_Saka_Dewantara.pdf` (Cukup timpa file ini jika sudah memiliki file CV baru).
