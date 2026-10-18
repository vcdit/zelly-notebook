'use strict';

const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DB_USERS_PATH = process.env.DB_USERS_PATH || '/users.sqlite';
const DB_MAIN_PATH = process.env.DB_MAIN_PATH || '/zelly.sqlite';

/* ============================================================
   sql.js (pure JavaScript SQLite, tidak perlu kompilasi native)
   ============================================================ */

let SQL = null;
let dbUsers = null;
let dbMain = null;
let initialized = false;

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  }
}

function loadOrCreate(dbPath) {
  ensureDir(dbPath);
  if (fs.existsSync(dbPath)) {
    const fileBytes = fs.readFileSync(dbPath);
    return new SQL.Database(fileBytes);
  }
  return new SQL.Database();
}

async function initDb() {
  if (initialized) return;
  SQL = await initSqlJs({
    // locate wasm binary
    locateFile: (file) => {
      return path.join(__dirname, 'node_modules', 'sql.js', 'dist', file);
    }
  });

  dbUsers = loadOrCreate(DB_USERS_PATH);
  dbMain = loadOrCreate(DB_MAIN_PATH);

  // WAL mode + foreign keys
  dbUsers.exec('PRAGMA journal_mode = WAL;');
  dbUsers.exec('PRAGMA foreign_keys = ON;');
  dbMain.exec('PRAGMA journal_mode = WAL;');
  dbMain.exec('PRAGMA foreign_keys = ON;');

  // -----------------------------------------------------------
  // Tabel users (di root server, path default /users.sqlite)
  // -----------------------------------------------------------
  dbUsers.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      role TEXT DEFAULT 'member' CHECK(role IN ('owner','member')),
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  // -----------------------------------------------------------
  // Tabel utama (di root server, path default /zelly.sqlite)
  // -----------------------------------------------------------
  dbMain.exec(`
    CREATE TABLE IF NOT EXISTS notebooks (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL,
      name TEXT NOT NULL DEFAULT 'Notebook Baru',
      environment TEXT NOT NULL DEFAULT 'python',
      session_id TEXT NOT NULL DEFAULT '',
      type TEXT NOT NULL DEFAULT 'long-lasting' CHECK(type IN ('long-lasting','temporary')),
      expires_at TEXT,
      max_ram TEXT,
      max_storage TEXT,
      max_cpu TEXT,
      keep_alive INTEGER DEFAULT 0,
      last_opened_at TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS cells (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      notebook_id TEXT NOT NULL,
      code TEXT NOT NULL DEFAULT '',
      language TEXT,
      output TEXT,
      status TEXT DEFAULT 'idle' CHECK(status IN ('idle','running','completed','error')),
      order_index INTEGER DEFAULT 0,
      started_at TEXT,
      finished_at TEXT,
      error_message TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      deleted_at TEXT
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      last_activity TEXT DEFAULT (datetime('now')),
      created_at TEXT DEFAULT (datetime('now')),
      expires_at TEXT
    );

    CREATE TABLE IF NOT EXISTS resources (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      session_id TEXT NOT NULL,
      uploaded_by TEXT NOT NULL,
      filename TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_size INTEGER DEFAULT 0,
      uploaded_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      user_id TEXT NOT NULL,
      notebook_id TEXT,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info' CHECK(type IN ('info','warning','error','success')),
      created_at TEXT DEFAULT (datetime('now')),
      read_at TEXT
    );
  `);

  dbMain.exec(`
    CREATE INDEX IF NOT EXISTS idx_notebooks_user_id ON notebooks(user_id);
    CREATE INDEX IF NOT EXISTS idx_notebooks_session_id ON notebooks(session_id);
    CREATE INDEX IF NOT EXISTS idx_cells_notebook_id ON cells(notebook_id);
    CREATE INDEX IF NOT EXISTS idx_cells_order ON cells(notebook_id, order_index);
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
  `);

  // Migrasi: tambah kolom password_hash jika belum ada (Fase 2.5)
  const nbCols = dbMain.exec('PRAGMA table_info(notebooks)')[0].values.map(r => r[1]);
  if (!nbCols.includes('password_hash')) {
    dbMain.exec('ALTER TABLE notebooks ADD COLUMN password_hash TEXT');
  }

  initialized = true;
  console.log('[DB] SQLite (sql.js) diinisialisasi');
}

// ---------------------------------------------------------------
// Simpan database ke file (panggil saat shutdown atau periodik)
// ---------------------------------------------------------------
function saveDb() {
  if (!initialized) return;
  try {
    fs.writeFileSync(DB_USERS_PATH, Buffer.from(dbUsers.export()));
    fs.writeFileSync(DB_MAIN_PATH, Buffer.from(dbMain.export()));
  } catch (e) {
    console.error('[DB] Gagal menyimpan:', e.message);
  }
}

// Auto-save setiap 30 detik
setInterval(saveDb, 30000);

// Simpan saat proses keluar
process.on('exit', saveDb);
process.on('SIGINT', () => { saveDb(); process.exit(0); });
process.on('SIGTERM', () => { saveDb(); process.exit(0); });

// ---------------------------------------------------------------
// Query helpers (sql.js style)
// ---------------------------------------------------------------

function runUsers(sql, params = []) {
  const stmt = dbUsers.prepare(sql);
  const result = stmt.run(params);
  stmt.free();
  return result;
}

function allUsers(sql, params = []) {
  const stmt = dbUsers.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function getUsers(sql, params = []) {
  const stmt = dbUsers.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) result = stmt.getAsObject();
  stmt.free();
  return result;
}

function runMain(sql, params = []) {
  const stmt = dbMain.prepare(sql);
  const result = stmt.run(params);
  stmt.free();
  return result;
}

function createNotification({ userId, notebookId, message, type = 'info' }) {
  return runMain(`
    INSERT INTO notifications (user_id, notebook_id, message, type)
    VALUES (?, ?, ?, ?)
  `, [userId, notebookId || null, message, type]);
}

function allMain(sql, params = []) {
  const stmt = dbMain.prepare(sql);
  stmt.bind(params);
  const results = [];
  while (stmt.step()) results.push(stmt.getAsObject());
  stmt.free();
  return results;
}

function getMain(sql, params = []) {
  const stmt = dbMain.prepare(sql);
  stmt.bind(params);
  let result = null;
  if (stmt.step()) result = stmt.getAsObject();
  stmt.free();
  return result;
}

module.exports = {
  initDb,
  saveDb,
  dbUsers,
  dbMain,
  initialized: () => initialized,
  runUsers, allUsers, getUsers,
  runMain, allMain, getMain,
  createNotification,
  DB_USERS_PATH,
  DB_MAIN_PATH
};
