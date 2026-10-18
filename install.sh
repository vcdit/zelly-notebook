#!/usr/bin/env bash
# =============================================================================
# ZELLY AUTO INSTALL SCRIPT
# Jalankan: chmod +x install.sh && sudo ./install.sh
# Target: Semua Linux (apt/dnf/yum/apk/xbps) & macOS (brew). Port 3000.
# Auto-detect OS, tanya lokasi database, sisanya otomatis.
# =============================================================================
set -e

echo ""
echo "============================================================"
echo "  ZELLY — INSTALASI OTOMATIS"
echo "============================================================"
echo ""

# ── Helper: tanya user dengan default ─────────────────────────
ask() {
  local prompt="$1"
  local default="$2"
  local input
  read -rp "$prompt [$default]: " input
  echo "${input:-$default}"
}

# ── Helper: password (hidden input) ──────────────────────────
ask_password() {
  local prompt="$1"
  local input
  read -rsp "$prompt: " input
  echo ""
  echo "$input"
}

# ── 1. Konfigurasi database (INTERAKTIF) ─────────────────────
echo "── [1/7] KONFIGURASI DATABASE ──"
echo ""
DB_USER_PATH=$(ask "Path database user (akun/password)" "/users.sqlite")
DB_MAIN_PATH=$(ask "Path database utama (notebook/cell/file)" "/zelly.sqlite")
echo ""
echo "  Database user:  $DB_USER_PATH"
echo "  Database utama: $DB_MAIN_PATH"
echo ""

# ── 2. JWT Secret (INTERAKTIF) ──────────────────────────────
echo "── [2/7] KEAMANAN ──"
echo ""
JWT_SECRET=$(ask_password "JWT Secret (kosongkan = auto-generate)")
if [ -z "$JWT_SECRET" ]; then
  JWT_SECRET=$(head -c 32 /dev/urandom | xxd -p 2>/dev/null || head -c 32 /dev/urandom | od -An -tx1 | tr -d ' \n')
  echo "  JWT Secret: auto-generate (aman)"
else
  echo "  JWT Secret: manual"
fi
echo ""

# ── 3. Deteksi OS & install paket ───────────────────────────
echo "── [3/7] PAKET SISTEM ──"
if [[ "$OSTYPE" == "darwin"* ]]; then
  # macOS
  if ! command -v brew &> /dev/null; then
    echo "[INFO] Install Homebrew..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
  fi
  echo "[INFO] macOS: install paket via Homebrew..."
  brew install node podman git curl 2>&1 | tail -5
  echo "[OK] Paket terinstall"
elif command -v apt-get &> /dev/null; then
  echo "[INFO] Deteksi Debian/Ubuntu, menginstall paket..."
  apt-get update -qq && apt-get install -y nodejs npm podman git curl 2>&1 | tail -5
  echo "[OK] Paket terinstall"
elif command -v dnf &> /dev/null; then
  echo "[INFO] Deteksi Fedora/RHEL, menginstall paket..."
  dnf install -y nodejs npm podman git curl 2>&1 | tail -5
  echo "[OK] Paket terinstall"
elif command -v yum &> /dev/null; then
  echo "[INFO] Deteksi CentOS/RHEL, menginstall paket..."
  yum install -y nodejs npm podman git curl 2>&1 | tail -5
  echo "[OK] Paket terinstall"
elif command -v apk &> /dev/null; then
  echo "[INFO] Deteksi Alpine, menginstall paket..."
  apk add --no-cache nodejs npm podman git curl 2>&1 | tail -5
  echo "[OK] Paket terinstall"
elif command -v xbps-install &> /dev/null; then
  echo "[INFO] Deteksi Void Linux, menginstall paket..."
  xbps-install -Sy nodejs npm podman git curl 2>&1 | tail -5
  echo "[OK] Paket terinstall"
else
  echo "[WARNING] OS tidak dikenal. Pastikan Node.js, Podman, dan Git sudah terinstall."
  read -rp "Lanjutkan? [Y/n]: " cont
  [ "$cont" = "n" ] && exit 1
fi
echo ""

# ── 4. Buat direktori database ───────────────────────────────
echo "── [4/7] DIREKTORI DATABASE ──"
DB_USER_DIR=$(dirname "$DB_USER_PATH")
DB_MAIN_DIR=$(dirname "$DB_MAIN_PATH")
mkdir -p "$DB_USER_DIR" "$DB_MAIN_DIR"
chmod 700 "$DB_USER_DIR" "$DB_MAIN_DIR"
echo "[OK] Database user dir:  $DB_USER_DIR (perm 700)"
echo "[OK] Database utama dir: $DB_MAIN_DIR (perm 700)"
echo ""

# ── 5. Masuk ke folder proyek & install deps ────────────────
echo "── [5/7] DEPENDENCY NODE.JS ──"
PROJECT_DIR="/workspace/zelly"
if [ ! -d "$PROJECT_DIR" ]; then
  echo "[INFO] Folder $PROJECT_DIR tidak ada, membuat..."
  mkdir -p "$PROJECT_DIR"
  cd "$PROJECT_DIR"
  # Clone dari GitHub jika folder kosong
  if [ ! -f package.json ]; then
    echo "[INFO] Clone proyek dari GitHub..."
    git clone https://github.com/zelly-app/zelly.git . 2>/dev/null || {
      echo "[ERROR] Gagal clone. Salin file proyek ke $PROJECT_DIR dulu."
      exit 1
    }
  fi
else
  cd "$PROJECT_DIR"
fi

if ! command -v npm &> /dev/null; then
  echo "[ERROR] Node.js/npm tidak terinstall."
  exit 1
fi
npm install --no-audit --no-fund
echo "[OK] Dependency Node.js diinstall"
echo ""

# ── 6. Buat .env ────────────────────────────────────────────
echo "── [6/7] FILE .ENV ──"
if [ ! -f .env ]; then
  cat > .env <<EOF
# Zelly Environment Configuration
# Database paths (diatur saat install)
DB_USERS_PATH=$DB_USER_PATH
DB_MAIN_PATH=$DB_MAIN_PATH

# Security
JWT_SECRET=$JWT_SECRET

# Server
PORT=3000
# PODMAN_SOCKET=/run/user/$(id -u)/podman/podman.sock
EOF
  chmod 600 .env
  echo "[OK] File .env dibuat (perm 600)"
else
  echo "[INFO] .env sudah ada, tidak diubah"
  # Update paths in existing .env
  sed -i "s|^DB_USERS_PATH=.*|DB_USERS_PATH=$DB_USER_PATH|" .env
  sed -i "s|^DB_MAIN_PATH=.*|DB_MAIN_PATH=$DB_MAIN_PATH|" .env
  sed -i "s|^JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" .env
  echo "[OK] Path database diupdate di .env"
fi
echo ""

# ── 7. Podman rootless + images ─────────────────────────────
echo "── [7/7] PODMAN ──"
if command -v podman &> /dev/null; then
  echo "[INFO] Setup Podman rootless..."
  loginctl enable-linger "$USER" 2>/dev/null || true
  echo "[INFO] Menarik image Python (bisa beberapa menit)..."
  podman pull python:3-slim 2>&1 | tail -3 || echo "[WARNING] Gagal pull python:3-slim (coba manual)"
  echo "[INFO] Menarik image Node.js..."
  podman pull node:20-slim 2>&1 | tail -3 || echo "[WARNING] Gagal pull node:20-slim (coba manual)"
  echo "[INFO] Menarik image Bash..."
  podman pull bash:latest 2>&1 | tail -3 || echo "[WARNING] Gagal pull bash:latest (coba manual)"
  echo "[OK] Podman siap"
else
  echo "[WARNING] Podman tidak ditemukan. Eksekusi cell/terminal tidak akan bekerja."
fi
echo ""

# ── Jalankan server ─────────────────────────────────────────
echo "============================================================"
echo "  MENJALANKAN SERVER..."
echo "============================================================"
cd "$PROJECT_DIR"
PORT=3000 node server.js > /tmp/zelly.log 2>&1 &
echo $! > /tmp/zelly.pid
sleep 3

if curl -s http://localhost:3000/api/health > /dev/null 2>&1; then
  echo ""
  echo "============================================================"
  echo "  ZELLY BERHASIL DIJALANKAN!"
  echo "============================================================"
  echo ""
  echo "  Akses:     http://localhost:3000"
  echo "  Log:       /tmp/zelly.log"
  echo "  PID:       $(cat /tmp/zelly.pid)"
  echo "  DB User:   $DB_USER_PATH"
  echo "  DB Utama:  $DB_MAIN_PATH"
  echo ""
  echo "  Hentikan:  kill \$(cat /tmp/zelly.pid)"
  echo "============================================================"
else
  echo ""
  echo "[WARNING] Server mungkin masih memulai. Cek log di /tmp/zelly.log"
  echo "  tail -f /tmp/zelly.log"
fi
