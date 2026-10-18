'use strict';

const { execSync, execFileSync, spawn } = require('child_process');
const { runMain, allMain, getMain } = require('./db');

/* ============================================================
   PODMAN ROOTLESS WRAPPER
   Semua perintah dijalankan sebagai user non-root (rootless).
   ============================================================ */

let podmanCache = null;
let podmanCacheTime = 0;
const PODMAN_CACHE_TTL = 30000; // 30 detik

function podmanAvailable() {
  try {
    execSync('podman --version', { stdio: 'pipe' });
    return true;
  } catch (e) {
    return false;
  }
}

function podmanSocket() {
  return process.env.PODMAN_SOCKET || `/run/user/${process.getuid()}/podman/podman.sock`;
}

// Env untuk perintah podman.
// CONTAINER_HOST hanya diset bila socket benar-benar ada — jika tidak,
// podman dipanggil langsung (root / rootless lokal) agar tidak error schema.
function podmanEnv() {
  if (process.env.PODMAN_SOCKET) {
    let host = process.env.PODMAN_SOCKET;
    if (!/^unix:\/\//.test(host)) host = `unix://${host}`;
    return { ...process.env, CONTAINER_HOST: host };
  }
  try {
    const st = require('fs').statSync(podmanSocket());
    if (st.isSocket()) {
      return { ...process.env, CONTAINER_HOST: `unix://${podmanSocket()}` };
    }
  } catch (e) {
    // socket tidak ada -> pakai env default
  }
  return { ...process.env };
}

// Daftar image yang tersedia (dari podman images) -> dropdown environment
function listAvailableImages() {
  if (!podmanAvailable()) return [];
  const now = Date.now();
  if (podmanCache && now - podmanCacheTime < PODMAN_CACHE_TTL) return podmanCache;
  try {
    const out = execFileSync('podman', ['images', '--format', '{{.Repository}}:{{.Tag}}'], {
      encoding: 'utf8',
      env: { ...process.env, ...podmanEnv() }
    });
    const imgs = out.trim().split('\n').filter(Boolean).filter(i => i !== '<none>:<none>');
    podmanCache = imgs;
    podmanCacheTime = now;
    return imgs;
  } catch (e) {
    return [];
  }
}

// Pemetaan nama environment -> image Podman yang tersedia.
// contoh: 'python' -> 'docker.io/library/python:3-slim' (bila image telah di-pull)
function resolveImage(envName) {
  let imgs = [];
  try { imgs = listAvailableImages(); } catch (e) { imgs = []; }

  // 1. Cocok persis
  if (imgs.includes(envName)) return envName;

  const base = String(envName || '').toLowerCase();
  // 2. Cocok nama repo (abaikan tag/registry)
  for (const img of imgs) {
    const repo = img.split(':')[0];
    if (repo === base || repo.endsWith(`/${base}`)) return img;
  }
  // 3. Peta default yang umum
  const fallback = { python: 'python:3-slim', python3: 'python:3-slim', nodejs: 'node:20-slim', node: 'node:20-slim', 'node.js': 'node:20-slim' };
  if (fallback[base]) return fallback[base];
  // 4. Sudah berbentuk image atau tambahkan tag latest
  return base.includes(':') ? base : `${base}:latest`;
}

// Build argumen podman run
function buildRunArgs({ image, command = [], envVars = {}, memory, cpus, storage, network = 'zelly-net', name, detach = false, rm = true, volumeName = null, workdir = null }) {
  const args = ['run'];
  if (detach) args.push('-d');
  if (rm) args.push('--rm');
  // -i: sambungkan stdin (diperlukan untuk mengirim kode cell via pipe)
  if (!detach) args.push('-i');

  // Mount volume per notebook sebagai working dir (file yang diupload terlihat di sini)
  if (volumeName) {
    args.push('-v', `${volumeName}:/workspace`);
    args.push('--workdir', workdir || '/workspace');
  }

  if (name) args.push('--name', name);

  args.push('--user', '1000:1000');
  if (memory) args.push('--memory', memory);
  if (cpus) args.push('--cpus', cpus);
  if (storage) args.push('--storage-opt', `size=${storage}`);
  args.push('--network', network);

  for (const [k, v] of Object.entries(envVars)) {
    args.push('--env', `${k}=${v}`);
  }

  args.push(image);
  if (command.length) args.push(...command);
  return args;
}

/* ============================================================
   EKSEKUSI CELL (one-off, --rm)
   ============================================================ */

function runCell({ image, code, language, memory, cpus, storage, timeoutMs = 300000, notebookId = null, keepAlive = false, onChunk = null, onProc = null, onStdinReady = null }) {
  if (!podmanAvailable()) {
    throw new Error('Podman tidak tersedia di server');
  }

  // Volume per notebook: file yang diupload terlihat di /workspace
  if (notebookId) ensureNotebookVolume(notebookId);
  const volumeName = notebookId ? `zelly_nb_${notebookId}` : null;

  // Resolusikan nama environment menjadi image aktual yang tersedia
  const img = resolveImage(image);

  let fileName = 'script';
  let wrapper;
  if (language === 'python' || img.includes('python')) {
    fileName = 'script.py';
    wrapper = `cat > /tmp/${fileName} && python /tmp/${fileName}`;
  } else if (language === 'nodejs' || language === 'node' || img.includes('node')) {
    fileName = 'script.js';
    wrapper = `cat > /tmp/${fileName} && node /tmp/${fileName}`;
  } else if (language === 'bash' || language === 'sh' || img.includes('bash')) {
    fileName = 'script.sh';
    wrapper = `cat > /tmp/${fileName} && bash /tmp/${fileName}`;
  } else {
    const args = buildRunArgs({ image: img, command: ['sh', '-c', code], memory, cpus, storage, volumeName, rm: !keepAlive });
    return _runRawStreaming(args, code, timeoutMs, onChunk, onProc, onStdinReady);
  }

  const args = buildRunArgs({ image: img, command: ['sh', '-c', wrapper], memory, cpus, storage, volumeName, rm: !keepAlive });

  return new Promise((resolve) => {
    const { spawn } = require('child_process');
    const proc = spawn('podman', args, {
      env: { ...process.env, ...podmanEnv() },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    if (onProc) onProc(proc);
    if (onStdinReady) onStdinReady(proc.stdin);

    let stdout = '';
    let stderr = '';
    let finished = false;

    const finish = (code) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      const status = (code !== 0 || stderr.trim()) ? 'error' : 'completed';
      resolve({ output: stdout, error: stderr.trim() || (code !== 0 ? `exit code ${code}` : null), status });
    };

    const timer = setTimeout(() => {
      try { proc.kill('SIGKILL'); } catch (e) {}
      finish(124);
    }, timeoutMs);

    proc.stdout.on('data', (chunk) => {
      const t = chunk.toString();
      stdout += t;
      if (onChunk) onChunk(t, 'stdout');
    });
    proc.stderr.on('data', (chunk) => {
      const t = chunk.toString();
      stderr += t;
      if (onChunk) onChunk(t, 'stderr');
    });
    proc.on('error', (err) => {
      stderr += err.message;
      finish(1);
    });
    proc.on('close', (code) => finish(code));

    try { proc.stdin.write(code); } catch (e) {}
    // Jangan end stdin jika ada onStdinReady (interactive mode)
    if (!onStdinReady) {
      try { proc.stdin.end(); } catch (e) {}
    }
  });
}

function _runRawStreaming(args, code, timeoutMs, onChunk, onProc, onStdinReady) {
  const { spawn } = require('child_process');
  return new Promise((resolve) => {
    const proc = spawn('podman', args, {
      env: { ...process.env, ...podmanEnv() },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    if (onProc) onProc(proc);
    if (onStdinReady) onStdinReady(proc.stdin);

    let stdout = '', stderr = '', finished = false;
    const finish = (code) => {
      if (finished) return; finished = true; clearTimeout(timer);
      resolve({ output: stdout, error: stderr.trim() || (code !== 0 ? `exit ${code}` : null), status: (code !== 0 || stderr.trim()) ? 'error' : 'completed' });
    };
    const timer = setTimeout(() => { try { proc.kill('SIGKILL'); } catch(e){} finish(124); }, timeoutMs);
    proc.stdout.on('data', c => { const t=c.toString(); stdout+=t; if(onChunk) onChunk(t,'stdout'); });
    proc.stderr.on('data', c => { const t=c.toString(); stderr+=t; if(onChunk) onChunk(t,'stderr'); });
    proc.on('error', e => { stderr += e.message; finish(1); });
    proc.on('close', c => finish(c));
    try { proc.stdin.write(code); } catch(e){}
    if (!onStdinReady) { try { proc.stdin.end(); } catch(e){} }
  });
}

// Stop proses Podman yang sedang berjalan
function stopCellProcess(proc) {
  if (!proc) return;
  try {
    // Kirim SIGINT ke proses podman
    proc.kill('SIGINT');
    // Tunggu 3 detik, lalu SIGKILL jika masih hidup
    setTimeout(() => {
      try {
        if (proc.exitCode === null && !proc.killed) {
          proc.kill('SIGKILL');
        }
      } catch (e) { /* abaikan */ }
    }, 3000);
  } catch (e) { /* abaikan */ }
}

function _runRaw({ image, command, memory, cpus, storage, timeoutMs }) {
  const args = buildRunArgs({ image, command, memory, cpus, storage });
  try {
    const result = execFileSync('podman', args, {
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, ...podmanEnv() }
    });
    return { output: result, error: null };
  } catch (err) {
    const stdout = err.stdout ? err.stdout.toString() : '';
    const stderr = err.stderr ? err.stderr.toString() : '';
    return { output: stdout, error: stderr || err.message };
  }
}

/* ============================================================
   VOLUME per notebook (file tetap ada meski container restart)
   ============================================================ */

// Ambil mountpoint volume notebook (untuk akses file langsung dari host)
function getNotebookVolumePath(notebookId) {
  ensureNotebookVolume(notebookId);
  const volumeName = `zelly_nb_${notebookId}`;
  try {
    const out = execFileSync('podman', ['volume', 'inspect', '--format', '{{.Mountpoint}}', volumeName], {
      encoding: 'utf8',
      env: { ...process.env, ...podmanEnv() }
    });
    return out.trim();
  } catch (e) {
    throw new Error(`Volume ${volumeName} tidak ditemukan: ${e.message}`);
  }
}

function ensureNotebookVolume(notebookId) {
  const volumeName = `zelly_nb_${notebookId}`;
  try {
    execFileSync('podman', ['volume', 'create', volumeName], {
      stdio: 'pipe',
      env: { ...process.env, ...podmanEnv() }
    });
  } catch (e) {
    // sudah ada
  }
  return volumeName;
}

function removeNotebookVolume(notebookId) {
  const volumeName = `zelly_nb_${notebookId}`;
  try {
    execFileSync('podman', ['volume', 'rm', volumeName], {
      stdio: 'pipe',
      env: { ...process.env, ...podmanEnv() }
    });
  } catch (e) {
    // abaikan
  }
}

/* ============================================================
   NETWORK (hanya ke API Zelly)
   ============================================================ */

function ensureZellyNetwork() {
  if (!podmanAvailable()) return;
  try {
    execFileSync('podman', ['network', 'exists', 'zelly-net'], {
      stdio: 'pipe',
      env: { ...process.env, ...podmanEnv() }
    });
  } catch (e) {
    try {
      execFileSync('podman', ['network', 'create', 'zelly-net'], {
        stdio: 'pipe',
        env: { ...process.env, ...podmanEnv() }
      });
    } catch (e2) {
      // abaikan
    }
  }
}

/* ============================================================
   CONTAINER TERMINAL (persistent, PTY)
   ============================================================ */

// Track container terminal aktif: notebookId -> { containerName, image, proc }
const terminalContainers = new Map();

function startTerminalContainer({ notebookId, image = 'python:3-slim' }) {
  if (terminalContainers.has(notebookId)) return terminalContainers.get(notebookId);

  const img = resolveImage(image);
  const containerName = `zelly_term_${notebookId}`;

  // Buat container detached, tanpa --rm, tetap hidup
  try {
    execFileSync('podman', ['rm', '-f', containerName], {
      stdio: 'pipe',
      env: { ...process.env, ...podmanEnv() }
    });
  } catch (e) {
    // abaikan jika belum ada
  }

  try {
    execFileSync('podman', [
      'run', '-d', '--name', containerName,
      '--user', '1000:1000',
      '--network', 'zelly-net',
      img,
      'sleep', 'infinity'
    ], {
      stdio: 'pipe',
      env: { ...process.env, ...podmanEnv() }
    });
  } catch (e) {
    // Lempar pesan berbahasa Indonesia, ditangani caller untuk emit terminal:error
    throw new Error(`Gagal membuat container terminal: ${e.message}`);
  }

  terminalContainers.set(notebookId, { containerName, image: img });
  return terminalContainers.get(notebookId);
}

function stopTerminalContainer(notebookId) {
  const info = terminalContainers.get(notebookId);
  if (!info) return;
  try {
    execFileSync('podman', ['stop', info.containerName], {
      stdio: 'pipe',
      env: { ...process.env, ...podmanEnv() }
    });
    execFileSync('podman', ['rm', '-f', info.containerName], {
      stdio: 'pipe',
      env: { ...process.env, ...podmanEnv() }
    });
  } catch (e) {
    // abaikan
  }
  terminalContainers.delete(notebookId);
}

// Jalankan perintah di dalam container terminal (`podman exec`)
function execInContainer(notebookId, command, timeoutMs = 30000) {
  const info = terminalContainers.get(notebookId);
  if (!info) throw new Error('Terminal container tidak aktif');

  try {
    const out = execFileSync('podman', ['exec', info.containerName, 'sh', '-c', command], {
      encoding: 'utf8',
      timeout: timeoutMs,
      maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, ...podmanEnv() }
    });
    return { stdout: out, stderr: null };
  } catch (err) {
    return {
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: (err.stderr ? err.stderr.toString() : '') || err.message
    };
  }
}

/* ============================================================
   CLEANUP notebook temporary (dipanggil oleh server.js cron)
   ============================================================ */

function cleanupExpiredNotebooks() {
  const { createNotification } = require('./db');
  const now = new Date().toISOString();
  const expired = allMain(`
    SELECT id, user_id, name, type FROM notebooks
    WHERE type = 'temporary' AND deleted_at IS NULL AND expires_at IS NOT NULL AND expires_at < ?
  `, [now]);

  for (const nb of expired) {
    runMain('UPDATE notebooks SET deleted_at = datetime("now") WHERE id = ?', [nb.id]);
    runMain('UPDATE cells SET deleted_at = datetime("now") WHERE notebook_id = ?', [nb.id]);
    removeNotebookVolume(nb.id);
    stopTerminalContainer(nb.id);
    createNotification({
      userId: nb.user_id,
      notebookId: nb.id,
      message: `Notebook temporary "${nb.name}" telah dihapus karena masa aktifnya habis.`,
      type: 'warning'
    });
  }
  return expired;
}

module.exports = {
  podmanAvailable,
  listAvailableImages,
  resolveImage,
  buildRunArgs,
  runCell,
  ensureNotebookVolume,
  getNotebookVolumePath,
  removeNotebookVolume,
  ensureZellyNetwork,
  startTerminalContainer,
  stopTerminalContainer,
  execInContainer,
  terminalContainers,
  cleanupExpiredNotebooks,
  podmanSocket,
  stopCellProcess
};
