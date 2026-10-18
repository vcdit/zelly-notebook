# Zelly — Notebook Berbasis Cell (Podman Rootless)

Notebook web seperti Google Colab, backend Node.js, eksekusi kode via **Podman rootless**,
UI aesthetic, bahasa Indonesia dan Inggris, maksimal **16 file**, tanpa folder dalam backend.

---

## 📁 Daftar File (16 file)

| File | Fungsi |
|------|--------|
| `package.json` | Dependency Node.js |
| `server.js` | Entry point Express + Socket.io |
| `db.js` | SQLite (sql.js) dual database + auto-save |
| `auth.js` | Register, login, JWT, role owner vs member |
| `notebook.js` | CRUD notebook, pemisahan per user, hak owner cross-user |
| `cell.js` | Eksekusi cell via Podman container (output streaming) |
| `podman.js` | Wrapper Podman (run, stop, rm, volume, images, network, files) |
| `terminal.js` | WebSocket terminal PTY via Podman |
| `session.js` | Shared session (pesan, variabel, file antar notebook) |
| `public/index.html` | UI utama (bilingual, aesthetic, responsive, tabs Cell/Files) |
| `public/style.css` | Gaya kustom |
| `public/app.js` | Logika frontend |
| `public/terminal.js` | Integrasi xterm.js |
| `.env.example` | Contoh variabel environment |
| `install.sh` | Script install otomatis |
| `README.md` | Panduan ini |

---

## 🚀 Panduan Install (Manusia & AI)

### Prasyarat
- **Linux** (semua distribusi — auto-detect apt/dnf/yum/apk/xbps/brew)
- Node.js v18+ dan npm
- Podman (rootless)
- Git

### Langkah 1: Clone & Install
```bash
git clone https://github.com/vcdit/zelly-notebook.git
cd zelly-notebook
chmod +x install.sh
./install.sh
```

Script `install.sh` akan:
1. **Deteksi OS otomatis** (apt/dnf/yum/apk/xbps/brew) → install `nodejs`, `npm`, `podman`, `git`, `curl`
2. Tanya lokasi database user & notebook (default `/users.sqlite` & `/zelly.sqlite`)
3. Tanya JWT secret (auto-generate jika kosong)
4. Buat direktori database (permission `700`)
5. Install dependency `npm install`
6. Buat `.env` (permission `600`)
7. Pull image `python:3-slim`, `node:20-slim`, `bash:latest` ke Podman
8. Jalankan server di **port 3000**

### Langkah 2: Akses Aplikasi
Buka browser: `http://localhost:3000`

User pertama yang sign up otomatis menjadi **owner**. Owner dapat melihat dan menghapus notebook anggota lain.

#### Alamat (URL) setiap tampilan
Setiap tampilan punya alamat sendiri sehingga bisa di-bookmark, dibagikan, dan tombol
Back/Forward browser berfungsi. Ganti `ipaddress` dengan IP/domain server Anda.

| Alamat | Tampilan |
|--------|----------|
| `ipaddress/` | Dashboard — daftar notebook |
| `ipaddress/login` | Layar masuk / daftar |
| `ipaddress/new` | Dashboard + dialog tambah notebook |
| `ipaddress/notebook/<id-sesi>` | Notebook (tab **Cell**) |
| `ipaddress/notebook/<id-sesi>/files` | Notebook (tab **Files**) |
| `ipaddress/notebook/<id-sesi>/terminal` | Notebook dengan **Terminal** terbuka |

`<id-sesi>` = **ID Sesi** notebook (diisi saat membuat notebook, mis. `0001a`).
Bila ID Sesi dikosongkan, otomatis memakai ID notebook sebagai alamatnya.

Contoh: notebook bernama sesi `0001a` → `ipaddress/notebook/0001a`.

#### Pengaturan (Settings) & Tema
Tombol **⚙️ Pengaturan** ada di **kiri atas** navbar. Di dalamnya:
- **Bahasa** — Indonesia / English (dulu tombol bahasa mengapung di kanan atas, kini pindah ke sini)
- **Tema** — 4 pilihan: **Terang (Light)**, **Gelap (Dark)**, **Laut (Ocean)**, **Senja (Sunset)**

Pilihan bahasa & tema disimpan di browser (`localStorage`) dan diterapkan langsung tanpa memuat ulang.

#### Tab Files (Penyimpanan Notebook)
Di dalam notebook, tab **Files** menampilkan penyimpanan notebook (tersimpan di volume Podman):
- Upload lewat tombol **Upload** atau **tarik-lepas (drag & drop)** ke zona unggah (maks 120 MB/file)
- **Folder Baru**, **File Baru**, **Rename**, **Hapus**
- **Download** per file, **Pilih** (mode pilih) → **Unduh Terpilih** (zip) / **Hapus Terpilih**
- **Unduh Semua** (zip seluruh folder)
- File bisa langsung dipakai di cell kode, mis. `open('foto.jpg')` atau `open('/workspace/foto.jpg')`

### Langkah 3: Variabel Environment (`.env`)

| Variabel | Contoh | Keterangan |
|----------|--------|------------|
| `PORT` | `3000` | Port server |
| `JWT_SECRET` | `ganti_dengan_rahasia_anda` | Kunci signing JWT |
| `DB_USERS_PATH` | `/alpine/database/users/users.sqlite` | Lokasi DB user |
| `DB_MAIN_PATH` | `/workspace/database/zelly.sqlite` | Lokasi DB utama |
| `PODMAN_SOCKET` | `/run/user/$(id -u)/podman/podman.sock` | Socket Podman rootless |

---

## 🐳 Podman Rootless — Setup Manual (jika tidak pakai install.sh)

### Semua Linux (auto-detect)
```bash
# Debian/Ubuntu
sudo apt-get install -y podman
# Fedora/RHEL/CentOS
sudo dnf install -y podman
# Arch
sudo pacman -S podman
# Void
sudo xbps-install -Sy podman
# Alpine
sudo apk add podman

loginctl enable-linger $USER
podman pull python:3-slim
podman pull node:20-slim
podman pull bash:latest
```

Verifikasi:
```bash
podman --version
podman images
```

---

## 🗄️ Lokasi Database (Rahasia & Terpisah)

| Database | Path | Isi |
|----------|------|-----|
| Users | `/alpine/database/users/users.sqlite` | email, password_hash, role (owner/member) |
| Main | `/workspace/database/zelly.sqlite` | notebooks, cells, sessions, resources |

Kedua file diletakkan di luar web root, permission `700` pada direktori dan `600` pada file, tidak dapat diakses via HTTP.

---

## 🔐 Keamanan

- **Login**: email + password (bcrypt hash) + JWT (7 hari)
- **Role**: User pertama otomatis `owner`, selanjutnya `member`
- **Owner**: bisa melihat dan menghapus notebook anggota lain
- **Member**: hanya bisa mengakses notebook milik sendiri
- **Sandbox**: Setiap cell & terminal dijalankan dalam container Podman rootless, non-root user, tanpa mount host file, jaringan hanya ke API Zelly
- **Resource limit**: RAM, CPU, Storage dari form notebook (`--memory`, `--cpus`, `--storage-opt`)

---

## 🧩 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| Notebook | Buat, edit, hapus; pemisahan per user |
| Environment | Pilih dari image Podman yang tersedia (Python, Node.js, dll) |
| Cell | Kode per cell, tombol Start, output di bawah, kosong = tidak ditampilkan |
| Terminal | xterm.js + WebSocket + Podman PTY, fullscreen di HP |
| Shortcut HP | Baris tombol Ctrl, Alt, Tab, Esc, panah, simbol (hanya HP) |
| ID Sesi | Notebook dengan session ID sama saling bersambung (pesan, variabel, file) |
| Temporary | Durasi 3 hari–2 minggu, dihapus otomatis + notifikasi |
| Keep-alive | Cell tetap jalan walau tidak dibuka 6 jam |
| UI | Aesthetic, modern, responsive HP & PC, bilingual ID/EN |

---

## 🤖 Panduan untuk AI (Deployment Otomatis)

1. Clone repository ke folder target.
2. Jalankan: `chmod +x install.sh && ./install.sh`
3. Pastikan Podman rootless aktif dan image tersedia.
4. Server siap di port 3000. Health check: `GET /api/health`
5. Login/register via UI, user pertama menjadi owner.

---

## 🛠️ Perintah Berguna

```bash
# Lihat log server
cat /tmp/zelly.log

# Hentikan server
kill $(cat /tmp/zelly.pid)

# Lihat container Podman
podman ps -a

# Lihat image Podman
podman images

# Bersihkan container selesai
podman container prune -f
```

---

## 📄 Lisensi

MIT

---

## Files to ignore (saat upload git)

```
node_modules/
*.sqlite
*.sqlite-shm
*.sqlite-wal
.env
*.log
.DS_Store
```
