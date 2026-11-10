# Folder Sertifikat (`public/certificates/`)

Simpan berkas sertifikat Anda (gambar `.png` / `.jpg` / `.webp` maupun dokumen `.pdf`) di dalam folder ini.

## Cara Menambahkan atau Mengubah Sertifikat:
1. Masukkan berkas gambar atau PDF sertifikat ke dalam folder `public/certificates/` (contoh: `public/certificates/sertifikat-fullstack.png` atau `public/certificates/sertifikat-fullstack.pdf`).
2. Buka berkas `src/data/portfolio.ts` dan cari bagian `certificates: [...]`.
3. Sesuaikan properti `imageUrl` (misal `"/certificates/sertifikat-fullstack.png"`), `pdfUrl` (misal `"/certificates/sertifikat-fullstack.pdf"`), atau `verifyUrl` (tautan kredensial online seperti Credly/Dicoding/Coursera).

