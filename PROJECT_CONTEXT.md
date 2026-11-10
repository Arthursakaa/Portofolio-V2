# PROJECT CONTEXT & KNOWLEDGE BASE
> **Portfolio Website — I Gede Arthur Saka Dewantara**  
> Modern Retro 8-Bit Developer Portfolio & Recruiter Showcase

Dokumen ini dibuat sebagai panduan latar belakang lengkap (*Project Blueprint & Context*) untuk developer dan AI coding assistant (seperti Kiro AI, Cursor, Claude Code, dll.) agar memahami arsitektur, estetika, data, serta keputusan teknis proyek ini secara mendalam.

---

## 1. Identitas Pemilik & Tujuan Proyek

- **Nama Lengkap:** I Gede Arthur Saka Dewantara
- **Panggilan / Callsign:** Arthur Saka (`ARTHUR // SAKA`)
- **Afiliasi Akademik:** Mahasiswa Ilmu Komputer / Computer Science (B.Comp.Sc.) di **BINUS University**
- **Domisili:** Malang, Jawa Timur, Indonesia
- **Target Utama:** Mencari kesempatan magang sebagai **Full-Stack Developer** (Target: 2026).
- **Email:** `arthursakaa16@gmail.com`
- **LinkedIn:** `https://www.linkedin.com/in/i-gede-arthur-saka-dewantara-143311326`
- **GitHub:** `https://github.com/Arthursakaa` (Repositori: `Web_FitnessVals`, `Edubot-GayaBelajar`, `Web_Debouquets`, `WebCV_PPT`)
- **Foto Profil:** `public/profileporto.png`
- **Berkas CV / Resume:** Terhubung langsung ke `public/CV_Arthur_Saka.pdf`

---

## 2. Tech Stack & Konfigurasi Lingkungan

- **Framework:** Next.js 16.4.5 (App Router, React 19, TypeScript)
- **Engine Bundler:** **Webpack** (`--webpack` di `package.json`).
  > **PENTING:** Next.js Turbopack pada Windows / OneDrive mengalami issue izin tulis cache I/O (`EPERM`). Selalu gunakan `next dev --webpack` dan `next build --webpack`.
- **Styling:** Tailwind CSS v4 dengan `@tailwindcss/postcss` & `postcss.config.mjs`.
- **Tipografi Retro (Self-Hosted WOFF2):**
  - `Press Start 2P`: Untuk judul, heading pixel, tombol, dan badge.
  - `VT323`: Untuk terminal text, prompt subheader, dan quote pendukung.
  - Sans-Serif Standar: Digunakan pada paragraf panjang agar tingkat keterbacaan (legibility) tetap tinggi bagi recruiter/HRD.
  - Lokasi berkas font: `src/fonts/` (dimuat via `next/font/local` di `src/app/layout.tsx` tanpa dependensi Google Fonts online).
- **Sistem Audio:** Native Browser `Web Audio API` (`src/lib/audio.ts`). 0 file MP3/WAV eksternal; semua suara 8-bit disintesis secara real-time via kode.

---

## 3. Desain & Estetika (Inspirasi & Aturan UI/UX)

- **Arah Visual:** Terinspirasi dari estetika retro playful [yoyu.design](https://yoyu.design/), namun disesuaikan menjadi portofolio profesional developer berstandar industri.
- **Palet Warna Utama:**
  - Latar Belakang Kertas Hangat: `#f4efe6`
  - Kartu / Kontainer: `#fffdf9`
  - Tinta Gelap / Garis Batas Pixel: `#2b2723`
  - Warna Aksen Utama: Oranye Retro `#ea580c`, Emerald Green `#10b981`, Deep Blue `#2563eb`, Sky Blue `#38bdf8`.
- **Elemen Interaktif Pixel:**
  - Border khas pixel 2px dengan bayangan bertingkat (`shadow-[2px_2px_0_0_#2b2723]`).
  - Active button state mengecil sedikit (`active:scale-95` atau `scale(0.97)`).
  - Foto profil memiliki filter dither retro 8-bit (`.retro-dither`) dengan tombol saklar untuk beralih ke foto asli.

---

## 4. Struktur Folder & Modul Kunci

```
Portofolio/
├── public/
│   ├── certificates/            # Folder tempat menyimpan file gambar (.png/.jpg) & PDF sertifikat
│   ├── CV_Arthur_Saka.pdf       # File PDF CV aktif (bisa ditimpa sewaktu-waktu)
│   ├── profileporto.png         # Foto diri Arthur Saka
│   └── ...                      # Aset statis lainnya
├── src/
│   ├── app/
│   │   ├── layout.tsx           # Root layout, konfigurasi local fonts, metadata
│   │   ├── page.tsx             # Halaman utama & Global SFX Safety Net
│   │   ├── globals.css          # Theme tokens, utilitas retro, font variables
│   │   └── not-found.tsx        # Halaman 404 bertema arcade retro
│   ├── components/
│   │   ├── HeaderNav.tsx        # Navbar atas, logo Arthur, sprite dev, link nav, toggle SFX/CRT/ANIM
│   │   ├── MiniPixelDev.tsx     # Animasi 8-bit dev mengetik di laptop (tanpa teks samping)
│   │   ├── HeroSection.tsx      # Headline, posisi Full-Stack Intern, tombol CTA, download CV
│   │   ├── PlayerCard.tsx       # Kartu profil karakter, foto berfilter dither, tombol lock filter, status intern
│   │   ├── PixelCompanion.tsx   # Mini robot asisten pemandu navigasi & tips
│   │   ├── AboutSection.tsx     # 3 pilar rekayasa software + Role Matcher interaktif untuk HRD
│   │   ├── ProjectsSection.tsx  # Galeri proyek dengan switcher visual vs catatan arsitektur sistem
│   │   ├── ProjectVisuals.tsx   # Ilustrasi banner SVG pixel-art untuk proyek & pilar
│   │   ├── SkillsInventory.tsx  # Inventaris kemampuan teknis (Frontend, Backend, AI, Tools)
│   │   ├── TimelineSection.tsx  # Checkpoint riwayat pendidikan BINUS CS & pencapaian proyek
│   │   ├── CertificatesSection.tsx # Section 05: Galeri sertifikat & kredensial dengan Retro Lightbox Modal
│   │   ├── ResumeSection.tsx    # Section 06: Curriculum Vitae docket & tombol unduh/preview PDF
│   │   ├── ContactTerminal.tsx  # Kontak langsung (copy email, mailto, sosmed) + terminal interaktif shell
│   │   ├── Footer.tsx           # Footer retro dengan tombol "Back to Top" (sound warp)
│   │   └── PixelIcons.tsx       # Kumpulan ikon SVG gaya 8-bit murni
│   ├── data/
│   │   └── portfolio.ts         # Sumber kebenaran tunggal (Single Source of Truth) seluruh data teks & proyek
│   ├── fonts/                   # Berkas font WOFF2 lokal (PressStart2P & VT323)
│   └── lib/
│       └── audio.ts             # Synthesizer Web Audio API (8 preset suara retro)
└── PROJECT_CONTEXT.md           # Dokumen ini
```

---

## 5. Sumber Data Tunggal (`src/data/portfolio.ts`)

Jika ingin mengubah data diri, tautan, atau isi portofolio, cukup edit berkas `src/data/portfolio.ts`:
- `profile`: Informasi identitas, kampus, domisili, bio ringkas, dan tautan sosial media.
- `resume`: Konfigurasi nama berkas CV dan tautan unduhan.
- `projects`: Daftar proyek GitHub unggulan, ringkasan arsitektur, teknologi, dan URL demo.
- `skills`: Pengelompokan keahlian teknis (Frontend, Backend, AI/ML, Tools).
- `timeline`: Riwayat pendidikan di BINUS University dan milestone proyek.
- `certificates`: Daftar sertifikat, lisensi, dan kredensial (mendukung thumbnail gambar, dokumen PDF di `public/certificates/`, serta URL verifikasi online).

---

## 6. Fitur Audio / SFX (`src/lib/audio.ts`)

Sistem SFX memiliki 8 preset suara:
1. `playSelect()`: Suara klik tombol standar dan menu navigasi.
2. `playToggle(isOn)`: Suara saklar dua nada untuk filter dither, CRT scanlines, dan animasi.
3. `playPowerUp()`: Arpeggio kemenangan saat menyalakan SFX dan membuka live demo.
4. `playPowerDown()`: Suara konsol klasik saat mematikan SFX.
5. `playCoin()`: Suara koin Mario saat menyalin email dan mengunduh CV.
6. `playLaser()`: Suara laser untuk tautan keluar (GitHub, LinkedIn, Email).
7. `playKeypress()`: Suara ketikan mechanical keyboard saat mengetik di Terminal atau mengklik sprite MiniPixelDev.
8. `playWarp()`: Suara sapuan frekuensi ke atas untuk tombol "Back to Top".
- **Global Safety Net di `page.tsx`:** Memastikan seluruh elemen yang dapat diklik (`button`, `a`, `.pixel-btn`) selalu membunyikan suara saat SFX aktif, dengan pembatasan interval 25ms untuk mencegah suara tumpang tindih.

---

## 7. Hal Penting untuk Developer & AI Selanjutnya (Do's & Don'ts)

1. **JANGAN gunakan Google Fonts via CDN:** Font sudah di-*bundle* secara lokal di `src/fonts/` demi performa dan keandalan saat offline/build.
2. **JANGAN menghapus flag `--webpack`:** Turbopack Next.js 16 memiliki bug permission pada direktori OneDrive di Windows.
3. **Pertahankan `suppressHydrationWarning`:** Dipertahankan pada elemen interaktif (`button`, `input`, `html`, `body`) guna menghindari error hidrasi akibat ekstensi browser pengguna (seperti password manager / theme injector).
4. **Pembaruan CV:** Jika Arthur sudah memiliki CV final baru, cukup letakkan file PDF tersebut di `public/CV_Arthur_Saka.pdf`. Seluruh tombol download di website akan otomatis mengarah ke file baru tersebut tanpa perlu menyentuh baris kode apa pun.
5. **Keterbacaan Teks:** Font pixel (`font-pixel`) hanya digunakan untuk heading, badge, label menu, dan tombol. Teks bacaan panjang harus tetap menggunakan font sans-serif agar ramah recruiter.

