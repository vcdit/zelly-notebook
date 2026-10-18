# =============================================================================
# ZELLY AUTO INSTALL SCRIPT — WINDOWS (PowerShell)
# Jalankan: powershell -ExecutionPolicy Bypass -File install.ps1
# Target: Windows 10/11 + WSL atau Git Bash. Port 3000.
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "  ZELLY - INSTALASI OTOMATIS (Windows)" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""

# Helper: tanya user dengan default
function Ask {
    param([string]$Prompt, [string]$Default)
    $input = Read-Host "$Prompt [$Default]"
    if ([string]::IsNullOrWhiteSpace($input)) { return $Default }
    return $input
}

# Helper: password (hidden)
function AskPassword {
    param([string]$Prompt)
    $secure = Read-Host -AsSecureString $Prompt
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    $plain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    return $plain
}

# 1. Konfigurasi database
Write-Host "-- [1/7] KONFIGURASI DATABASE --" -ForegroundColor Yellow
Write-Host ""
$DBUserPath = Ask "Path database user (akun/password)" "C:\zelly\users.sqlite"
$DBMainPath = Ask "Path database utama (notebook/cell/file)" "C:\zelly\zelly.sqlite"
Write-Host ""
Write-Host "  Database user:  $DBUserPath"
Write-Host "  Database utama: $DBMainPath"
Write-Host ""

# 2. JWT Secret
Write-Host "-- [2/7] KEAMANAN --" -ForegroundColor Yellow
Write-Host ""
$jwt = AskPassword "JWT Secret (kosongkan = auto-generate)"
if ([string]::IsNullOrWhiteSpace($jwt)) {
    $bytes = New-Object byte[] 32
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $jwt = [Convert]::ToHexString($bytes)
    Write-Host "  JWT Secret: auto-generate (aman)"
} else {
    Write-Host "  JWT Secret: manual"
}
Write-Host ""

# 3. Deteksi package manager
Write-Host "-- [3/7] PAKET SISTEM --" -ForegroundColor Yellow
$hasWinget = Get-Command winget -ErrorAction SilentlyContinue
$hasChoco = Get-Command choco -ErrorAction SilentlyContinue
if ($hasWinget) {
    Write-Host "[INFO] Deteksi winget, menginstall paket..."
    winget install -e --id OpenJS.NodeJS.LTS --silent 2>&1 | Select-Object -Last 3
    winget install -e --id Podman.Podman --silent 2>&1 | Select-Object -Last 3
    winget install -e --id Git.Git --silent 2>&1 | Select-Object -Last 3
    Write-Host "[OK] Paket terinstall"
} elseif ($hasChoco) {
    Write-Host "[INFO] Deteksi Chocolatey, menginstall paket..."
    choco install -y nodejs-lts podman git 2>&1 | Select-Object -Last 5
    Write-Host "[OK] Paket terinstall"
} else {
    Write-Host "[WARNING] Tidak ada package manager. Install manual: Node.js, Podman, Git."
    $cont = Read-Host "Lanjutkan? [Y/n]"
    if ($cont -eq "n") { exit 1 }
}
Write-Host ""

# 4. Buat direktori database
Write-Host "-- [4/7] DIREKTORI DATABASE --" -ForegroundColor Yellow
$dbUserDir = Split-Path $DBUserPath -Parent
$dbMainDir = Split-Path $DBMainPath -Parent
New-Item -ItemType Directory -Force -Path $dbUserDir | Out-Null
New-Item -ItemType Directory -Force -Path $dbMainDir | Out-Null
Write-Host "[OK] Database user dir:  $dbUserDir"
Write-Host "[OK] Database utama dir: $dbMainDir"
Write-Host ""

# 5. Masuk ke folder proyek & install deps
Write-Host "-- [5/7] DEPENDENCY NODE.JS --" -ForegroundColor Yellow
$projectDir = "C:\zelly"
if (-not (Test-Path $projectDir)) {
    Write-Host "[INFO] Folder $projectDir tidak ada, membuat..."
    New-Item -ItemType Directory -Force -Path $projectDir | Out-Null
    Set-Location $projectDir
    if (-not (Test-Path "package.json")) {
        Write-Host "[INFO] Clone proyek dari GitHub..."
        git clone https://github.com/vcdit/zelly-notebook.git .
    }
} else {
    Set-Location $projectDir
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js/npm tidak terinstall."
    exit 1
}
npm install --no-audit --no-fund
Write-Host "[OK] Dependency Node.js diinstall"
Write-Host ""

# 6. Buat .env
Write-Host "-- [6/7] FILE .ENV --" -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    $envContent = @"
# Zelly Environment Configuration
DB_USERS_PATH=$DBUserPath
DB_MAIN_PATH=$DBMainPath
JWT_SECRET=$jwt
PORT=3000
"@
    Set-Content -Path ".env" -Value $envContent -Encoding UTF8
    Write-Host "[OK] File .env dibuat"
} else {
    Write-Host "[INFO] .env sudah ada"
    (Get-Content ".env") -replace "^DB_USERS_PATH=.*", "DB_USERS_PATH=$DBUserPath" |
        -replace "^DB_MAIN_PATH=.*", "DB_MAIN_PATH=$DBMainPath" |
        -replace "^JWT_SECRET=.*", "JWT_SECRET=$jwt" |
        Set-Content ".env" -Encoding UTF8
    Write-Host "[OK] Path database diupdate di .env"
}
Write-Host ""

# 7. Podman
Write-Host "-- [7/7] PODMAN --" -ForegroundColor Yellow
if (Get-Command podman -ErrorAction SilentlyContinue) {
    Write-Host "[INFO] Menarik image Python..."
    podman pull python:3-slim 2>&1 | Select-Object -Last 3
    Write-Host "[INFO] Menarik image Node.js..."
    podman pull node:20-slim 2>&1 | Select-Object -Last 3
    Write-Host "[OK] Podman siap"
} else {
    Write-Host "[WARNING] Podman tidak ditemukan. Eksekusi cell/terminal tidak akan bekerja."
}
Write-Host ""

# Jalankan server
Write-Host "============================================================" -ForegroundColor Green
Write-Host "  MENJALANKAN SERVER..." -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Yellow
$env:PORT = "3000"
Start-Process -FilePath "node" -ArgumentList "server.js" -RedirectStandardOutput "C:\zelly\zelly.log" -RedirectStandardError "C:\zelly\zelly.log" -NoNewWindow
Start-Sleep -Seconds 3

try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -TimeoutSec 5
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host "  ZELLY BERHASIL DIJALANKAN!" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "  Akses:     http://localhost:3000"
    Write-Host "  Log:       C:\zelly\zelly.log"
    Write-Host "  DB User:   $DBUserPath"
    Write-Host "  DB Utama:  $DBMainPath"
    Write-Host ""
    Write-Host "  Hentikan:  Stop-Process -Name node"
    Write-Host "============================================================" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "[WARNING] Server mungkin masih memulai. Cek log di C:\zelly\zelly.log"
}
