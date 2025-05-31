# DineFlow Restaurant Management System

Sistem Manajemen Restoran yang dibangun menggunakan Electron, React, Vite, dan TailwindCSS untuk membuat aplikasi desktop cross-platform.

## Teknologi yang Digunakan

*   **Electron**: Untuk membangun aplikasi desktop dengan teknologi web (JavaScript, HTML, CSS).
*   **React**: Library JavaScript untuk membangun antarmuka pengguna.
*   **Vite**: Alat build frontend yang cepat.
*   **TailwindCSS**: Framework CSS utility-first untuk desain antarmuka yang cepat.
*   **Electron is Dev**: Untuk mendeteksi apakah aplikasi berjalan dalam mode pengembangan atau produksi.
*   **Electron Builder**: Untuk memaketkan dan membangun aplikasi Electron yang siap didistribusikan.
*   **Concurrently**: Untuk menjalankan beberapa perintah secara bersamaan.
*   **Wait-on**: Untuk menunggu layanan tertentu aktif sebelum menjalankan perintah lain.
*   **Cross-env**: Untuk mengatur variabel lingkungan secara cross-platform.

## Memulai

Untuk menjalankan proyek ini secara lokal, ikuti langkah-langkah berikut:

1.  **Clone repository (jika ada):**
    ```bash
    git clone <url_repository>
    cd <nama_direktori_proyek>
    ```

2.  **Install dependencies:**
    Pastikan Anda memiliki Node.js dan npm (atau Yarn) terinstal.
    ```bash
    npm install
    ```
    atau jika menggunakan Yarn:
    ```bash
    yarn install
    ```

## Skrip yang Tersedia

Dalam direktori proyek, Anda dapat menjalankan beberapa skrip:

*   **`npm run dev`** atau **`yarn dev`**
    Menjalankan aplikasi React menggunakan Vite development server. Biasanya akan tersedia di `http://localhost:5173`.

*   **`npm run build`** atau **`yarn build`**
    Mem-build aplikasi React untuk produksi ke direktori `dist`.

*   **`npm run electron:dev`** atau **`yarn electron:dev`**
    Menjalankan aplikasi Electron dalam mode pengembangan. Perintah ini akan:
    1.  Menjalankan Vite development server untuk frontend React.
    2.  Menunggu hingga Vite server siap pada `http://localhost:5173`.
    3.  Menjalankan aplikasi Electron yang akan memuat frontend dari Vite server.

*   **`npm run electron:build`** atau **`yarn electron:build`**
    Mem-build aplikasi React untuk produksi dan kemudian memaketkan aplikasi Electron untuk distribusi menggunakan `electron-builder`. Hasil build akan tersedia di direktori `release`.

*   **`npm run preview`** atau **`yarn preview`**
    Menjalankan server lokal untuk melihat hasil build produksi dari Vite.

## Struktur Proyek

Berikut adalah gambaran umum struktur direktori utama:

*   **`electron/`**: Berisi file-file utama untuk proses Electron.
    *   `main.js`: Skrip utama Electron, bertanggung jawab untuk membuat window aplikasi dan menangani event sistem.
    *   `preload.js`: Skrip yang berjalan sebelum halaman web dimuat di renderer process, digunakan untuk mengekspos API Node.js secara aman ke renderer.
*   **`dist/`**: Direktori output untuk build produksi frontend React (dihasilkan oleh `vite build`).
*   **`public/`**: (Jika ada, standar untuk Vite) Berisi aset statis yang akan disalin ke direktori `dist` saat build.
*   **`release/`**: Direktori output untuk paket aplikasi Electron yang siap didistribusikan (dihasilkan oleh `electron-builder`).
*   **`src/`**: Berisi kode sumber untuk aplikasi React (frontend).
    *   `main.jsx`: Titik masuk utama untuk aplikasi React.
    *   `App.jsx`: Komponen root aplikasi React.
    *   `components/`: Direktori untuk komponen-komponen React.
    *   `contexts/`: Direktori untuk React Contexts.
    *   `pages/`: Direktori untuk komponen halaman/tampilan.
    *   `services/`: Direktori untuk layanan API atau logika bisnis lainnya.
    *   `index.css`: File CSS global atau utama.
*   **`index.html`**: Template HTML utama untuk aplikasi React.
*   **`package.json`**: Menyimpan metadata proyek, daftar dependensi, dan skrip npm.
*   **`tailwind.config.js`**: File konfigurasi untuk TailwindCSS.
*   **`vite.config.js`**: File konfigurasi untuk Vite.

## Membangun untuk Produksi

Untuk membuat versi aplikasi yang siap didistribusikan:

```bash
npm run electron:build
```

atau jika menggunakan Yarn:

```bash
yarn electron:build
```

Perintah ini akan menghasilkan installer atau paket aplikasi di direktori `release/` sesuai dengan konfigurasi di `package.json` pada bagian `build`.

---

Ini adalah gambaran dasar dari codebase Anda. Anda dapat menambahkan detail lebih lanjut sesuai kebutuhan, seperti cara berkontribusi, lisensi, atau fitur-fitur spesifik dari aplikasi DineFlow.
