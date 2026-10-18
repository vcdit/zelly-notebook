'use strict';

const { getMain } = require('./db');
const { canAccessNotebook } = require('./auth');
const {
  startTerminalContainer,
  stopTerminalContainer,
  execInContainer,
  terminalContainers
} = require('./podman');

/* ============================================================
   TERMINAL VIA PODMAN
   Model: per-baris. xterm.js mengirim karakter per karakter;
   backend menampung di buffer dan mengeksekusi saat Enter (\r).
   Container terminal per notebook: `podman run -d ... sleep infinity`
   lalu perintah dijalankan dengan `podman exec`.
   ============================================================ */

// Buffer input per socket (WeakMap: ter-opsi saat socket hilang)
const inputBuffers = new WeakMap();

function startTerminal(notebookId, image, environment, userId, role, socket) {
  const nb = getMain(`
    SELECT n.user_id, n.password_hash FROM notebooks n WHERE n.id = ? AND n.deleted_at IS NULL
  `, [notebookId]);
  if (!nb) {
    socket.emit('terminal:error', { message: 'Notebook tidak ditemukan' });
    return;
  }
  if (!canAccessNotebook(userId, role, nb.user_id)) {
    socket.emit('terminal:error', { message: 'Tidak ada akses' });
    return;
  }
  if (nb.password_hash) {
    socket.emit('terminal:error', { message: 'Notebook ini dilindungi password' });
    return;
  }

  // Container terminal per notebook (tetap hidup hingga 6 jam idle / ditutup)
  startTerminalContainer({ notebookId, image: image || environment || 'python' });

  inputBuffers.set(socket, '');
  socket.emit('terminal:ready', { notebookId, containerName: `zelly_term_${notebookId}` });

  socket.on(`terminal:input:${notebookId}`, (data) => {
    const text = (data && data.text) || '';
    let buf = inputBuffers.get(socket) || '';
    buf += text;

    // Proses per baris; sisanya ditunggu hingga Enter berikutnya
    while (buf.indexOf('\r') !== -1) {
      const idx = buf.indexOf('\r');
      const line = buf.slice(0, idx);
      buf = buf.slice(idx + 1);
      if (line.trim()) {
        runTerminalLine(socket, notebookId, line);
      } else {
        socket.emit(`terminal:output:${notebookId}`, { text: '' });
      }
    }
    inputBuffers.set(socket, buf);
  });

  socket.on('disconnect', () => {
    inputBuffers.delete(socket);
  });
}

// Eksekusi satu baris perintah, lalu kirim hasilnya
function runTerminalLine(socket, notebookId, line) {
  try {
    const { stdout, stderr } = execInContainer(notebookId, line, 30000);
    let payload = '';
    if (stdout) payload += stdout;
    if (stderr) payload += stderr + '\r\n';
    socket.emit(`terminal:output:${notebookId}`, { text: payload });
  } catch (err) {
    socket.emit(`terminal:error:${notebookId}`, { message: err.message });
  }
}

function stopTerminal(notebookId, socket) {
  stopTerminalContainer(notebookId);
  if (socket) socket.emit('terminal:stopped', { notebookId });
}

module.exports = {
  startTerminal,
  stopTerminal,
  terminalContainers
};
