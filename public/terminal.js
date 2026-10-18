/* ============================================================
   ZELLY TERMINAL (xterm.js + Socket.io + Podman)
   Backend berbasis per-baris: karakter di-echo lokal, Enter (\r)
   dikirim agar backend mengeksekusi baris via `podman exec`.
   catatan: variabel `term`, `socket`, `currentNotebookId`,
   `showToast`, `t` dibagikan dari public/app.js (scope global).
   ============================================================ */

function initTerminal() {
  // term dibagikan dari app.js — jangan dideklarasikan ulang di file ini
  if (term) return;

  // Pengaman: xterm gagal dimuat (misal file tidak tersaji)
  if (!window.Terminal) {
    document.getElementById('terminal-overlay').classList.add('hidden');
    if (typeof showToast === 'function') {
      showToast(t('toastError'), 'Terminal gagal dimuat — muat ulang halaman', 'error');
    }
    return;
  }

  term = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    fontFamily: '"JetBrains Mono", monospace',
    theme: { background: '#0f172a' }
  });

  term.open(document.getElementById('terminal-fit'));

  // Ukur terminal saat layar berubah (tanpa addon eksternal)
  const resizeTerminal = () => {
    if (!term) return;
    const el = term.element;
    if (!el) return;
    const box = el.parentElement;
    if (!box) return;
    const rows = Math.max(5, Math.floor(box.clientHeight / 17));
    const cols = Math.max(20, Math.floor(box.clientWidth / 8));
    term.resize(cols, rows);
  };
  resizeTerminal();
  window.addEventListener('resize', resizeTerminal);

  // Hindari tumpuk listener tiap terminal dibuka ulang
  socket.off(`terminal:output:${currentNotebookId}`);
  socket.off(`terminal:error:${currentNotebookId}`);
  socket.off('terminal:ready');
  socket.off('terminal:stopped');
  socket.off('terminal:error');

  socket.emit('terminal:start', {
    notebookId: currentNotebookId,
    image: 'python',
    environment: 'python'
  });

  // Pengingat bila server tak menjawab (podman lambat / image belum ada)
  const readyTimer = setTimeout(() => {
    if (term) term.write('\r\n[Zelly] Server belum merespons > 15s — cek `podman images` di server.\r\n');
  }, 15000);

  socket.on('terminal:ready', () => {
    clearTimeout(readyTimer);
    if (term) {
      term.write('\r\n[Zelly] Terminal terhubung ke container Podman.\r\n');
      term.write('[Zelly] Ketik perintah lalu tekan Enter.\r\n\r\n');
    }
  });

  socket.on(`terminal:output:${currentNotebookId}`, (data) => {
    if (term && data.text) {
      term.write(data.text.replace(/\r\n/g, '\n').replace(/\n/g, '\r\n'));
    }
  });

  socket.on(`terminal:error:${currentNotebookId}`, (data) => {
    if (term) term.write(`\r\n[ERROR] ${data.message}\r\n`);
  });

  socket.on('terminal:stopped', () => {
    if (term) term.write('\r\n[Zelly] Terminal ditutup.\r\n');
  });

  socket.on('terminal:error', (data) => {
    clearTimeout(readyTimer);
    if (term) term.write(`\r\n[ERROR] ${data.message}\r\n`);
  });

  // Local echo: tampilkan karakter langsung, Enter dikirim ke backend
  term.onData((data) => {
    if (!socket) return;
    if (data === '\r') {
      term.write('\r\n');
    } else if (data.charCodeAt(0) === 127) { // Backspace
      term.write('\b \b');
    } else {
      term.write(data);
    }
    socket.emit(`terminal:input:${currentNotebookId}`, { text: data });
  });

  // Tombol pintas HP
  document.querySelectorAll('.shortcut-btn').forEach(btn => {
    btn.onclick = () => {
      const key = btn.textContent.trim();
      if (term) {
        if (key === 'Ctrl') term.write('\x03'); // Ctrl+C
        else if (key === 'Alt') term.write('\x1b');
        else if (key === 'Tab') term.write('\t');
        else if (key === 'Esc') term.write('\x1b');
        else if (key === '↑') term.write('\x1b[A');
        else if (key === '↓') term.write('\x1b[B');
        else if (key === '←') term.write('\x1b[D');
        else if (key === '→') term.write('\x1b[C');
        else term.write(key);
        term.focus();
      }
    };
  });

  document.getElementById('terminal-container')
    .addEventListener('click', () => { if (term) term.focus(); });
}

window.initTerminal = initTerminal;

// Toggle terminal: selalu beri feedback, tidak bisa "diam mati" lagi
window.toggleTerminal = () => {
  const overlay = document.getElementById('terminal-overlay');
  if (!overlay) return;

  if (!overlay.classList.contains('hidden')) {
    // Tutup
    overlay.classList.add('hidden');
    if (term) { term.dispose(); term = null; }
    if (socket) socket.emit('terminal:stop', { notebookId: currentNotebookId });
    return;
  }

  // Buka — tapi hanya bila ada koneksi socket
  if (!socket) {
    if (typeof showToast === 'function') {
      showToast(t('toastError'), 'Koneksi belum siap — buka notebook dulu', 'error');
    }
    return;
  }

  overlay.classList.remove('hidden');
  if (!term) initTerminal();
};
