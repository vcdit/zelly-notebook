'use strict';

const { runMain, allMain, getMain } = require('./db');
const { runCell, ensureNotebookVolume, removeNotebookVolume, stopCellProcess } = require('./podman');
const { authenticate, canAccessNotebook } = require('./auth');

// Track running cells: cellId -> { notebookId, proc, stdinWriter }
const runningCells = new Map();

/* ============================================================
   EKSEKUSI CELL
   Tiap cell dijalankan dalam container Podman terpisah.
   - keep_alive = 1: container tetap hidup (volume dipasang, tidak --rm)
   - keep_alive = 0 / temporary: container --rm (dihapus setelah selesai)
   Output dikirim kembali via Socket.io (ditangani server.js).
   ============================================================ */

function executeCell(io, { cellId, notebookId, code, language, environment, userId, role, memory, cpus, storage, keepAlive }) {
  return new Promise(async (resolve, reject) => {
    const nb = getMain(`
      SELECT n.user_id, n.session_id, n.type, n.expires_at, n.keep_alive
      FROM notebooks n
      WHERE n.id = ? AND n.deleted_at IS NULL
    `, [notebookId]);
    if (!nb) return reject(new Error('Notebook tidak ditemukan'));
    if (!canAccessNotebook(userId, role, nb.user_id)) return reject(new Error('Tidak ada akses'));

    // Tandai cell running
    runMain('UPDATE cells SET status = ?, started_at = datetime("now") WHERE id = ?', ['running', cellId]);

    // Jika keep_alive, pastikan volume ada agar file tetap tersimpan
    const isKeepAlive = keepAlive || nb.keep_alive === 1;
    if (isKeepAlive) {
      ensureNotebookVolume(notebookId);
    }

    // Jalankan di container Podman (streaming: output dikirim bertahap)
    try {
      const result = await runCell({
        image: environment || 'python:3-slim',
        code,
        language,
        memory,
        cpus,
        storage,
        notebookId,
        keepAlive: isKeepAlive,
        timeoutMs: 300000,
        onChunk: (chunk, stream) => {
          io.to(notebookId).emit('cell:output', {
            cellId,
            notebookId,
            chunk,
            stream,
            // kirim juga output kumulatif agar client lama tetap jalan
            output: null
          });
        },
        onProc: (proc) => {
          // Track proses agar bisa di-stop
          runningCells.set(cellId, { notebookId, proc, userId });
          proc.on('close', () => runningCells.delete(cellId));
        },
        onStdinReady: (stdinWriter) => {
          const existing = runningCells.get(cellId);
          if (existing) existing.stdinWriter = stdinWriter;
        }
      });

      const status = result.error ? 'error' : 'completed';
      runMain(`
        UPDATE cells SET output = ?, status = ?, error_message = ?, finished_at = datetime("now")
        WHERE id = ?
      `, [result.output || null, status, result.error || null, cellId]);

      // Emit ke room notebook (shared session realtime) — final status
      io.to(notebookId).emit('cell:executed', {
        cellId,
        notebookId,
        output: result.output,
        error: result.error,
        status: result.status
      });

      resolve({ cellId, output: result.output, error: result.error, status: result.status });
    } catch (err) {
      runningCells.delete(cellId);
      const status = 'error';
      runMain(`
        UPDATE cells SET output = ?, status = ?, error_message = ?, finished_at = datetime("now")
        WHERE id = ?
      `, [null, status, err.message, cellId]);
      io.to(notebookId).emit('cell:executed', {
        cellId, notebookId, output: null, error: err.message, status
      });
      reject(err);
    }
  });
}

// Kirim stdin ke cell yang sedang berjalan (misal readline)
function sendStdin(cellId, userId, role, text) {
  const cell = getMain(`
    SELECT c.id, c.notebook_id, n.user_id FROM cells c
    JOIN notebooks n ON n.id = c.notebook_id
    WHERE c.id = ? AND n.deleted_at IS NULL
  `, [cellId]);
  if (!cell) throw new Error('Cell tidak ditemukan');
  if (!canAccessNotebook(userId, role, cell.user_id)) throw new Error('Tidak ada akses');

  const running = runningCells.get(cellId);
  if (!running || !running.stdinWriter) throw new Error('Cell tidak sedang menunggu input');

  running.stdinWriter.write(text + '\n');
  return { success: true };
}

// Stop cell yang sedang berjalan
function stopCell(cellId, userId, role) {
  const cell = getMain(`
    SELECT c.id, c.notebook_id, n.user_id FROM cells c
    JOIN notebooks n ON n.id = c.notebook_id
    WHERE c.id = ? AND n.deleted_at IS NULL
  `, [cellId]);
  if (!cell) throw new Error('Cell tidak ditemukan');
  if (!canAccessNotebook(userId, role, cell.user_id)) throw new Error('Tidak ada akses');

  const running = runningCells.get(cellId);
  if (running) {
    stopCellProcess(running.proc);
    runningCells.delete(cellId);
  }

  runMain(`
    UPDATE cells SET status = ?, error_message = ?, finished_at = datetime("now")
    WHERE id = ?
  `, ['error', 'Dihentikan oleh user', cellId]);

  return { success: true };
}

// Stop semua cell di notebook
function stopAllCells(notebookId, userId, role, io) {
  const nb = getMain('SELECT user_id FROM notebooks WHERE id = ? AND deleted_at IS NULL', [notebookId]);
  if (!nb) throw new Error('Notebook tidak ditemukan');
  if (!canAccessNotebook(userId, role, nb.user_id)) throw new Error('Tidak ada akses');

  for (const [cellId, running] of runningCells.entries()) {
    if (running.notebookId === notebookId) {
      stopCellProcess(running.proc);
      runningCells.delete(cellId);
      runMain(`
        UPDATE cells SET status = ?, error_message = ?, finished_at = datetime("now")
        WHERE id = ?
      `, ['error', 'Dihentikan oleh user', cellId]);
      if (io) io.to(notebookId).emit('cell:executed', {
        cellId, notebookId, output: null, error: 'Dihentikan oleh user', status: 'error'
      });
    }
  }

  return { success: true };
}

module.exports = { executeCell, sendStdin, stopCell, stopAllCells };
