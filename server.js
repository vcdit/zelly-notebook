'use strict';

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const os = require('os');
const fs = require('fs');

const { authenticate, requireOwner, register, login, refreshToken } = require('./auth');
const archiver = require('archiver');
const multer = require('multer');
const {
  listNotebooks, getNotebook, createNotebook, updateNotebook, deleteNotebook, duplicateNotebook,
  listCells, createCell, updateCellCode, updateCellOutput, moveCell, duplicateCell, deleteCell
} = require('./notebook');
const { executeCell } = require('./cell');
const { getNotebookVolumePath } = require('./podman');
const {
  startTerminal, stopTerminal, terminalContainers
} = require('./terminal');
const {
  createSession, getNotebooksInSession, sendSessionMessage, getSessionResources
} = require('./notebook');
const {
  podmanAvailable, listAvailableImages, ensureZellyNetwork,
  cleanupExpiredNotebooks
} = require('./podman');
const { initDb, saveDb } = require('./db');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'zelly_super_secret_change_me';

const app = express();
app.use(cors());
app.use(express.json());
function noCacheStatic(dirname) {
  return express.static(dirname, {
    etag: true,
    lastModified: true,
    setHeaders: (res) => res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
  });
}

// Paksa browser memuat HTML terbaru: alamat tanpa ?v diarahkan ke ?v=7
// (memecah cache lama yang tersimpan sebelum fitur files/tabs/routing ditambahkan)
app.get('/', (req, res, next) => {
  if (!req.query || !req.query.v) {
    return res.redirect(302, '/?v=9');
  }
  next();
});

app.use(noCacheStatic(path.join(__dirname, 'public')));
// Self-host xterm.js agar tidak bergantung CDN eksternal
// (jaringan HP sering memblokir/sangat lambat mengambil CDN pihak ketiga)
app.use('/vendor/xterm', noCacheStatic(path.join(__dirname, 'node_modules', 'xterm')));

// ---------------------------------------------------------------
// HEALTH
// ---------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'zelly', port: PORT, podman: podmanAvailable() });
});

// ---------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------
app.post('/api/auth/register', (req, res) => {
  try {
    register(req.body);
    // Auto-login setelah register: endpoint harus mengembalikan token di kedua alur.
    const payload = login({ email: req.body.email, password: req.body.password });
    res.status(201).json({
      user: { id: payload.id, email: payload.email, name: payload.name, role: payload.role },
      token: payload.token,
      message: 'Registrasi berhasil'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const data = login(req.body);
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

// Perpanjang sesi: token lama (masih valid) ditukar token baru 30 hari
app.post('/api/auth/refresh', authenticate, (req, res) => {
  try {
    const data = refreshToken(req.headers.authorization.slice(7));
    res.json(data);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

app.get('/api/auth/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// ---------------------------------------------------------------
// NOTEBOOKS
// ---------------------------------------------------------------
// Middleware: cek password notebook (Fase 2.5)
function requireNotebookPassword(req, res, next) {
  const { verifyNotebookPassword } = require('./notebook');
  const password = req.headers['x-notebook-password'] || req.query.password || (req.body && req.body.password);
  const result = verifyNotebookPassword(req.params.id, password || '');
  if (!result.valid) {
    return res.status(403).json({ error: result.error || 'Password salah' });
  }
  next();
}

app.get('/api/notebooks', authenticate, (req, res) => {
  const notebooks = listNotebooks(req.user.id, req.user.role);
  res.json({ notebooks });
});

app.get('/api/notebooks/:id', authenticate, requireNotebookPassword, (req, res) => {
  const nb = getNotebook(req.params.id, req.user.id, req.user.role);
  if (!nb) return res.status(404).json({ error: 'Notebook tidak ditemukan atau tidak ada akses' });
  res.json({ notebook: nb });
});

app.post('/api/notebooks', authenticate, (req, res) => {
  try {
    const nb = createNotebook({
      userId: req.user.id,
      name: req.body.name,
      environment: req.body.environment || 'python',
      sessionId: req.body.sessionId || '',
      type: req.body.type || 'long-lasting',
      expiresAt: req.body.expiresAt || null,
      durationDays: req.body.durationDays,
      maxRam: req.body.maxRam || null,
      maxStorage: req.body.maxStorage || null,
      maxCpu: req.body.maxCpu || null,
      keepAlive: req.body.keepAlive === true || req.body.keepAlive === 1 || req.body.keepAlive === 'true'
    });
    res.status(201).json({ notebook: nb });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/notebooks/:id', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const nb = updateNotebook(req.params.id, req.user.id, req.user.role, req.body);
    res.json({ notebook: nb });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/notebooks/:id', authenticate, requireNotebookPassword, (req, res) => {
  try {
    deleteNotebook(req.params.id, req.user.id, req.user.role);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------------
// CELLS
// ---------------------------------------------------------------
app.get('/api/notebooks/:id/cells', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const cells = listCells(req.params.id, req.user.id, req.user.role);
    res.json({ cells });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/notebooks/:id/cells', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const cell = createCell(req.params.id, req.user.id, req.user.role, {
      code: req.body.code,
      language: req.body.language,
      orderIndex: req.body.orderIndex
    });
    res.status(201).json({ cell });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update kode/language cell (sebelum dijalankan)
app.put('/api/cells/:id', authenticate, (req, res) => {
  try {
    const cell = updateCellCode(req.params.id, req.user.id, req.user.role, {
      code: req.body.code,
      language: req.body.language,
      orderIndex: req.body.orderIndex
    });
    res.json({ cell });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Pindah cell ke atas/bawah
app.put('/api/cells/:id/move', authenticate, (req, res) => {
  try {
    const direction = parseInt(req.body.direction, 10);
    if (direction !== -1 && direction !== 1) throw new Error('Direction tidak valid');
    moveCell(req.params.id, req.user.id, req.user.role, direction);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Duplikat cell
app.post('/api/cells/:id/duplicate', authenticate, (req, res) => {
  try {
    const cell = duplicateCell(req.params.id, req.user.id, req.user.role);
    res.status(201).json({ cell });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Hapus cell
app.delete('/api/cells/:id', authenticate, (req, res) => {
  try {
    deleteCell(req.params.id, req.user.id, req.user.role);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Duplikat notebook
app.post('/api/notebooks/:id/duplicate', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const nb = duplicateNotebook(req.params.id, req.user.id, req.user.role);
    res.status(201).json({ notebook: nb });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Set/remove password notebook
app.put('/api/notebooks/:id/password', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const { setNotebookPassword } = require('./notebook');
    const result = setNotebookPassword(req.params.id, req.user.id, req.user.role, req.body.password || '');
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cek status password notebook
app.get('/api/notebooks/:id/password-status', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const { getNotebookPasswordStatus } = require('./notebook');
    res.json(getNotebookPasswordStatus(req.params.id, req.user.id, req.user.role));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Stop cell yang berjalan
app.post('/api/cells/:id/stop', authenticate, (req, res) => {
  try {
    const { stopCell } = require('./cell');
    stopCell(req.params.id, req.user.id, req.user.role);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Kirim stdin ke cell yang sedang menunggu input
app.post('/api/cells/:id/stdin', authenticate, (req, res) => {
  try {
    const { sendStdin } = require('./cell');
    sendStdin(req.params.id, req.user.id, req.user.role, req.body.text || '');
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Stop semua cell di notebook
app.post('/api/notebooks/:id/stop-all', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const { stopAllCells } = require('./cell');
    stopAllCells(req.params.id, req.user.id, req.user.role, io);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------------
// ENVIRONMENT (dari image Podman, bukan runtime host)
// ---------------------------------------------------------------
app.get('/api/environments', authenticate, (req, res) => {
  const images = listAvailableImages();
  res.json({ environments: images });
});

// ---------------------------------------------------------------
// SESSION (shared)
// ---------------------------------------------------------------
app.get('/api/session/:sessionId/notebooks', authenticate, (req, res) => {
  const notebooks = getNotebooksInSession(req.params.sessionId, req.user.id, req.user.role);
  res.json({ notebooks });
});

app.post('/api/session/:sessionId/message', authenticate, (req, res) => {
  const data = sendSessionMessage(req.params.sessionId, req.user.id, req.body.message, req.body.type || 'text');
  res.status(201).json(data);
});

app.get('/api/session/:sessionId/resources', authenticate, (req, res) => {
  const resources = getSessionResources(req.params.sessionId, req.user.id, req.user.role);
  res.json({ resources });
});

// ---------------------------------------------------------------
// NOTIFIKASI (untuk temporary notebook expiration)
// ---------------------------------------------------------------
app.get('/api/notifications', authenticate, (req, res) => {
  const { allMain } = require('./db');
  const notifs = allMain(`
    SELECT id, notebook_id, message, type, created_at, read_at
    FROM notifications
    WHERE user_id = ? AND read_at IS NULL
    ORDER BY created_at DESC
  `, [req.user.id]);
  res.json({ notifications: notifs });
});

app.post('/api/notifications/:id/read', authenticate, (req, res) => {
  const { runMain } = require('./db');
  runMain('UPDATE notifications SET read_at = datetime("now") WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
  res.json({ success: true });
});

// ---------------------------------------------------------------
// ADMIN (owner only) — lihat semua user, hapus notebook siapa pun
// ---------------------------------------------------------------
app.get('/api/admin/users', authenticate, requireOwner, (req, res) => {
  const { allUsers } = require('./db');
  const users = allUsers('SELECT id, email, name, role, created_at FROM users');
  res.json({ users });
});

app.delete('/api/admin/notebooks/:id', authenticate, requireOwner, (req, res) => {
  const { runMain, getMain } = require('./db');
  const nb = getMain('SELECT id FROM notebooks WHERE id = ? AND deleted_at IS NULL', [req.params.id]);
  if (!nb) return res.status(404).json({ error: 'Notebook tidak ditemukan' });
  runMain('UPDATE notebooks SET deleted_at = datetime("now") WHERE id = ?', [req.params.id]);
  runMain('UPDATE cells SET deleted_at = datetime("now") WHERE notebook_id = ?', [req.params.id]);
  res.json({ success: true });
});

const upload = multer({ dest: os.tmpdir(), limits: { fileSize: 120 * 1024 * 1024 } });

function safeVolumePath(root, reqPath) {
  const cleaned = String(reqPath || '').replace(/^\/+/, '');
  if (cleaned.includes('\0') || cleaned.split('/').includes('..')) throw new Error('Path tidak valid');
  const full = path.resolve(root, cleaned);
  if (full !== root && !full.startsWith(root + path.sep)) throw new Error('Path di luar notebook');
  return full;
}

function moveFile(src, dst) {
  try { fs.renameSync(src, dst); }
  catch (e) {
    if (e.code === 'EXDEV') {
      fs.copyFileSync(src, dst);
      fs.unlinkSync(src);
    } else throw e;
  }
}
// ---------------------------------------------------------------
// FILE SYSTEM (per notebook, disimpan di Podman named volume)
// ---------------------------------------------------------------
function volumeRoot(notebookId, userId, role) {
  const nb = getNotebook(notebookId, userId, role);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  return getNotebookVolumePath(notebookId);
}

// List isi folder
app.get('/api/notebooks/:id/files', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const sub = req.query.path || '';
    const dir = safeVolumePath(root, sub);
    const entries = fs.readdirSync(dir, { withFileTypes: true }).map(e => {
      const st = fs.statSync(path.join(dir, e.name));
      return {
        name: e.name,
        path: (sub ? sub.replace(/\/$/, '') + '/' : '') + e.name,
        isDir: e.isDirectory(),
        size: e.isDirectory() ? null : st.size,
        mtime: st.mtime.toISOString()
      };
    });
    entries.sort((a, b) => (a.isDir === b.isDir ? a.name.localeCompare(b.name) : (a.isDir ? -1 : 1)));
    res.json({ path: sub || '/', entries });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Upload file (max 120MB)
app.post('/api/notebooks/:id/files/upload', authenticate, requireNotebookPassword, upload.single('file'), (req, res) => {
  try {
    if (!req.file) throw new Error('File tidak ditemukan');
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const sub = req.body.path || '';
    const dir = safeVolumePath(root, sub);
    fs.mkdirSync(dir, { recursive: true });
    const dst = safeVolumePath(root, (sub ? sub.replace(/\/$/, '') + '/' : '') + req.file.originalname);
    moveFile(req.file.path, dst);
    res.json({ ok: true, name: req.file.originalname, path: (sub ? sub.replace(/\/$/, '') + '/' : '') + req.file.originalname, size: req.file.size });
  } catch (err) {
    if (req.file) try { fs.unlinkSync(req.file.path); } catch (e) {}
    res.status(400).json({ error: err.message });
  }
});

// Download file
app.get('/api/notebooks/:id/files/download', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const full = safeVolumePath(root, req.query.path);
    const st = fs.statSync(full);
    if (st.isDirectory()) throw new Error('Folder tidak bisa diunduh');
    res.download(full, path.basename(full));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buat folder
app.post('/api/notebooks/:id/files/mkdir', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const full = safeVolumePath(root, req.body.path);
    fs.mkdirSync(full, { recursive: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Buat file kosong
app.post('/api/notebooks/:id/files/create', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const full = safeVolumePath(root, req.body.path);
    fs.mkdirSync(path.dirname(full), { recursive: true });
    if (fs.existsSync(full)) throw new Error('File sudah ada');
    fs.writeFileSync(full, req.body.content || '');
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Rename / pindah
app.post('/api/notebooks/:id/files/rename', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const from = safeVolumePath(root, req.body.from);
    const to = safeVolumePath(root, req.body.to);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    if (fs.existsSync(to)) throw new Error('Tujuan sudah ada');
    fs.renameSync(from, to);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Hapus file / folder
app.delete('/api/notebooks/:id/files', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const full = safeVolumePath(root, req.query.path);
    if (full === root) throw new Error('Tidak bisa menghapus root');
    fs.rmSync(full, { recursive: true, force: true });
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Download semua file dalam folder sebagai zip
app.get('/api/notebooks/:id/files/download-all', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const sub = req.query.path || '';
    const dir = safeVolumePath(root, sub);
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="files.zip"`);
    const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
    archive.on('error', (e) => { if (!res.headersSent) res.status(500).end(); });
    archive.pipe(res);
    archive.directory(dir, false);
    archive.finalize();
  } catch (err) {
    if (!res.headersSent) res.status(400).json({ error: err.message });
  }
});

// Download file terpilih sebagai zip
app.post('/api/notebooks/:id/files/download-selected', authenticate, requireNotebookPassword, (req, res) => {
  try {
    const root = volumeRoot(req.params.id, req.user.id, req.user.role);
    const paths = Array.isArray(req.body.paths) ? req.body.paths : [];
    if (!paths.length) throw new Error('Tidak ada file dipilih');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="selected.zip"`);
    const archive = new archiver.ZipArchive({ zlib: { level: 9 } });
    archive.on('error', (e) => { if (!res.headersSent) res.status(500).end(); });
    archive.pipe(res);
    for (const p of paths) {
      const full = safeVolumePath(root, p);
      const st = fs.statSync(full);
      if (st.isDirectory()) archive.directory(full, path.basename(full));
      else archive.file(full, { name: path.basename(full) });
    }
    archive.finalize();
  } catch (err) {
    if (!res.headersSent) res.status(400).json({ error: err.message });
  }
});

// ---------------------------------------------------------------
// ROUTE SPA — setiap tampilan punya alamat (URL) sendiri.
//   /                            -> dashboard (daftar notebook)
//   /login                       -> layar masuk/daftar
//   /new                         -> dashboard + dialog tambah notebook
//   /notebook/<id-sesi>          -> notebook, tab Cell
//   /notebook/<id-sesi>/files    -> notebook, tab Files
//   /notebook/<id-sesi>/terminal -> notebook dengan terminal terbuka
// Server hanya mengirim index.html; app.js menentukan tampilan dari
// window.location.pathname (tanpa memuat ulang halaman).
// ---------------------------------------------------------------
app.get(['/login', '/new', '/notebook/:slug', '/notebook/:slug/:tab'], (req, res) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint API yang tidak dikenal tetap dibalas JSON (bukan HTML)
app.use('/api', (req, res) => res.status(404).json({ error: 'Endpoint tidak ditemukan' }));

// ---------------------------------------------------------------
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Token diperlukan'));
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, JWT_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Token tidak valid'));
  }
});

io.on('connection', (socket) => {
  const userId = socket.user.id;
  const role = socket.user.role;

  socket.on('notebook:join', ({ notebookId }) => {
    socket.join(notebookId);
    const { runMain } = require('./db');
    runMain('UPDATE notebooks SET last_opened_at = datetime("now") WHERE id = ?', [notebookId]);
  });

  socket.on('notebook:leave', ({ notebookId }) => {
    socket.leave(notebookId);
  });

  socket.on('cell:execute', async ({ cellId, notebookId, code, language, environment, memory, cpus, storage, keepAlive }) => {
    try {
      const result = await executeCell(io, {
        cellId, notebookId, code, language, environment,
        userId, role, memory, cpus, storage, keepAlive
      });
      socket.emit('cell:executed', result);
    } catch (err) {
      socket.emit('cell:error', { error: err.message });
    }
  });

  socket.on('terminal:start', ({ notebookId, image, environment }) => {
    try {
      startTerminal(notebookId, image, environment, userId, role, socket);
    } catch (err) {
      socket.emit('terminal:error', { message: err.message });
    }
  });

  socket.on('terminal:stop', ({ notebookId }) => {
    stopTerminal(notebookId, socket);
  });

  socket.on('session:message', ({ sessionId, message, type }) => {
    const data = sendSessionMessage(sessionId, userId, message, type);
    io.to(sessionId).emit('session:message', data);
  });

  socket.on('session:join', ({ sessionId }) => {
    socket.join(sessionId);
  });

  socket.on('disconnect', () => {
    // Terminal per socket menempel pada container per notebook;
    // container tetap hidup sesuai masa idle (dihentikan oleh cron/6 jam).
  });
});

// ---------------------------------------------------------------
// CRON: cleanup notebook temporary setiap 1 jam
// ---------------------------------------------------------------
setInterval(() => {
  try {
    const expired = cleanupExpiredNotebooks();
    for (const nb of expired) {
      // Buat notifikasi (simpan di memory atau bisa diperluas ke DB)
      console.log(`[CLEANUP] Notebook temporary dihapus: ${nb.name} (${nb.id})`);
    }
  } catch (e) {
    console.error('[CLEANUP] Error:', e.message);
  }
}, 60 * 60 * 1000);

// ---------------------------------------------------------------
// START SERVER
// ---------------------------------------------------------------
async function start() {
  await initDb();
  ensureZellyNetwork();

  server.listen(PORT, () => {
    console.log(`[ZELLY] Server berjalan di http://localhost:${PORT}`);
    console.log(`[ZELLY] Podman rootless: ${podmanAvailable() ? 'TERSEDIA' : 'TIDAK TERSEDIA'}`);
    console.log(`[ZELLY] Database users: ${process.env.DB_USERS_PATH || '/users.sqlite'}`);
    console.log(`[ZELLY] Database utama: ${process.env.DB_MAIN_PATH || '/zelly.sqlite'}`);
  });
}

start().catch((err) => {
  console.error('[ZELLY] Gagal memulai server:', err);
  process.exit(1);
});

// Save DB saat keluar
process.on('SIGINT', () => { saveDb(); process.exit(0); });
process.on('SIGTERM', () => { saveDb(); process.exit(0); });
