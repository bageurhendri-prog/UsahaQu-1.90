# GitHub Pages Auto Portfolio 🚀

Web page portofolio modern otomatis yang membaca repositori publik langsung dari GitHub API dan siap dibuild serta dideploy ke **GitHub Pages**.

## ✨ Fitur Utama

- 🔄 **Otomatisasi Penuh dari GitHub API**: Mengambil profil pengguna, avatar, bio, statistik (repos, bintang, forks, followers), dan seluruh repositori publik tanpa perlu mengetik manual.
- 🎯 **Dukungan Siap Pakai untuk GitHub Pages**: Dilengkapi file workflow `.github/workflows/deploy.yml` dan konfigurasi Vite `base: './'` sehingga tidak akan terjadi error path 404 saat dihosting di subfolder repositori (`https://username.github.io/repo-name/`).
- 🌟 **Proyek Unggulan (Featured Showcase)**: Menyoroti repositori terbaik dengan bintang terbanyak atau yang memiliki link live demo.
- 🔍 **Filter & Pencarian Instan**:
  - Pencarian nama proyek, deskripsi, dan topik tagar.
  - Filter bahasa pemrograman (TypeScript, JavaScript, HTML, Python, Kotlin, dll).
  - Filter topik tagar (`#pos`, `#offline-first`, `#indexeddb`, `#umkm`, dll).
  - Filter khusus "Hanya yang ada Demo" dan "Sertakan Fork".
  - Pengurutan: Bintang Terbanyak, Baru Diperbarui, Fork Terbanyak, Nama A-Z.
  - Pilihan Tampilan: Grid Card dan Compact List.
- 📖 **Detail Modal & README Preview**: Klik pada kartu proyek untuk melihat detail lengkap, perintah cepat `git clone`, dan isi file `README.md` langsung.
- 🌓 **Dark & Light Mode**: Tampilan responsif modern dengan dukungan tema gelap dan terang.
- 🌐 **Dukungan Parameter URL Dinamis**: Bisa dibuka dengan format `?user=username_anda` untuk langsung menampilkan repositori GitHub akun mana pun.

---

## 🛠️ Cara Build dan Deploy ke GitHub Pages

### 1. Push ke Repositori GitHub
Buat repositori baru di akun GitHub Anda (misalnya `portfolio` atau `<username>.github.io`), lalu push kode ini:

```bash
git init
git add .
git commit -m "feat: initial auto portfolio for github pages"
git branch -M main
git remote add origin https://github.com/<username>/<repo-name>.git
git push -u origin main
```

### 2. Aktifkan GitHub Actions di GitHub Pages
1. Masuk ke halaman repositori di GitHub.
2. Klik tab **Settings** > pilih menu **Pages** di sidebar kiri.
3. Pada bagian **Build and deployment > Source**, ganti pilihan menjadi **GitHub Actions**.

### 3. Otomatisasi GitHub Actions
File workflow sudah tersedia di `.github/workflows/deploy.yml`. Setiap kali Anda push ke branch `main`, GitHub Actions akan menjalankan:
- `npm install`
- `npm run build`
- Deploy otomatis folder `dist/` ke GitHub Pages!

Situs Anda akan aktif di:
```
https://<username>.github.io/<repo-name>/
```

---

## 💻 Menjalankan di Komputer Lokal

```bash
# Instal dependensi
npm install

# Jalankan server lokal
npm run dev

# Tes build static untuk verifikasi
npm run build
npm run preview
```

Lisensi: MIT
Dibuat untuk ekosistem pengembang dan UMKM.
