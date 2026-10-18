'use strict';

const {
  runMain, allMain, getMain,
  runUsers, allUsers, getUsers, createNotification
} = require('./db');
const { canAccessNotebook } = require('./auth');

/* ============================================================
   SHARED SESSION (dari session.js — digabung untuk efisiensi file)
   Notebook dengan session_id sama saling tersambung.
   ============================================================ */

function createSession(sessionId, expiresAt) {
  runMain('INSERT OR IGNORE INTO sessions (id, expires_at) VALUES (?, ?)', [sessionId, expiresAt || null]);
}

function getNotebooksInSession(sessionId, userId, role) {
  const notebooks = allMain('SELECT id, name, environment, user_id FROM notebooks WHERE session_id = ? AND deleted_at IS NULL', [sessionId]);
  const result = [];
  for (const nb of notebooks) {
    if (role !== 'owner' && nb.user_id !== userId) continue;
    const owner = getUsers('SELECT email, name FROM users WHERE id = ?', [nb.user_id]);
    result.push({ ...nb, owner_email: owner ? owner.email : null, owner_name: owner ? owner.name : null });
  }
  return result;
}

function sendSessionMessage(sessionId, fromUserId, message, type = 'text') {
  runMain('INSERT INTO resources (session_id, uploaded_by, filename, file_path, file_size) VALUES (?, ?, ?, ?, ?)',
    [sessionId, fromUserId, `message_${Date.now()}`, `text:${message}`, Buffer.byteLength(message)]);
  const notebooks = getNotebooksInSession(sessionId, fromUserId, 'owner');
  for (const nb of notebooks) {
    if (nb.user_id !== fromUserId) {
      createNotification({ userId: nb.user_id, notebookId: nb.id, message: `Pesan baru dalam sesi ${sessionId}: ${message.substring(0, 50)}...`, type: 'info' });
    }
  }
  const rowId = getMain('SELECT last_insert_rowid() AS rowid');
  return { id: rowId?.rowid, sessionId, fromUserId, message, type, createdAt: new Date().toISOString() };
}

function getSessionResources(sessionId, userId, role) {
  const resources = allMain('SELECT * FROM resources WHERE session_id = ? ORDER BY uploaded_at DESC', [sessionId]);
  const result = [];
  for (const r of resources) {
    const uploader = getUsers('SELECT email, name FROM users WHERE id = ?', [r.uploaded_by]);
    result.push({ ...r, uploaded_by_email: uploader ? uploader.email : null, uploaded_by_name: uploader ? uploader.name : null });
  }
  return result;
}

/* ============================================================
   NOTEBOOK CRUD
   ============================================================ */

function listNotebooks(userId, role) {
  let notebooks;
  if (role === 'owner') {
    notebooks = allMain(`
      SELECT * FROM notebooks WHERE deleted_at IS NULL ORDER BY updated_at DESC
    `);
  } else {
    notebooks = allMain(`
      SELECT * FROM notebooks WHERE user_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC
    `, [userId]);
  }

  // Lengkapi info pemilik dari database users (terpisah)
  const result = [];
  for (const nb of notebooks) {
    const owner = getUsers('SELECT email, name FROM users WHERE id = ?', [nb.user_id]);
    result.push({
      ...nb,
      owner_email: owner ? owner.email : null,
      owner_name: owner ? owner.name : null
    });
  }
  return result;
}

function getNotebook(notebookId, userId, role) {
  const nb = getMain('SELECT * FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) return null;

  if (!canAccessNotebook(userId, role, nb.user_id)) return null;

  const owner = getUsers('SELECT email, name FROM users WHERE id = ?', [nb.user_id]);
  return {
    ...nb,
    owner_email: owner ? owner.email : null,
    owner_name: owner ? owner.name : null
  };
}

function createNotebook({ userId, name, environment, sessionId, type, expiresAt, durationDays, maxRam, maxStorage, maxCpu, keepAlive }) {
  // Temporary: hitung masa aktif (3 hari s/d 2 minggu, default 7 hari)
  let expiry = expiresAt;
  if (type === 'temporary' && !expiry) {
    const days = Math.min(Math.max(parseInt(durationDays, 10) || 7, 3), 14);
    expiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();
  }

  runMain(`
    INSERT INTO notebooks (user_id, name, environment, session_id, type, expires_at, max_ram, max_storage, max_cpu, keep_alive)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `, [userId, name, environment, sessionId, type, expiry || null, maxRam || null, maxStorage || null, maxCpu || null, keepAlive ? 1 : 0]);

  const rowIdResult = getMain('SELECT last_insert_rowid() AS rowid');
  const rowId = rowIdResult ? rowIdResult.rowid : null;
  return getMain('SELECT * FROM notebooks WHERE rowid = ?', [rowId]);
}

function updateNotebook(notebookId, userId, role, fields) {
  const nb = getMain('SELECT user_id FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');

  const allowed = ['name', 'environment', 'session_id', 'type', 'expires_at', 'max_ram', 'max_storage', 'max_cpu', 'keep_alive'];
  const sets = [];
  const values = [];

  for (const [key, val] of Object.entries(fields)) {
    if (allowed.includes(key)) {
      sets.push(`${key} = ?`);
      // sql.js tidak menerima boolean: koersi ke integer
      values.push(key === 'keep_alive' ? (val ? 1 : 0) : val);
    }
  }

  if (sets.length === 0) throw new Error('Tidak ada field yang diupdate');
  sets.push('updated_at = datetime("now")');
  values.push(notebookId);

  runMain(`UPDATE notebooks SET ${sets.join(', ')} WHERE id = ?`, values);
  return getMain('SELECT * FROM notebooks WHERE id = ?', [notebookId]);
}

function deleteNotebook(notebookId, userId, role) {
  const nb = getMain('SELECT user_id FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');

  // Soft delete
  runMain('UPDATE notebooks SET deleted_at = datetime("now") WHERE id = ?', [notebookId]);
  // Hapus cell terkait
  runMain('UPDATE cells SET deleted_at = datetime("now") WHERE notebook_id = ?', [notebookId]);
  return { success: true };
}

function duplicateNotebook(notebookId, userId, role) {
  const nb = getMain('SELECT * FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');

  // Buat notebook baru dengan nama + " (copy)"
  const newNb = createNotebook({
    userId,
    name: nb.name + ' (copy)',
    environment: nb.environment,
    sessionId: '',
    type: nb.type,
    expiresAt: nb.expires_at,
    durationDays: null,
    maxRam: nb.max_ram,
    maxStorage: nb.max_storage,
    maxCpu: nb.max_cpu,
    keepAlive: nb.keep_alive
  });

  // Salin semua cell
  const cells = allMain('SELECT * FROM cells WHERE notebook_id = ? ORDER BY order_index ASC', [notebookId]);
  for (const cell of cells) {
    createCell(newNb.id, userId, role, {
      code: cell.code,
      language: cell.language,
      orderIndex: cell.order_index
    });
  }

  return newNb;
}

function moveCell(cellId, userId, role, direction) {
  const cell = getMain(`
    SELECT c.id, c.notebook_id, c.order_index, n.user_id FROM cells c
    JOIN notebooks n ON n.id = c.notebook_id
    WHERE c.id = ? AND n.deleted_at IS NULL AND c.deleted_at IS NULL
  `, [cellId]);
  if (!cell) throw new Error('Cell tidak ditemukan');
  if (!canAccessNotebook(userId, role, cell.user_id)) throw new Error('Tidak ada akses');

  const newIndex = cell.order_index + direction;
  if (newIndex < 0) throw new Error('Cell sudah di posisi paling atas');

  // Cek ada cell di posisi tujuan
  const target = getMain(
    'SELECT id FROM cells WHERE notebook_id = ? AND order_index = ? AND deleted_at IS NULL',
    [cell.notebook_id, newIndex]
  );
  if (!target) throw new Error('Cell sudah di posisi paling bawah');

  // Swap order_index
  runMain('UPDATE cells SET order_index = ? WHERE id = ?', [cell.order_index, target.id]);
  runMain('UPDATE cells SET order_index = ? WHERE id = ?', [newIndex, cell.id]);

  return { success: true };
}

function duplicateCell(cellId, userId, role) {
  const cell = getMain(`
    SELECT c.id, c.notebook_id, c.code, c.language, c.order_index, n.user_id FROM cells c
    JOIN notebooks n ON n.id = c.notebook_id
    WHERE c.id = ? AND n.deleted_at IS NULL AND c.deleted_at IS NULL
  `, [cellId]);
  if (!cell) throw new Error('Cell tidak ditemukan');
  if (!canAccessNotebook(userId, role, cell.user_id)) throw new Error('Tidak ada akses');

  // Geser semua cell di bawah ke bawah
  runMain(
    'UPDATE cells SET order_index = order_index + 1 WHERE notebook_id = ? AND order_index >= ? AND deleted_at IS NULL',
    [cell.notebook_id, cell.order_index + 1]
  );

  // Buat cell baru di posisi yang sama
  const newCell = createCell(cell.notebook_id, userId, role, {
    code: cell.code,
    language: cell.language,
    orderIndex: cell.order_index + 1
  });

  return newCell;
}

function deleteCell(cellId, userId, role) {
  const cell = getMain(`
    SELECT c.id, c.notebook_id, n.user_id FROM cells c
    JOIN notebooks n ON n.id = c.notebook_id
    WHERE c.id = ? AND n.deleted_at IS NULL AND c.deleted_at IS NULL
  `, [cellId]);
  if (!cell) throw new Error('Cell tidak ditemukan');
  if (!canAccessNotebook(userId, role, cell.user_id)) throw new Error('Tidak ada akses');

  runMain('UPDATE cells SET deleted_at = datetime("now") WHERE id = ?', [cellId]);
  return { success: true };
}

function setNotebookPassword(notebookId, userId, role, password) {
  const nb = getMain('SELECT user_id FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');

  const bcrypt = require('bcryptjs');
  const hash = password ? bcrypt.hashSync(password, 10) : null;
  runMain('UPDATE notebooks SET password_hash = ? WHERE id = ?', [hash, notebookId]);
  return { success: true, hasPassword: !!hash };
}

function verifyNotebookPassword(notebookId, password) {
  const nb = getMain('SELECT password_hash FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) return { valid: false, error: 'Notebook tidak ditemukan' };
  if (!nb.password_hash) return { valid: true }; // tidak ada password
  if (!password) return { valid: false, error: 'Password diperlukan' };
  const bcrypt = require('bcryptjs');
  return { valid: bcrypt.compareSync(password, nb.password_hash) };
}

function getNotebookPasswordStatus(notebookId, userId, role) {
  const nb = getMain('SELECT user_id, password_hash FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');
  return { hasPassword: !!nb.password_hash };
}

/* ============================================================
   CELLS
   ============================================================ */

function listCells(notebookId, userId, role) {
  const nb = getMain('SELECT user_id FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');

  return allMain(`
    SELECT * FROM cells WHERE notebook_id = ? ORDER BY order_index ASC
  `, [notebookId]);
}

function createCell(notebookId, userId, role, { code, language, orderIndex }) {
  const nb = getMain('SELECT user_id FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');

  runMain(`
    INSERT INTO cells (notebook_id, code, language, order_index)
    VALUES (?, ?, ?, ?)
  `, [notebookId, code || '', language || null, orderIndex || 0]);

  const rowIdResult = getMain('SELECT last_insert_rowid() AS rowid');
  const rowId = rowIdResult ? rowIdResult.rowid : null;
  return getMain('SELECT * FROM cells WHERE rowid = ?', [rowId]);
}

function updateCellOutput(cellId, userId, role, { output, status, errorMessage }) {
  // Ambil user_id PEMILIK notebook (bukan id notebook!) untuk cek akses
  const cell = getMain(`
    SELECT c.notebook_id, n.user_id FROM cells c
    JOIN notebooks n ON n.id = c.notebook_id
    WHERE c.id = ? AND n.deleted_at IS NULL
  `, [cellId]);
  if (!cell) throw new Error('Cell tidak ditemukan');
  if (!canAccessNotebook(userId, role, cell.user_id)) throw new Error('Tidak ada akses');

  runMain(`
    UPDATE cells SET output = ?, status = ?, error_message = ?, finished_at = datetime("now")
    WHERE id = ?
  `, [output || null, status || 'completed', errorMessage || null, cellId]);
}

// Update kode/language/order cell
function updateCellCode(cellId, userId, role, { code, language, orderIndex }) {
  // Ambil user_id PEMILIK notebook (bukan id notebook!) untuk cek akses
  const cell = getMain(`
    SELECT c.id, c.notebook_id, n.user_id FROM cells c
    JOIN notebooks n ON n.id = c.notebook_id
    WHERE c.id = ? AND n.deleted_at IS NULL
  `, [cellId]);
  if (!cell) throw new Error('Cell tidak ditemukan');
  if (!canAccessNotebook(userId, role, cell.user_id)) throw new Error('Tidak ada akses');

  const sets = [];
  const values = [];
  if (code !== undefined) { sets.push('code = ?'); values.push(code); }
  if (language !== undefined) { sets.push('language = ?'); values.push(language); }
  if (orderIndex !== undefined) { sets.push('order_index = ?'); values.push(orderIndex); }
  if (sets.length === 0) return getMain('SELECT * FROM cells WHERE id = ?', [cellId]);

  values.push(cellId);
  runMain(`UPDATE cells SET ${sets.join(', ')} WHERE id = ?`, values);
  return getMain('SELECT * FROM cells WHERE id = ?', [cellId]);
}

module.exports = {
  listNotebooks,
  getNotebook,
  createNotebook,
  updateNotebook,
  deleteNotebook,
  duplicateNotebook,
  listCells,
  createCell,
  updateCellCode,
  updateCellOutput,
  moveCell,
  duplicateCell,
  deleteCell,
  setNotebookPassword,
  verifyNotebookPassword,
  getNotebookPasswordStatus,
  createSession,
  getNotebooksInSession,
  sendSessionMessage,
  getSessionResources
};
