/* ============================================================
   ZELLY FRONTEND — Lengkap 100%
   i18n (ID/EN), auth, notebook, cell, terminal PTY, notifikasi, shared session
   ============================================================ */

const I18N = {
  id: {
    appName: 'Zelly',
    navLogout: 'Keluar',
    h1Notebooks: 'Notebook Anda',
    pNotebooksDesc: 'Kelola dan buat notebook berbasis cell Anda.',
    btnAdd: '+ Tambah Notebook',
    emptyTitle: 'Belum ada notebook',
    emptyDesc: 'Buat notebook pertama Anda untuk memulai menulis kode.',
    emptyAdd: '+ Tambah Notebook Pertama',
    modalTitle: 'Tambah Notebook Baru',
    labelName: 'Nama Notebook',
    labelEnv: 'Environment (bahasa)',
    labelSession: 'ID Sesi (untuk koneksi antar notebook)',
    sessionHelp: 'Notebook dengan ID sesi sama saling tersambung.',
    labelType: 'Tipe Notebook',
    typeLong: 'Long-lasting',
    typeTemp: 'Temporary (3 hari - 2 minggu)',
    labelRam: 'Max RAM',
    labelCpu: 'Max CPU',
    labelStorage: 'Max Storage',
    ramHelp: 'Kosongkan untuk tanpa batas.',
    cpuHelp: 'Kosongkan untuk tanpa batas.',
    storageHelp: 'Kosongkan untuk tanpa batas.',
    labelKeepalive: 'Cell tetap jalan walau tidak dibuka 6 jam?',
    keepaliveDesc: 'Hanya untuk long-lasting. Jika tidak dicentang, cell mati setelah 6 jam idle.',
    btnCancel: 'Batal',
    btnCreate: 'Buat Notebook',
    btnBack: 'Kembali',
    btnTerminal: 'Buka Terminal',
    btnCloseTerminal: 'Tutup Terminal',
    btnAddCell: 'Tambah Cell',
    labelSelectEnv: 'Pilih Environment',
    btnRefresh: 'Segarkan',
    envDesc: 'Environment dapat diubah kapan saja di dalam notebook.',
    btnStart: 'Mulai',
    outputNone: 'Tidak ada output',
    statusRunning: 'Sedang berjalan...',
    statusCompleted: 'Selesai',
    statusError: 'Error',
    toastSuccess: 'Berhasil',
    toastError: 'Gagal',
    login: 'Masuk',
    register: 'Daftar',
    email: 'Email',
    password: 'Kata sandi',
    name: 'Nama',
    roleOwner: 'Owner',
    roleMember: 'Anggota',
    confirmDelete: 'Yakin ingin menghapus notebook ini?',
    notifTitle: 'Notifikasi',
    notifEmpty: 'Tidak ada notifikasi',
    notifRead: 'Tandai sebagai dibaca',
    sessionTitle: 'Shared Session',
    sessionDesc: 'Notebook dengan ID sesi sama saling tersambung',
    sessionNoNotebooks: 'Tidak ada notebook lain dalam sesi ini',
    msgPlaceholder: 'Ketik pesan...',
    btnSend: 'Kirim',
    fileShared: 'File dibagikan',
    adminTitle: 'Admin (Owner)',
    adminUsers: 'Pengguna',
    adminDeleteNotebook: 'Hapus Notebook',
    adminDeleteConfirm: 'Hapus notebook ini? Ini akan menghapus semua cell dan data.',
    authDesc: 'Selamat datang kembali. Silakan masuk untuk melanjutkan.',
    authRegTitle: 'Buat Akun Baru',
    authRegDesc: 'User pertama akan otomatis menjadi owner.',
    authSwitchPrompt: 'Belum punya akun?',
    authSwitchToReg: 'Daftar sekarang',
    backToLogin: 'Kembali ke masuk',
    labelDuration: 'Durasi masa aktif (Temporary)',
    durationHelp: 'Habis masa aktif: notebook dihapus otomatis dan kamu diberi notifikasi.',
    regSubmit: 'Daftar & Masuk',
    codePlaceholder: 'Tulis kode di sini... (ketuk cell untuk mulai menulis)',
    outputEmpty: 'Output hasil eksekusi muncul di sini.',
    tabCell: 'Cell',
    tabFiles: 'Files',
    filesMkdir: 'Folder Baru',
    filesNewfile: 'File Baru',
    filesUpload: 'Upload',
    filesSelect: 'Pilih',
    filesDownloadAll: 'Unduh Semua (zip)',
    filesSelectCount: 'dipilih',
    filesDownloadSelected: 'Unduh Terpilih',
    filesDeleteSelected: 'Hapus Terpilih',
    filesCancelSelect: 'Batal',
    filesEmpty: 'Folder kosong.',
    filesMaxhint: 'Max 120 MB / file',
    filesNewFileName: 'Nama file (mis. data.txt)',
    filesNewFolderName: 'Nama folder',
    filesRenamePrompt: 'Nama baru',
    filesDeleteConfirm: 'Hapus item ini?',
    filesTitle: 'Penyimpanan Notebook',
    filesRefresh: 'Segarkan',
    filesDrop: 'Tarik file ke sini, atau klik untuk memilih file',
    filesSearch: 'Cari file...',
    filesSelectAll: 'Pilih semua',
    filesDownloadAllShort: 'Unduh Semua',
    settingsTitle: 'Pengaturan',
    settingsOpen: 'Pengaturan',
    langLabel: 'Bahasa',
    themeLabel: 'Tema',
    theme_light: 'Terang',
    theme_dark: 'Gelap',
    theme_ocean: 'Laut',
    theme_sunset: 'Senja',
    settingsClose: 'Tutup',
    runAll: 'Run All',
    stopAll: 'Stop',
    moveUp: 'Pindah ke atas',
    moveDown: 'Pindah ke bawah',
    duplicate: 'Duplikat',
    delete: 'Hapus',
    rename: 'Ganti Nama',
    profile: 'Profil',
    logout: 'Keluar'
  },
  en: {
    appName: 'Zelly',
    navLogout: 'Logout',
    h1Notebooks: 'Your Notebooks',
    pNotebooksDesc: 'Manage and create cell-based notebooks.',
    btnAdd: '+ Add Notebook',
    emptyTitle: 'No notebooks yet',
    emptyDesc: 'Create your first notebook to start writing code.',
    emptyAdd: '+ Add First Notebook',
    modalTitle: 'Add New Notebook',
    labelName: 'Notebook Name',
    labelEnv: 'Environment (language)',
    labelSession: 'Session ID (for cross-notebook connection)',
    sessionHelp: 'Notebooks with the same session ID are connected.',
    labelType: 'Notebook Type',
    typeLong: 'Long-lasting',
    typeTemp: 'Temporary (3 days - 2 weeks)',
    labelRam: 'Max RAM',
    labelCpu: 'Max CPU',
    labelStorage: 'Max Storage',
    ramHelp: 'Leave empty for unlimited.',
    cpuHelp: 'Leave empty for unlimited.',
    storageHelp: 'Leave empty for unlimited.',
    labelKeepalive: 'Keep cell running even if not opened for 6 hours?',
    keepaliveDesc: 'Long-lasting only. If unchecked, cell dies after 6 hours idle.',
    btnCancel: 'Cancel',
    btnCreate: 'Create Notebook',
    btnBack: 'Back',
    btnTerminal: 'Open Terminal',
    btnCloseTerminal: 'Close Terminal',
    btnAddCell: 'Add Cell',
    labelSelectEnv: 'Select Environment',
    btnRefresh: 'Refresh',
    envDesc: 'Environment can be changed anytime inside the notebook.',
    btnStart: 'Start',
    outputNone: 'No output',
    statusRunning: 'Running...',
    statusCompleted: 'Completed',
    statusError: 'Error',
    toastSuccess: 'Success',
    toastError: 'Failed',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    roleOwner: 'Owner',
    roleMember: 'Member',
    confirmDelete: 'Are you sure you want to delete this notebook?',
    notifTitle: 'Notifications',
    notifEmpty: 'No notifications',
    notifRead: 'Mark as read',
    sessionTitle: 'Shared Session',
    sessionDesc: 'Notebooks with the same session ID are connected',
    sessionNoNotebooks: 'No other notebooks in this session',
    msgPlaceholder: 'Type a message...',
    btnSend: 'Send',
    fileShared: 'File shared',
    adminTitle: 'Admin (Owner)',
    adminUsers: 'Users',
    adminDeleteNotebook: 'Delete Notebook',
    adminDeleteConfirm: 'Delete this notebook? This will remove all cells and data.',
    authDesc: 'Welcome back. Sign in to continue.',
    authRegTitle: 'Create New Account',
    authRegDesc: 'The first user automatically becomes the owner.',
    authSwitchPrompt: "Don't have an account?",
    authSwitchToReg: 'Register now',
    backToLogin: 'Back to login',
    labelDuration: 'Active duration (Temporary)',
    durationHelp: 'Expired notebooks are deleted automatically and you will be notified.',
    regSubmit: 'Register & Sign in',
    codePlaceholder: 'Write code here... (tap the cell to start typing)',
    outputEmpty: 'Execution output appears here.',
    tabCell: 'Cell',
    tabFiles: 'Files',
    filesMkdir: 'New Folder',
    filesNewfile: 'New File',
    filesUpload: 'Upload',
    filesSelect: 'Select',
    filesDownloadAll: 'Download All (zip)',
    filesSelectCount: 'selected',
    filesDownloadSelected: 'Download Selected',
    filesDeleteSelected: 'Delete Selected',
    filesCancelSelect: 'Cancel',
    filesEmpty: 'Folder is empty.',
    filesMaxhint: 'Max 120 MB / file',
    filesNewFileName: 'File name (e.g. data.txt)',
    filesNewFolderName: 'Folder name',
    filesRenamePrompt: 'New name',
    filesDeleteConfirm: 'Delete this item?',
    filesTitle: 'Notebook Storage',
    filesRefresh: 'Refresh',
    filesDrop: 'Drag files here, or click to choose files',
    filesSelectAll: 'Select all',
    filesDownloadAllShort: 'Download All',
    settingsTitle: 'Settings',
    settingsOpen: 'Settings',
    langLabel: 'Language',
    themeLabel: 'Theme',
    theme_light: 'Light',
    theme_dark: 'Dark',
    theme_ocean: 'Ocean',
    theme_sunset: 'Sunset',
    settingsClose: 'Close',
    filesSearch: 'Search files...',
    runAll: 'Run All',
    stopAll: 'Stop',
    moveUp: 'Move up',
    moveDown: 'Move down',
    duplicate: 'Duplicate',
    delete: 'Delete',
    rename: 'Rename',
    profile: 'Profile',
    logout: 'Logout',
    langPython: 'Python',
    langNodejs: 'Node.js',
    langBash: 'Bash',
    stdinPlaceholder: 'Type answer...',
    stdinSend: 'Send',
    stdinStop: 'Stop',
    fileEdit: 'Edit File',
    filePreview: 'Preview',
    fileSave: 'Save',
    nbSettings: 'Notebook Settings',
    nbPassword: 'Notebook Password',
    nbPasswordDesc: 'Leave empty to remove password. Password is hashed with bcrypt.',
    nbPasswordNew: 'New password',
    nbPasswordActive: 'Password active'
  }
};

let currentLang = localStorage.getItem('zelly-lang') || 'id';
let token = localStorage.getItem('zelly-token') || '';
let currentNotebookId = null;
let socket = null;
let term = null;
let terminalOpen = false;
let notificationInterval = null;
// --- Routing (setiap tampilan punya URL sendiri) ---
let currentSlug = '';      // slug notebook aktif (id sesi, atau id notebook bila sesi kosong)
let currentTab = 'cell';   // cell | files | terminal
let pendingPath = null;    // tujuan yang disimpan saat belum login
let slugCache = {};        // slug -> objek notebook

// Terapkan semua teks statis sesuai bahasa aktif
function applyStaticTexts() {
  const el = (id) => document.getElementById(id);
  const set = (id, txt) => { const e = el(id); if (e) e.textContent = txt; };

  // Dashboard / empty state
  set('btn-add-text', t('btnAdd'));
  set('btn-empty-add-text', t('emptyAdd'));
  set('empty-title', t('emptyTitle'));
  set('empty-desc', t('emptyDesc'));
  set('h1-notebooks', t('h1Notebooks'));
  set('p-notebooks-desc', t('pNotebooksDesc'));

  // Modal tambah notebook
  set('modal-title', t('modalTitle'));
  set('label-name', t('labelName'));
  set('label-env', t('labelEnv'));
  set('label-session', t('labelSession'));
  set('session-help', t('sessionHelp'));
  set('label-type', t('labelType'));
  set('label-duration', t('labelDuration'));
  set('duration-help', t('durationHelp'));
  set('label-ram', t('labelRam'));
  set('label-cpu', t('labelCpu'));
  set('label-storage', t('labelStorage'));
  set('ram-help', t('ramHelp'));
  set('cpu-help', t('cpuHelp'));
  set('storage-help', t('storageHelp'));
  set('btn-modal-cancel', t('btnCancel'));

  // Dropdown tipe
  const typeSel = document.querySelector('#form-add-notebook select[name="type"]');
  if (typeSel && typeSel.options.length >= 2) {
    typeSel.options[0].textContent = t('typeLong');
    typeSel.options[1].textContent = t('typeTemp');
  }

  // Label keep-alive (strong + span)
  const keep = el('label-keepalive');
  if (keep) {
    const s = keep.querySelector('strong');
    const d = keep.querySelector('span');
    if (s) s.textContent = t('labelKeepalive');
    if (d) d.textContent = t('keepaliveDesc');
  }

  // Editor
  set('btn-back-text', t('btnBack'));
  set('btn-add-cell-text', t('btnAddCell'));
  set('label-select-env', t('labelSelectEnv'));
  set('btn-refresh-text', t('btnRefresh'));
  set('env-desc', t('envDesc'));

  // Navbar
  set('nav-logout-text', t('navLogout'));

  // Overlay auth
  set('auth-title', t('login'));
  set('auth-desc', t('authDesc'));
  set('auth-label-email', t('email'));
  set('auth-label-password', t('password'));
  set('auth-switch-prompt', t('authSwitchPrompt'));
  set('auth-switch-reg', t('authSwitchToReg'));
  set('auth-reg-title', t('authRegTitle'));
  set('auth-reg-desc', t('authRegDesc'));
  set('auth-switch-login', t('backToLogin'));
  const submit = el('auth-btn-submit');
  if (submit) submit.textContent = t('login');
  const regSubmit = el('auth-reg-submit');
  if (regSubmit) regSubmit.textContent = t('regSubmit');

  // Tabs & file manager
  set('tab-cell-text', t('tabCell'));
  set('tab-files-text', t('tabFiles'));
  set('files-title', t('filesTitle'));
  set('files-refresh-text', t('filesRefresh'));
  set('files-mkdir-text', t('filesMkdir'));
  set('files-newfile-text', t('filesNewfile'));
  set('files-upload-text', t('filesUpload'));
  set('files-select-text', t('filesSelect'));
  set('files-download-all-text', t('filesDownloadAllShort'));
  set('files-select-all-text', t('filesSelectAll'));
  set('files-download-selected-text', t('filesDownloadSelected'));
  set('files-delete-selected-text', t('filesDeleteSelected'));
  set('files-cancel-select-text', t('filesCancelSelect'));
  set('files-maxhint', t('filesMaxhint'));
  set('files-empty-text', t('filesEmpty'));
  set('files-drop-text', t('filesDrop'));
  set('files-search', t('filesSearch'));

  // Pengaturan (settings)
  set('settings-title', t('settingsTitle'));
  set('settings-lang-label', t('langLabel'));
  set('settings-theme-label', t('themeLabel'));
  set('btn-settings-close', t('settingsClose'));
  const btnSettings = el('btn-settings');
  if (btnSettings) btnSettings.title = t('settingsOpen');
  refreshThemeLabels();
}

// Perbarui nama tema saat bahasa berubah
function refreshThemeLabels() {
  document.querySelectorAll('.theme-card').forEach((c) => {
    const label = c.querySelector('.theme-label');
    if (label) label.textContent = t('theme_' + c.dataset.theme);
  });
}
let currentFilePath = '';

// --- Status mode pilih file (harus di scope modul agar bisa dipakai loadFiles) ---
let selectMode = false;
const selected = new Set();

function updateSelectUI() {
  const selectBar = document.getElementById('files-select-bar');
  const selectCount = document.getElementById('files-select-count');
  const all = document.querySelectorAll('.file-select-cb');
  all.forEach(cb => {
    cb.classList.toggle('hidden', !selectMode);
    cb.checked = selected.has(cb.dataset.path);
  });
  if (selectBar) selectBar.classList.toggle('hidden', !selectMode);
  if (selectCount) selectCount.textContent = `${selected.size} ${t('filesSelectCount')}`;
  const selAll = document.getElementById('files-select-all');
  if (selAll) selAll.checked = all.length > 0 && selected.size === all.length;
}

async function loadFiles() {
  if (!currentNotebookId) return;
  const list = document.getElementById('files-list');
  const empty = document.getElementById('files-empty');
  const bc = document.getElementById('files-breadcrumb');
  try {
    const data = await api(`/notebooks/${currentNotebookId}/files?path=${encodeURIComponent(currentFilePath)}`);
    bc.textContent = data.path;
    list.innerHTML = '';
    selected.clear();
    updateSelectUI();
    if (!data.entries.length) { empty.classList.remove('hidden'); return; }
    empty.classList.add('hidden');
    for (const e of data.entries) {
      const icon = e.isDir ? 'fa-folder text-amber-500' : getFileIcon(e.name);
      const size = e.isDir ? 'Folder' : formatBytes(e.size);
      const date = e.mtime ? new Date(e.mtime).toLocaleDateString(currentLang === 'id' ? 'id-ID' : 'en-US', { day: '2-digit', month: 'short', year: 'numeric' }) : '';
      const row = document.createElement('div');
      row.className = 'flex items-center gap-2 px-3 py-2.5 hover:bg-slate-50 transition';
      row.innerHTML = `
        <i class="fa-solid ${icon} w-5 text-center shrink-0"></i>
        <button class="flex-1 min-w-0 text-left text-sm text-slate-700 break-all line-clamp-2" data-path="${escapeHtml(e.path)}" data-dir="${e.isDir}" title="${escapeHtml(e.name)}">${escapeHtml(e.name)}</button>
        <input type="checkbox" class="file-select-cb hidden w-4 h-4 rounded border-slate-300 text-indigo-600 shrink-0" data-path="${escapeHtml(e.path)}" data-dir="${e.isDir}">
        <span class="text-[10px] text-slate-400 w-14 text-right shrink-0">${size}</span>
        <span class="text-[10px] text-slate-400 w-16 text-right shrink-0 hidden sm:inline">${date}</span>
        ${e.isDir ? `<button class="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0" data-action="download" data-path="${escapeHtml(e.path)}" title="Download zip"><i class="fa-solid fa-download text-xs"></i></button>` : `<button class="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0" data-action="download" data-path="${escapeHtml(e.path)}" title="Download"><i class="fa-solid fa-download text-xs"></i></button>`}
        <button class="w-8 h-8 rounded-lg hover:bg-slate-200 text-slate-500 flex items-center justify-center shrink-0" data-action="rename" data-path="${escapeHtml(e.path)}" title="Rename"><i class="fa-solid fa-pen text-xs"></i></button>
        <button class="w-8 h-8 rounded-lg hover:bg-red-100 text-red-500 flex items-center justify-center shrink-0" data-action="delete" data-path="${escapeHtml(e.path)}" title="Delete"><i class="fa-solid fa-trash text-xs"></i></button>
      `;
      list.appendChild(row);
    }
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}

function formatBytes(b) {
  if (b == null) return '';
  if (b < 1024) return b + ' B';
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + ' KB';
  return (b / (1024 * 1024)).toFixed(1) + ' MB';
}

function getFileIcon(name) {
  const ext = (name.split('.').pop() || '').toLowerCase();
  const icons = {
    js: 'fa-brands fa-js text-yellow-500',
    ts: 'fa-brands fa-js text-blue-500',
    py: 'fa-brands fa-python text-blue-400',
    json: 'fa-solid fa-code text-yellow-600',
    txt: 'fa-solid fa-file-lines text-slate-400',
    md: 'fa-brands fa-markdown text-slate-500',
    html: 'fa-brands fa-html5 text-orange-500',
    css: 'fa-brands fa-css3-alt text-blue-500',
    pdf: 'fa-solid fa-file-pdf text-red-500',
    png: 'fa-solid fa-file-image text-purple-400',
    jpg: 'fa-solid fa-file-image text-purple-400',
    jpeg: 'fa-solid fa-file-image text-purple-400',
    gif: 'fa-solid fa-file-image text-purple-400',
    svg: 'fa-solid fa-file-image text-purple-400',
    mp4: 'fa-solid fa-file-video text-pink-500',
    mp3: 'fa-solid fa-file-audio text-green-500',
    wav: 'fa-solid fa-file-audio text-green-500',
    zip: 'fa-solid fa-file-zipper text-amber-500',
    tar: 'fa-solid fa-file-zipper text-amber-500',
    gz: 'fa-solid fa-file-zipper text-amber-500',
    sh: 'fa-solid fa-terminal text-slate-600',
    bash: 'fa-solid fa-terminal text-slate-600',
    yml: 'fa-solid fa-file-code text-pink-400',
    yaml: 'fa-solid fa-file-code text-pink-400',
    toml: 'fa-solid fa-file-code text-slate-500',
    xml: 'fa-solid fa-file-code text-orange-400',
    csv: 'fa-solid fa-file-csv text-green-600',
    sql: 'fa-solid fa-database text-blue-400',
    log: 'fa-solid fa-file-lines text-slate-400',
    env: 'fa-solid fa-file-code text-yellow-500',
    lock: 'fa-solid fa-lock text-slate-400'
  };
  return icons[ext] || 'fa-solid fa-file text-slate-400';
}

function setupFiles() {
  const btnRefresh = document.getElementById('btn-files-refresh');
  const btnMkdir = document.getElementById('btn-files-mkdir');
  const btnNewfile = document.getElementById('btn-files-newfile');
  const uploadInput = document.getElementById('files-upload-input');
  const list = document.getElementById('files-list');

  // Sinkronkan tampilan (toolbar pilih) ke status modul saat panel dibuka
  updateSelectUI();

  // Pencarian file
  const searchInput = document.getElementById('files-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.toLowerCase().trim();
      const rows = document.querySelectorAll('#files-list > div');
      rows.forEach(row => {
        const nameBtn = row.querySelector('button[data-path]');
        if (!nameBtn) return;
        const name = (nameBtn.textContent || '').toLowerCase();
        row.style.display = !q || name.includes(q) ? '' : 'none';
      });
    });
  }

  const btnSelect = document.getElementById('btn-files-select');
  if (btnSelect) btnSelect.onclick = () => {
    selectMode = !selectMode;
    if (!selectMode) selected.clear();
    updateSelectUI();
    btnSelect.innerHTML = selectMode
      ? '<i class="fa-solid fa-xmark"></i> <span>' + t('filesCancelSelect') + '</span>'
      : '<i class="fa-solid fa-check-double"></i> <span>' + t('filesSelect') + '</span>';
  };

  const btnCancelSelect = document.getElementById('btn-files-cancel-select');
  if (btnCancelSelect) btnCancelSelect.onclick = () => {
    selectMode = false; selected.clear(); updateSelectUI();
    if (btnSelect) btnSelect.innerHTML = '<i class="fa-solid fa-check-double"></i> <span>' + t('filesSelect') + '</span>';
  };

  const btnDownloadSelected = document.getElementById('btn-files-download-selected');
  if (btnDownloadSelected) btnDownloadSelected.onclick = async () => {
    if (!selected.size) { showToast(t('toastError'), 'Pilih file dulu', 'error'); return; }
    const paths = [...selected];
    const r = await fetch(`${window.location.origin}/api/notebooks/${currentNotebookId}/files/download-selected`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ paths })
    });
    if (!r.ok) { showToast(t('toastError'), 'Gagal unduh', 'error'); return; }
    const blob = await r.blob();
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'selected.zip'; a.click();
  };

  const btnDeleteSelected = document.getElementById('btn-files-delete-selected');
  if (btnDeleteSelected) btnDeleteSelected.onclick = async () => {
    if (!selected.size) return;
    if (!confirm(t('filesDeleteConfirm'))) return;
    for (const p of selected) {
      try { await api(`/notebooks/${currentNotebookId}/files?path=${encodeURIComponent(p)}`, 'DELETE'); } catch (e) {}
    }
    selected.clear(); selectMode = false; updateSelectUI();
    const bs = document.getElementById('btn-files-select');
    if (bs) bs.innerHTML = '<i class="fa-solid fa-check-double"></i> <span>' + t('filesSelect') + '</span>';
    await loadFiles();
  };

  const btnDownloadAll = document.getElementById('btn-files-download-all');
  if (btnDownloadAll) btnDownloadAll.onclick = async () => {
    try {
      const r = await fetch(`${window.location.origin}/api/notebooks/${currentNotebookId}/files/download-all?path=${encodeURIComponent(currentFilePath)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!r.ok) { showToast(t('toastError'), 'Gagal unduh', 'error'); return; }
      const blob = await r.blob();
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'files.zip'; a.click();
    } catch (err) { showToast(t('toastError'), err.message, 'error'); }
  };

  if (list) list.addEventListener('change', (e) => {
    const cb = e.target.closest('.file-select-cb');
    if (!cb) return;
    if (cb.checked) selected.add(cb.dataset.path); else selected.delete(cb.dataset.path);
    updateSelectUI();
  });

  if (btnRefresh) btnRefresh.onclick = () => loadFiles();

  if (btnMkdir) btnMkdir.onclick = async () => {
    const name = prompt(t('filesNewFolderName'));
    if (!name) return;
    const p = (currentFilePath ? currentFilePath.replace(/\/$/, '') + '/' : '') + name;
    try { await api(`/notebooks/${currentNotebookId}/files/mkdir`, 'POST', { path: p }); await loadFiles(); }
    catch (err) { showToast(t('toastError'), err.message, 'error'); }
  };

  if (btnNewfile) btnNewfile.onclick = async () => {
    const name = prompt(t('filesNewFileName'));
    if (!name) return;
    const p = (currentFilePath ? currentFilePath.replace(/\/$/, '') + '/' : '') + name;
    try { await api(`/notebooks/${currentNotebookId}/files/create`, 'POST', { path: p, content: '' }); await loadFiles(); }
    catch (err) { showToast(t('toastError'), err.message, 'error'); }
  };

  async function uploadFiles(fileList) {
    const files = Array.from(fileList || []);
    if (!files.length || !currentNotebookId) return;
    let done = 0;
    for (const f of files) {
      if (f.size > 120 * 1024 * 1024) { showToast(t('toastError'), `${f.name}: melebihi 120 MB`, 'error'); continue; }
      const fd = new FormData();
      fd.append('file', f);
      fd.append('path', currentFilePath);
      try {
        const r = await fetch(`${window.location.origin}/api/notebooks/${currentNotebookId}/files/upload`, {
          method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd
        });
        const data = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(data.error || 'Gagal mengunggah');
        done++;
      } catch (err) { showToast(t('toastError'), `${f.name}: ${err.message}`, 'error'); }
    }
    if (done) showToast(t('toastSuccess'), `${done} file diunggah`);
    await loadFiles();
  }

  if (uploadInput) uploadInput.onchange = () => {
    const list = Array.from(uploadInput.files || []);
    uploadInput.value = '';
    uploadFiles(list);
  };

  // Zona tarik-lepas (drag & drop) — klik untuk memilih file
  const dz = document.getElementById('files-dropzone');
  if (dz) {
    dz.onclick = () => { if (uploadInput) uploadInput.click(); };
    ['dragenter', 'dragover'].forEach((ev) => dz.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      dz.classList.add('border-indigo-400', 'bg-indigo-50/50');
    }));
    ['dragleave', 'drop'].forEach((ev) => dz.addEventListener(ev, (e) => {
      e.preventDefault(); e.stopPropagation();
      dz.classList.remove('border-indigo-400', 'bg-indigo-50/50');
    }));
    dz.addEventListener('drop', (e) => {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
    });
  }

  // Pilih semua
  const selAll = document.getElementById('files-select-all');
  if (selAll) selAll.onchange = () => {
    document.querySelectorAll('.file-select-cb').forEach((cb) => {
      cb.checked = selAll.checked;
      if (selAll.checked) selected.add(cb.dataset.path); else selected.delete(cb.dataset.path);
    });
    updateSelectUI();
  };

  if (list) list.onclick = async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (btn) {
      const action = btn.dataset.action;
      const p = btn.dataset.path;
      if (action === 'delete') {
        if (!confirm(t('filesDeleteConfirm'))) return;
        try { await api(`/notebooks/${currentNotebookId}/files?path=${encodeURIComponent(p)}`, 'DELETE'); await loadFiles(); }
        catch (err) { showToast(t('toastError'), err.message, 'error'); }
      } else if (action === 'rename') {
        const name = prompt(t('filesRenamePrompt'), p.split('/').pop());
        if (!name) return;
        const newPath = p.split('/').slice(0, -1).concat(name).join('/');
        try { await api(`/notebooks/${currentNotebookId}/files/rename`, 'POST', { from: p, to: newPath }); await loadFiles(); }
        catch (err) { showToast(t('toastError'), err.message, 'error'); }
      } else if (action === 'download') {
        try {
          const r = await fetch(`${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(p)}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!r.ok) throw new Error('Gagal unduh');
          const blob = await r.blob();
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = p.split('/').pop();
          a.click();
          URL.revokeObjectURL(a.href);
        } catch (err) { showToast(t('toastError'), err.message, 'error'); }
      }
      return;
    }
    const nameBtn = e.target.closest('button[data-path]');
    if (nameBtn) {
      const isDir = nameBtn.dataset.dir === 'true';
      const path = nameBtn.dataset.path;
      if (isDir) {
        currentFilePath = path.replace(/\/$/, '') + '/';
        await loadFiles();
      } else {
        openFilePreview(path);
      }
    }
  };

  // Breadcrumb: klik segmen untuk navigasi
  const bc = document.getElementById('files-breadcrumb');
  if (bc) bc.onclick = (e) => {
    const seg = e.target.dataset.seg;
    if (seg !== undefined) { currentFilePath = seg; loadFiles(); }
  };
}

// ---------------------------------------------------------------
// File Editor & Preview
// ---------------------------------------------------------------
const TEXT_EXTS = ['js', 'json', 'txt', 'md', 'py', 'sh', 'bash', 'html', 'css', 'yml', 'yaml', 'toml', 'xml', 'csv', 'sql', 'log', 'env', 'ts', 'jsx', 'tsx', 'java', 'c', 'cpp', 'h', 'rs', 'go', 'rb', 'php', 'swift', 'kt', 'scala', 'r', 'lua', 'pl', 'vim', 'ini', 'cfg', 'conf', 'properties', 'gradle', 'dockerfile', 'makefile', 'cmake', 'sh', 'bat', 'ps1', 'zsh', 'fish'];
const IMAGE_EXTS = ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'bmp', 'ico', 'tiff', 'tif'];
const VIDEO_EXTS = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv', 'flv', 'wmv'];
const AUDIO_EXTS = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma'];
const PDF_EXTS = ['pdf'];

function getFileExt(path) {
  return (path.split('.').pop() || '').toLowerCase();
}

function isTextFile(path) {
  return TEXT_EXTS.includes(getFileExt(path));
}

function isImageFile(path) {
  return IMAGE_EXTS.includes(getFileExt(path));
}

function isVideoFile(path) {
  return VIDEO_EXTS.includes(getFileExt(path));
}

function isAudioFile(path) {
  return AUDIO_EXTS.includes(getFileExt(path));
}

function isPdfFile(path) {
  return PDF_EXTS.includes(getFileExt(path));
}

async function openFilePreview(path) {
  const name = path.split('/').pop();
  const modal = document.getElementById('modal-file-preview');
  const title = document.getElementById('file-preview-title');
  const content = document.getElementById('file-preview-content');
  if (!modal || !title || !content) return;

  title.textContent = name;
  content.innerHTML = '<div class="text-sm text-slate-400">Memuat...</div>';
  modal.classList.remove('hidden');

  if (isImageFile(path)) {
    const url = `${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(path)}&token=${token}`;
    content.innerHTML = `<img src="${url}" class="max-w-full max-h-[60vh] rounded-lg" alt="${escapeHtml(name)}" />`;
  } else if (isVideoFile(path)) {
    const url = `${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(path)}&token=${token}`;
    content.innerHTML = `<video src="${url}" controls class="max-w-full max-h-[60vh] rounded-lg"></video>`;
  } else if (isAudioFile(path)) {
    const url = `${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(path)}&token=${token}`;
    content.innerHTML = `<audio src="${url}" controls class="w-full"></audio>`;
  } else if (isPdfFile(path)) {
    const url = `${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(path)}&token=${token}`;
    content.innerHTML = `<iframe src="${url}" class="w-full h-[60vh] rounded-lg border-0"></iframe>`;
  } else if (isTextFile(path)) {
    // Text: show inline preview with option to edit
    try {
      const r = await fetch(`${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(path)}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const text = await r.text();
      content.innerHTML = `<pre class="text-sm font-mono text-slate-800 whitespace-pre-wrap break-words p-2">${escapeHtml(text)}</pre>`;
    } catch (err) {
      content.innerHTML = `<div class="text-sm text-red-500">Gagal memuat file</div>`;
    }
  } else {
    // Unknown type: offer download
    content.innerHTML = `<div class="text-center"><p class="text-sm text-slate-500 mb-3">Tipe file tidak bisa dipreview</p><a href="${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(path)}&token=${token}" class="inline-block px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm">Download</a></div>`;
  }
}

function openFileEditor(path) {
  const name = path.split('/').pop();
  const modal = document.getElementById('modal-file-editor');
  const title = document.getElementById('file-editor-title');
  const content = document.getElementById('file-editor-content');
  if (!modal || !title || !content) return;

  title.textContent = 'Edit: ' + name;
  content.value = 'Memuat...';
  modal.classList.remove('hidden');

  // Load file content
  fetch(`${window.location.origin}/api/notebooks/${currentNotebookId}/files/download?path=${encodeURIComponent(path)}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
    .then(r => r.text())
    .then(text => { content.value = text; content.dataset.path = path; })
    .catch(() => { content.value = 'Gagal memuat file'; });
}

async function saveFileEditor() {
  const content = document.getElementById('file-editor-content');
  if (!content || !content.dataset.path) return;
  const path = content.dataset.path;
  try {
    await api(`/notebooks/${currentNotebookId}/files/create`, 'POST', { path, content: content.value });
    showToast(t('toastSuccess'), 'File disimpan');
    document.getElementById('modal-file-editor').classList.add('hidden');
    loadFiles();
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}

// ---------------------------------------------------------------
// Notebook Settings (password)
// ---------------------------------------------------------------
function setupNotebookSettings() {
  const modal = document.getElementById('modal-notebook-settings');
  const backdrop = document.getElementById('nb-settings-backdrop');
  const btnClose = document.getElementById('btn-nb-settings-close');
  const btnSave = document.getElementById('btn-nb-password-save');
  const input = document.getElementById('nb-password-input');

  window.openNotebookSettings = () => {
    modal.classList.remove('hidden');
    api(`/notebooks/${currentNotebookId}/password-status`)
      .then(d => { input.placeholder = d.hasPassword ? 'Password baru (kosongkan untuk hapus)' : 'Password baru'; })
      .catch(() => {});
  };

  if (backdrop) backdrop.onclick = () => modal.classList.add('hidden');
  if (btnClose) btnClose.onclick = () => modal.classList.add('hidden');
  if (btnSave) btnSave.onclick = async () => {
    const password = input.value;
    try {
      await api(`/notebooks/${currentNotebookId}/password`, 'PUT', { password });
      showToast(t('toastSuccess'), password ? 'Password diaktifkan' : 'Password dihapus');
      input.value = '';
      modal.classList.add('hidden');
    } catch (err) { showToast(t('toastError'), err.message, 'error'); }
  };
}

// ---------------------------------------------------------------
// Cell stdin input (interactive)
// ---------------------------------------------------------------
function setupCellStdin() {
  const container = document.getElementById('cells-container');
  if (!container) return;

  container.querySelectorAll('.cell-card').forEach(card => {
    if (card.querySelector('.cell-stdin-zone')) return;

    const cellId = card.querySelector('textarea')?.id.replace('code-', '');
    if (!cellId) return;

    const zone = document.createElement('div');
    zone.className = 'cell-stdin-zone hidden items-center gap-2 px-4 py-3 bg-amber-50 border-t border-amber-200';
    zone.innerHTML = `
      <i class="fa-solid fa-keyboard text-amber-500 text-xs shrink-0"></i>
      <span class="text-xs text-amber-700 shrink-0">Input:</span>
      <input type="text" class="cell-stdin-input flex-1 h-9 px-3 rounded-lg border border-amber-300 bg-white text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none" placeholder="Ketik jawaban..." />
      <button class="cell-stdin-send h-9 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium shrink-0">Kirim</button>
      <button class="cell-stdin-stop h-9 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shrink-0">Stop</button>
    `;
    card.appendChild(zone);

    const input = zone.querySelector('.cell-stdin-input');
    const sendBtn = zone.querySelector('.cell-stdin-send');
    const stopBtn = zone.querySelector('.cell-stdin-stop');

    sendBtn.onclick = async () => {
      if (!input.value) return;
      try {
        await api(`/cells/${cellId}/stdin`, 'POST', { text: input.value });
        input.value = '';
      } catch (err) { showToast(t('toastError'), err.message, 'error'); }
    };
    stopBtn.onclick = async () => {
      try {
        await api(`/cells/${cellId}/stop`, 'POST');
      } catch (err) { showToast(t('toastError'), err.message, 'error'); }
    };
    input.onkeydown = (e) => {
      if (e.key === 'Enter') { e.preventDefault(); sendBtn.click(); }
    };
  });
}

function showStdinForCell(cellId) {
  const card = document.querySelector(`#code-${cellId}`)?.closest('.cell-card');
  if (!card) return;
  const zone = card.querySelector('.cell-stdin-zone');
  if (zone) zone.classList.remove('hidden');
}

function hideStdinForCell(cellId) {
  const card = document.querySelector(`#code-${cellId}`)?.closest('.cell-card');
  if (!card) return;
  const zone = card.querySelector('.cell-stdin-zone');
  if (zone) zone.classList.add('hidden');
}

function setupFileEditor() {
  const btnSave = document.getElementById('btn-file-save');
  if (btnSave) btnSave.onclick = saveFileEditor;
  const backdrop = document.getElementById('file-editor-backdrop');
  if (backdrop) backdrop.onclick = () => document.getElementById('modal-file-editor').classList.add('hidden');
  const previewBackdrop = document.getElementById('file-preview-backdrop');
  if (previewBackdrop) previewBackdrop.onclick = () => document.getElementById('modal-file-preview').classList.add('hidden');
}

// ---------------------------------------------------------------
// Cell language selector
// ---------------------------------------------------------------
function setupCellLanguageSelector() {
  const container = document.getElementById('cells-container');
  if (!container) return;

  container.querySelectorAll('.cell-card').forEach(card => {
    if (card.querySelector('.cell-lang-select')) return;

    const cellId = card.querySelector('textarea')?.id.replace('code-', '');
    if (!cellId) return;

    const header = card.querySelector('.flex.items-center.gap-1');
    if (!header) return;

    const select = document.createElement('select');
    select.className = 'cell-lang-select h-8 px-2 rounded-lg border border-slate-200 bg-white text-xs text-slate-600 outline-none';
    select.innerHTML = `
      <option value="python">Python</option>
      <option value="nodejs">Node.js</option>
      <option value="bash">Bash</option>
    `;
    select.onchange = async () => {
      try {
        await api(`/cells/${cellId}`, 'PUT', { language: select.value });
      } catch (err) { showToast(t('toastError'), err.message, 'error'); }
    };
    header.appendChild(select);
  });
}

// Tab switching
function setupTabs() {
  const tabCell = document.getElementById('tab-cell');
  const tabFiles = document.getElementById('tab-files');
  if (tabCell) tabCell.onclick = () => applyTabUI('cell', true);
  if (tabFiles) tabFiles.onclick = () => applyTabUI('files', true);
}

// ---------------------------------------------------------------
// i18n
// ---------------------------------------------------------------
const t = (key) => I18N[currentLang][key] || key;

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('zelly-lang', lang);
  document.documentElement.lang = lang;
  applyStaticTexts();
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  renderAll();
}

function showToast(title, message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toast-title').textContent = title;
  document.getElementById('toast-message').textContent = message;
  toast.classList.remove('translate-y-20', 'opacity-0');
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}

// ---------------------------------------------------------------
// API helper
// ---------------------------------------------------------------
function api(path, method = 'GET', body = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  // Same-origin: bekerja dari localhost, IP LAN, maupun domain publik
  return fetch(`${window.location.origin}/api${path}`, {
    method, headers, body: body ? JSON.stringify(body) : null
  }).then(async (r) => {
    const data = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(data.error || 'Terjadi kesalahan');
    return data;
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ---------------------------------------------------------------
// Auth UI — overlay (tidak menghancurkan layout utama)
// ---------------------------------------------------------------
function renderAuthUI() {
  const avatar = document.getElementById('nav-avatar');
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const authOverlay = document.getElementById('auth-overlay');

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const name = payload.name || payload.email;
      if (avatar) avatar.textContent = (name || '?')[0].toUpperCase();
      if (profileName) profileName.textContent = name;
      if (profileEmail) profileEmail.textContent = payload.email;
    } catch (e) { /* abaikan */ }
    if (authOverlay) authOverlay.classList.add('hidden');
  } else {
    if (authOverlay) authOverlay.classList.remove('hidden');
  }
}

window.logout = () => {
  token = '';
  localStorage.removeItem('zelly-token');
  if (socket) { socket.disconnect(); socket = null; }
  showDashboard(false);
  history.replaceState({}, '', '/login');
  renderAll();
  renderAuthUI();
};

function setupAuthEvents() {
  // Login form
  const loginForm = document.getElementById('auth-form');
  if (loginForm) {
    loginForm.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const data = await api('/auth/login', 'POST', {
          email: fd.get('email'),
          password: fd.get('password')
        });
        token = data.token;
        localStorage.setItem('zelly-token', token);
        renderAll();
        completePendingRoute();
      } catch (err) {
        showToast(t('toastError'), err.message, 'error');
      }
    };
  }

  // Switch to register
  const btnReg = document.getElementById('auth-switch-reg');
  if (btnReg) {
    btnReg.onclick = () => {
      document.getElementById('auth-form').classList.add('hidden');
      document.getElementById('auth-register').classList.remove('hidden');
    };
  }

  // Switch back to login
  const btnLogin = document.getElementById('auth-switch-login');
  if (btnLogin) {
    btnLogin.onclick = () => {
      document.getElementById('auth-register').classList.add('hidden');
      document.getElementById('auth-form').classList.remove('hidden');
    };
  }

  // Register form
  const regForm = document.getElementById('auth-reg-form');
  if (regForm) {
    regForm.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const data = await api('/auth/register', 'POST', {
          name: fd.get('name'),
          email: fd.get('email'),
          password: fd.get('password')
        });
        token = data.token;
        localStorage.setItem('zelly-token', token);
        renderAll();
        completePendingRoute();
      } catch (err) {
        showToast(t('toastError'), err.message, 'error');
      }
    };
  }

  // Logout (tombol ada di dalam menu profil)
  // window.logout didefinisikan di renderAuthUI
}

// ---------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------
async function loadNotebooks() {
  try {
    const { notebooks } = await api('/notebooks');
    const list = document.getElementById('notebook-list');
    const empty = document.getElementById('empty-state');
    list.innerHTML = '';

    if (notebooks.length === 0) {
      empty.classList.remove('hidden');
      list.classList.add('hidden');
    } else {
      empty.classList.add('hidden');
      list.classList.remove('hidden');
      const me = JSON.parse(atob(token.split('.')[1]));

      for (const nb of notebooks) {
        const isOwner = me.role === 'owner';
        const isMine = nb.user_id === me.id;
        const canDelete = isOwner || isMine;

        const el = document.createElement('div');
        el.className = 'nb-item group relative p-4 sm:p-5 rounded-2xl border border-slate-200 bg-white hover:shadow-md cursor-pointer';
        el.innerHTML = `
          <div class="flex items-start gap-2 mb-2">
            <div class="w-2 h-2 rounded-full mt-1.5 shrink-0 ${nb.type === 'temporary' ? 'bg-amber-500' : 'bg-emerald-500'}"></div>
            <span class="text-sm font-medium text-slate-900 group-hover:text-indigo-600 transition flex-1 min-w-0 truncate">${escapeHtml(nb.name)}</span>
            ${isOwner && !isMine ? `<span class="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-[10px] font-bold shrink-0">Owner</span>` : ''}
          </div>
          <div class="flex items-center justify-between mt-3 pt-3 border-t border-slate-50 gap-2">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded shrink-0">${nb.environment}</span>
              <span class="text-xs text-slate-500 truncate">Sesi: <span class="font-mono text-slate-400">${nb.session_id || '—'}</span></span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="w-1.5 h-1.5 rounded-full ${nb.keep_alive ? 'bg-blue-500' : 'bg-slate-300'}"></span>
              <span class="text-xs text-slate-500 hidden sm:inline">${nb.keep_alive ? 'Always On' : 'Idle Off'}</span>
              ${canDelete ? `
              <div class="relative">
                <button class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-100 flex items-center justify-center transition" onclick="event.stopPropagation(); window.toggleNotebookMenu(event, '${nb.id}')" title="Menu">
                  <i class="fa-solid fa-ellipsis-vertical text-xs"></i>
                </button>
                <div id="nb-menu-${nb.id}" class="hidden absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 z-50 py-1">
                  <button class="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2" onclick="window.renameNotebook('${nb.id}')">
                    <i class="fa-solid fa-pen text-slate-400"></i> <span id="nb-rename-text">Ganti Nama</span>
                  </button>
                  <button class="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2" onclick="window.duplicateNotebook('${nb.id}')">
                    <i class="fa-solid fa-copy text-slate-400"></i> <span id="nb-dup-text">Duplikat</span>
                  </button>
                  <button class="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2" onclick="window.deleteNotebook('${nb.id}')">
                    <i class="fa-solid fa-trash text-red-400"></i> <span id="nb-del-text">Hapus</span>
                  </button>
                </div>
              </div>
              ` : ''}
            </div>
          </div>
        `;
        el.onclick = () => openNotebook(nb.id, { slug: notebookSlug(nb), tab: 'cell' });
        list.appendChild(el);
      }
    }
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}

window.deleteNotebook = async (id) => {
  if (!confirm(t('confirmDelete'))) return;
  try {
    await api(`/notebooks/${id}`, 'DELETE');
    showToast(t('toastSuccess'), 'Notebook dihapus');
    loadNotebooks();
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
};

// ---------------------------------------------------------------
// Notebook Editor
// ---------------------------------------------------------------
async function openNotebook(id, opts = {}) {
  const { slug, tab, replace } = opts;
  currentNotebookId = id;
  currentSlug = slug || id;
  currentFilePath = '';
  document.getElementById('dashboard-view').classList.add('hidden');
  document.getElementById('editor-view').classList.remove('hidden');

  // Tulis URL: /notebook/<id-sesi>[/files|/terminal]
  setNotebookUrl(tab || 'cell', replace);

  // Panel Cell/Files & terminal sesuai rute
  applyTabUI(tab || 'cell', false);

  try {
    // Socket harus siap duluan — error load data tidak boleh mematikan terminal/cell
    initSocket();
    const { notebook } = await api(`/notebooks/${id}`);
    document.getElementById('env-badge').textContent = notebook.environment;
    await loadCells();
    await loadEnvironments();
    await loadSharedSession();
    // Rute /terminal: buka terminal setelah socket siap
    if ((tab || 'cell') === 'terminal' && socket) {
      const overlay = document.getElementById('terminal-overlay');
      if (overlay && overlay.classList.contains('hidden')) {
        window.toggleTerminal();
        syncTerminalUI();
      }
    }
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}

// ---------------------------------------------------------------
// ROUTER — URL rapi per tampilan
//   /                            dashboard
//   /login                       masuk / daftar
//   /notebook/<id-sesi>          notebook (tab Cell)
//   /notebook/<id-sesi>/files    tab Files
//   /notebook/<id-sesi>/terminal terminal terbuka
// ---------------------------------------------------------------
// Slug notebook = ID Sesi bila diisi, jika kosong pakai ID notebook.
function notebookSlug(nb) {
  if (!nb) return '';
  const s = nb.session_id ? String(nb.session_id).trim() : '';
  return s || String(nb.id);
}

// Baca rute dari address bar
function currentRoute() {
  const p = window.location.pathname.replace(/\/+$/, '') || '/';
  if (p === '/login') return { view: 'login' };
  if (p === '/new') return { view: 'new' };
  const m = p.match(/^\/notebook\/([^/]+)(?:\/(files|terminal))?$/);
  if (m) return { view: 'notebook', slug: decodeURIComponent(m[1]), tab: m[2] || 'cell' };
  return { view: 'dashboard' };
}

// URL notebook aktif (dengan tab opsional)
function notebookUrl(tab) {
  const slug = currentSlug || currentNotebookId || '';
  const base = '/notebook/' + encodeURIComponent(slug);
  return (tab && tab !== 'cell') ? base + '/' + tab : base;
}

// Ubah address bar tanpa memicu pemuatan ulang
function setNotebookUrl(tab, replace) {
  if (!currentNotebookId) return;
  currentTab = tab || 'cell';
  const url = notebookUrl(currentTab);
  if (window.location.pathname === url) return;
  if (replace) history.replaceState({}, '', url);
  else history.pushState({}, '', url);
}

// Pindah halaman (push) lalu terapkan rute
function goTo(path) {
  history.pushState({}, '', path);
  applyRoute();
}

// Tampilkan dashboard (daftar notebook) & putuskan koneksi notebook aktif
function showDashboard(reload = true) {
  const editor = document.getElementById('editor-view');
  const dash = document.getElementById('dashboard-view');
  if (editor) editor.classList.add('hidden');
  if (dash) dash.classList.remove('hidden');
  currentNotebookId = null;
  currentSlug = '';
  currentTab = 'cell';
  if (socket) { socket.disconnect(); socket = null; }
  if (reload) loadNotebooks();
}

// Terapkan tampilan sesuai rute di address bar
async function applyRoute() {
  const r = currentRoute();

  // Belum login: simpan tujuan, tampilkan layar masuk
  if (!token) {
    if (r.view === 'notebook' || r.view === 'new') pendingPath = window.location.pathname;
    if (window.location.pathname !== '/login') history.replaceState({}, '', '/login');
    showDashboard(false);
    renderAuthUI();
    return;
  }

  if (r.view === 'login') {
    // Sudah login tapi membuka /login → arahkan ke dashboard
    history.replaceState({}, '', '/');
    showDashboard();
    return;
  }

  if (r.view === 'new') {
    showDashboard();
    if (window.openAddModal) window.openAddModal();
    return;
  }

  if (r.view === 'dashboard') {
    showDashboard();
    return;
  }

  // r.view === 'notebook'
  await openNotebookBySlug(r.slug, r.tab);
}

// Cari notebook dari slug (id sesi / id notebook) lalu buka
async function openNotebookBySlug(slug, tab) {
  let nb = slugCache[slug];
  if (!nb) {
    try {
      const { notebooks } = await api('/notebooks');
      const me = JSON.parse(atob(token.split('.')[1]));
      slugCache = {};
      for (const n of notebooks) {
        const s = notebookSlug(n);
        // Bila slug bentrok (id sesi sama), utamakan notebook milik sendiri
        if (!slugCache[s]) slugCache[s] = n;
        else if (n.user_id === me.id && slugCache[s].user_id !== me.id) slugCache[s] = n;
      }
      nb = slugCache[slug];
    } catch (e) { /* lanjut ke fallback */ }
  }
  if (!nb) {
    // Fallback: anggap slug = ID notebook langsung
    try {
      const { notebook } = await api('/notebooks/' + encodeURIComponent(slug));
      nb = notebook;
      slugCache[slug] = nb;
    } catch (e) {
      showToast(t('toastError'), 'Notebook tidak ditemukan: ' + slug, 'error');
      history.replaceState({}, '', '/');
      showDashboard();
      return;
    }
  }
  await openNotebook(nb.id, { slug: notebookSlug(nb), tab, replace: true });
}

// Setelah login: lanjutkan ke tujuan yang tertunda, lalu terapkan rute
function completePendingRoute() {
  if (pendingPath) {
    if (window.location.pathname !== pendingPath) history.replaceState({}, '', pendingPath);
    pendingPath = null;
  }
  applyRoute();
}

// Terapkan panel tab (Cell / Files) + buka terminal bila perlu
function applyTabUI(tab, push) {
  const tabCell = document.getElementById('tab-cell');
  const tabFiles = document.getElementById('tab-files');
  const cellsPanel = document.getElementById('cells-panel');
  const filesPanel = document.getElementById('files-panel');
  const activeCls = 'flex-1 flex items-center justify-center gap-2 h-14 text-sm font-medium transition text-indigo-600';
  const idleCls = 'flex-1 flex items-center justify-center gap-2 h-14 text-sm font-medium transition text-slate-500';

  const openTerminal = (tab === 'terminal');
  currentTab = tab || 'cell';

  if (tab === 'files') {
    if (cellsPanel) cellsPanel.classList.add('hidden');
    if (filesPanel) filesPanel.classList.remove('hidden');
    if (tabFiles) tabFiles.className = activeCls;
    if (tabCell) tabCell.className = idleCls;
    currentFilePath = '';
    loadFiles();
  } else {
    if (cellsPanel) cellsPanel.classList.remove('hidden');
    if (filesPanel) filesPanel.classList.add('hidden');
    if (tabCell) tabCell.className = activeCls;
    if (tabFiles) tabFiles.className = idleCls;
  }

  if (push) setNotebookUrl(currentTab);

  if (openTerminal && socket) {
    const overlay = document.getElementById('terminal-overlay');
    if (overlay && overlay.classList.contains('hidden')) {
      window.toggleTerminal();
      syncTerminalUI();
    }
  }
}

// Samakan status tombol terminal + URL dengan kondisi overlay
function syncTerminalUI() {
  const overlay = document.getElementById('terminal-overlay');
  const isOpen = !!(overlay && !overlay.classList.contains('hidden'));
  terminalOpen = isOpen;
  const label = document.getElementById('btn-terminal-text');
  if (label) label.textContent = isOpen ? t('btnCloseTerminal') : t('btnTerminal');
  if (currentNotebookId) setNotebookUrl(isOpen ? 'terminal' : 'cell');
}

document.getElementById('btn-back').onclick = () => goTo('/');

// Add Notebook Form
function setupNotebookForm() {
  const btnAdd = document.getElementById('btn-add-notebook');
  const btnEmpty = document.getElementById('btn-empty-add');
  const modal = document.getElementById('modal-add');
  const backdrop = document.getElementById('modal-backdrop');
  const btnCancel = document.getElementById('btn-modal-cancel');
  const form = document.getElementById('form-add-notebook');

  const openModal = () => {
    modal.classList.remove('hidden');
    // Deep link: /new (hanya saat di dashboard)
    if (!currentNotebookId && window.location.pathname !== '/new') {
      history.pushState({}, '', '/new');
    }
  };
  const closeModal = () => {
    modal.classList.add('hidden');
    if (window.location.pathname === '/new') history.replaceState({}, '', '/');
  };

  // Dipakai router untuk membuka dialog dari alamat /new
  window.openAddModal = openModal;

  if (btnAdd) btnAdd.onclick = openModal;
  if (btnEmpty) btnEmpty.onclick = openModal;
  if (backdrop) backdrop.onclick = closeModal;
  if (btnCancel) btnCancel.onclick = closeModal;

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const keepAlive = fd.get('keepAlive') === 'on';
      const ftype = fd.get('type');
      try {
        await api('/notebooks', 'POST', {
          name: fd.get('name'),
          environment: fd.get('environment'),
          sessionId: fd.get('sessionId') || '',
          type: ftype,
          durationDays: ftype === 'temporary' ? (parseInt(fd.get('durationDays'), 10) || 7) : null,
          expiresAt: null,
          maxRam: fd.get('maxRam') || null,
          maxCpu: fd.get('maxCpu') || null,
          maxStorage: fd.get('maxStorage') || null,
          keepAlive
        });
        closeModal();
        form.reset();
        showToast(t('toastSuccess'), 'Notebook dibuat');
        loadNotebooks();
      } catch (err) {
        showToast(t('toastError'), err.message, 'error');
      }
    };
  }
}

// ---------------------------------------------------------------
// Cells
// ---------------------------------------------------------------
async function loadCells() {
  try {
    const { cells } = await api(`/notebooks/${currentNotebookId}/cells`);
    const container = document.getElementById('cells-container');
    container.innerHTML = '';

    for (const cell of cells) {
      const el = document.createElement('div');
      el.className = `cell-card p-0 overflow-hidden ${cell.status}`;
      const hasOutput = cell.output && cell.output.trim().length > 0;
      const hasError = cell.error_message && cell.error_message.trim().length > 0;
      const statusIcon = cell.status === 'running' ? 'fa-spinner fa-spin text-indigo-500' : cell.status === 'error' ? 'fa-circle-xmark text-red-500' : cell.status === 'completed' ? 'fa-circle-check text-emerald-500' : 'fa-play text-slate-400';
      const statusBg = cell.status === 'running' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' : cell.status === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : cell.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200';
      const isFirst = cell.order_index === 0;
      const isLast = cell.order_index === cells.length - 1;
      el.innerHTML = `
        <div class="flex items-center gap-1 px-3 py-2 border-b border-slate-200 bg-slate-50">
          <span class="text-xs font-mono text-slate-400 w-6 text-center shrink-0">#${cell.order_index + 1}</span>
          <button class="w-9 h-9 rounded-lg ${statusBg} flex items-center justify-center transition shrink-0" title="${t('btnStart')} / Stop" onclick="window.startCell('${cell.id}')">
            <i class="fa-solid ${statusIcon} text-sm"></i>
          </button>
          <div class="flex-1"></div>
          <div class="flex items-center gap-0.5">
            <button class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 flex items-center justify-center transition" title="Pindah ke atas" ${isFirst ? 'disabled' : ''} onclick="window.moveCell('${cell.id}', -1)">
              <i class="fa-solid fa-arrow-up text-xs"></i>
            </button>
            <button class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 flex items-center justify-center transition" title="Pindah ke bawah" ${isLast ? 'disabled' : ''} onclick="window.moveCell('${cell.id}', 1)">
              <i class="fa-solid fa-arrow-down text-xs"></i>
            </button>
            <button class="w-8 h-8 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-600 flex items-center justify-center transition" title="Duplikat" onclick="window.duplicateCell('${cell.id}')">
              <i class="fa-solid fa-copy text-xs"></i>
            </button>
            <button class="w-8 h-8 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition" title="Hapus" onclick="window.deleteCell('${cell.id}')">
              <i class="fa-solid fa-trash text-xs"></i>
            </button>
          </div>
        </div>

        <!-- ZONA ATAS: editor kode (tap 2x di sini untuk keyboard) -->
        <div class="cell-code p-4">
          <textarea id="code-${escapeHtml(cell.id)}" spellcheck="false" placeholder="${t('codePlaceholder')}"
            class="w-full mono text-sm text-slate-700 bg-white border border-slate-200 rounded-lg p-3 min-h-[120px] sm:min-h-[160px] resize-y focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none">${escapeHtml(cell.code || '')}</textarea>
        </div>

        <!-- SEKAT: garis pemisah dengan label -->
        <div class="cell-divider"><span>Output</span></div>

        <!-- ZONA BAWAH: output (ketukan di sini TIDAK memengaruhi kode) -->
        <div id="output-${escapeHtml(cell.id)}" class="cell-output-zone p-4 min-h-[64px] bg-slate-50">
          ${hasOutput ? `<div class="text-sm font-mono text-slate-600 whitespace-pre-wrap break-words">${escapeHtml(cell.output)}</div>` : ''}
          ${hasError ? `<div class="text-sm font-mono text-red-600 bg-red-50 p-2 rounded border border-red-100 mt-1">${escapeHtml(cell.error_message)}</div>` : ''}
          ${(!hasOutput && !hasError) ? `<div class="text-xs text-slate-400 select-none">${t('outputEmpty')}</div>` : ''}
        </div>
      `;
      container.appendChild(el);
    }
    // Setup stdin zone & language selector untuk setiap cell
    setupCellStdin();
    setupCellLanguageSelector();
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}

// Jalankan cell: simpan kode dulu via REST, lalu emit via socket
async function startCell(cellId) {
  try {
    const ta = document.getElementById(`code-${cellId}`);
    const code = ta ? ta.value : '';

    // 1. Simpan kode yang diedit user
    await api(`/cells/${cellId}`, 'PUT', { code });

    // 2. Ambil konfigurasi notebook untuk resource limit & environment
    const { notebook } = await api(`/notebooks/${currentNotebookId}`);
    if (!socket) {
      showToast(t('toastError'), 'Socket tidak terhubung');
      return;
    }

    // 3. Tandai UI sedang berjalan
    await loadCells();
    const outEl = document.getElementById(`output-${cellId}`);
    if (outEl) outEl.innerHTML = '<div class="text-xs text-slate-400 select-none">Menjalankan...</div>';

    // 4. Emit eksekusi ke server (Podman)
    socket.emit('cell:execute', {
      cellId,
      notebookId: currentNotebookId,
      code,
      language: notebook.environment,
      environment: notebook.environment,
      memory: notebook.max_ram,
      cpus: notebook.max_cpu,
      storage: notebook.max_storage,
      keepAlive: notebook.keep_alive === 1
    });
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}

window.startCell = startCell;

// Tambah cell baru (urutan = jumlah cell saat ini)
async function addCell() {
  try {
    const { cells } = await api(`/notebooks/${currentNotebookId}/cells`);
    await api(`/notebooks/${currentNotebookId}/cells`, 'POST', {
      code: '',
      language: null,
      orderIndex: cells.length
    });
    await loadCells();
    showToast(t('toastSuccess'), 'Cell baru ditambahkan');
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}
window.addCell = addCell;
window.loadCells = loadCells;

// Pindah cell ke atas/bawah
async function moveCell(cellId, direction) {
  try {
    await api(`/cells/${cellId}/move`, 'PUT', { direction });
    await loadCells();
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}
window.moveCell = moveCell;

// Duplikat cell
async function duplicateCell(cellId) {
  try {
    await api(`/cells/${cellId}/duplicate`, 'POST');
    await loadCells();
    showToast(t('toastSuccess'), 'Cell diduplikat');
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}
window.duplicateCell = duplicateCell;

// Hapus cell
async function deleteCell(cellId) {
  if (!confirm('Hapus cell ini?')) return;
  try {
    await api(`/cells/${cellId}`, 'DELETE');
    await loadCells();
    showToast(t('toastSuccess'), 'Cell dihapus');
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}
window.deleteCell = deleteCell;

// Run All cells
async function runAllCells() {
  try {
    const { cells } = await api(`/notebooks/${currentNotebookId}/cells`);
    const runnable = cells.filter(c => c.deleted_at === null);
    if (!runnable.length) { showToast(t('toastError'), 'Tidak ada cell untuk dijalankan', 'error'); return; }
    for (const cell of runnable) {
      const ta = document.getElementById(`code-${cell.id}`);
      if (ta) await api(`/cells/${cell.id}`, 'PUT', { code: ta.value });
    }
    await loadCells();
    for (const cell of runnable) {
      const { notebook } = await api(`/notebooks/${currentNotebookId}`);
      socket.emit('cell:execute', {
        cellId: cell.id,
        notebookId: currentNotebookId,
        code: (document.getElementById(`code-${cell.id}`) || {}).value || cell.code || '',
        language: notebook.environment,
        environment: notebook.environment,
        memory: notebook.max_ram,
        cpus: notebook.max_cpu,
        storage: notebook.max_storage,
        keepAlive: notebook.keep_alive === 1
      });
    }
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}
window.runAllCells = runAllCells;

// Stop semua cell yang berjalan
async function stopAllCells() {
  try {
    socket.emit('cell:stopAll', { notebookId: currentNotebookId });
    showToast(t('toastSuccess'), 'Semua cell dihentikan');
  } catch (err) {
    showToast(t('toastError'), err.message, 'error');
  }
}
window.stopAllCells = stopAllCells;

// ---------------------------------------------------------------
// Notebook menu (titik tiga)
// ---------------------------------------------------------------
window.toggleNotebookMenu = (e, id) => {
  e.stopPropagation();
  const menu = document.getElementById(`nb-menu-${id}`);
  const wasHidden = menu.classList.contains('hidden');
  // Tutup semua menu lain
  document.querySelectorAll('[id^="nb-menu-"]').forEach(m => m.classList.add('hidden'));
  if (wasHidden) menu.classList.remove('hidden');
};

window.renameNotebook = async (id) => {
  const nb = await api(`/notebooks/${id}`);
  const name = prompt('Nama baru:', nb.notebook.name);
  if (!name || !name.trim()) return;
  try {
    await api(`/notebooks/${id}`, 'PUT', { name: name.trim() });
    showToast(t('toastSuccess'), 'Nama notebook diubah');
    loadNotebooks();
  } catch (err) { showToast(t('toastError'), err.message, 'error'); }
};

window.duplicateNotebook = async (id) => {
  if (!confirm('Duplikat notebook ini?')) return;
  try {
    await api(`/notebooks/${id}/duplicate`, 'POST');
    showToast(t('toastSuccess'), 'Notebook diduplikat');
    loadNotebooks();
  } catch (err) { showToast(t('toastError'), err.message, 'error'); }
};

// Tutup notebook menu saat klik di luar
document.addEventListener('click', () => {
  document.querySelectorAll('[id^="nb-menu-"]').forEach(m => m.classList.add('hidden'));
});

// ---------------------------------------------------------------
// Socket.io
// ---------------------------------------------------------------
function initSocket() {
  if (socket) return;
  // Same-origin agar tetap jalan walau diakses dari IP LAN / hostname lain
  socket = io(window.location.origin, {
    auth: { token },
    transports: ['websocket', 'polling']
  });

  socket.on('connect', () => {
    socket.emit('notebook:join', { notebookId: currentNotebookId });
  });

  socket.on('cell:output', (data) => {
    if (data.notebookId !== currentNotebookId) return;
    // Streaming: tambahkan chunk ke output cell tanpa reload seluruh list
    const out = document.getElementById(`output-${data.cellId}`);
    if (out) {
      if (data.chunk) {
        const span = document.createElement('span');
        span.className = data.stream === 'stderr' ? 'text-red-600' : '';
        span.textContent = data.chunk;
        out.appendChild(span);
        out.classList.remove('hidden');
      }
    } else {
      // Fallback: reload penuh
      loadCells();
    }
  });

  socket.on('cell:executed', (data) => {
    loadCells();
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
  });
}

// ---------------------------------------------------------------
// Terminal Toggle (overlay & tombol) — logika render di public/terminal.js
// ---------------------------------------------------------------
function setupTerminal() {
  const btnToggle = document.getElementById('btn-toggle-terminal');
  const btnClose = document.getElementById('btn-close-terminal');

  btnToggle.onclick = () => {
    window.toggleTerminal();
    syncTerminalUI();
  };

  btnClose.onclick = () => {
    window.toggleTerminal();
    syncTerminalUI();
  };
}

// ---------------------------------------------------------------
// Environment Selector
// ---------------------------------------------------------------
async function loadEnvironments() {
  try {
    const { environments } = await api('/environments');
    const select = document.getElementById('env-selector');
    select.innerHTML = environments.map(env => `<option value="${escapeHtml(env)}">${escapeHtml(env)}</option>`).join('');
  } catch (err) {
    // silent
  }
}
document.getElementById('btn-refresh-env').onclick = loadEnvironments;

// ---------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------
async function loadNotifications() {
  try {
    const { notifications } = await api('/notifications');
    const list = document.getElementById('notification-list');
    const badge = document.getElementById('notification-badge');
    if (!list) return;

    list.innerHTML = '';
    if (notifications.length === 0) {
      list.innerHTML = `<div class="text-xs text-slate-400 text-center py-4">${t('notifEmpty')}</div>`;
      badge.classList.add('hidden');
    } else {
      badge.classList.remove('hidden');
      badge.textContent = notifications.length;
      for (const n of notifications) {
        const el = document.createElement('div');
        el.className = 'flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100';
        el.innerHTML = `
          <div class="w-2 h-2 rounded-full mt-1 ${n.type === 'warning' ? 'bg-amber-500' : n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'}"></div>
          <div class="flex-1">
            <div class="text-sm text-slate-900 font-medium">${escapeHtml(n.message)}</div>
            <div class="text-xs text-slate-500 mt-1">${n.created_at}</div>
          </div>
          <button class="text-xs text-indigo-600 hover:text-indigo-700" onclick="window.markNotifRead('${n.id}')">${t('notifRead')}</button>
        `;
        list.appendChild(el);
      }
    }
  } catch (err) {
    // silent
  }
}

window.markNotifRead = async (id) => {
  try {
    await api(`/notifications/${id}/read`, 'POST');
    loadNotifications();
  } catch (err) {
    // silent
  }
};

// Notifikasi dropdown
function setupNotifDropdown() {
  const btn = document.getElementById('nav-notif');
  const d = document.getElementById('notif-dropdown');
  if (!btn || !d) return;

  btn.onclick = (e) => {
    e.stopPropagation();
    d.classList.toggle('hidden');
    if (!d.classList.contains('hidden')) loadNotifications();
  };

  document.addEventListener('click', (e) => {
    if (!d.classList.contains('hidden') && !d.contains(e.target) && e.target !== btn) {
      d.classList.add('hidden');
    }
  });
}

// ---------------------------------------------------------------
// Shared Session UI
// ---------------------------------------------------------------
async function loadSharedSession() {
  if (!currentNotebookId) return;
  try {
    const { notebook } = await api(`/notebooks/${currentNotebookId}`);
    const panel = document.getElementById('shared-session-panel');
    if (!notebook.session_id) {
      panel.classList.add('hidden');
      return;
    }
    panel.classList.remove('hidden');
    document.getElementById('session-id-badge').textContent = notebook.session_id;

    const { notebooks } = await api(`/session/${notebook.session_id}/notebooks`);
    const list = document.getElementById('session-notebooks');
    list.innerHTML = '';
    if (notebooks.length <= 1) {
      list.innerHTML = `<div class="text-xs text-slate-400 text-center py-4">${t('sessionNoNotebooks')}</div>`;
    } else {
      for (const nb of notebooks) {
        if (nb.id === currentNotebookId) continue;
        const el = document.createElement('div');
        el.className = 'flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100';
        el.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
              <i class="fa-solid fa-book text-xs"></i>
            </div>
            <div>
              <div class="text-sm text-slate-900 font-medium">${escapeHtml(nb.name)}</div>
              <div class="text-xs text-slate-500">${nb.owner_email || nb.user_id}</div>
            </div>
          </div>
          <span class="text-xs font-medium text-slate-400 bg-slate-200 px-2 py-1 rounded">${nb.environment}</span>
        `;
        list.appendChild(el);
      }
    }

    const { resources } = await api(`/session/${notebook.session_id}/resources`);
    const resList = document.getElementById('session-resources');
    resList.innerHTML = '';
    if (resources.length === 0) {
      resList.innerHTML = `<div class="text-xs text-slate-400 text-center py-4">Belum ada file dibagikan</div>`;
    } else {
      for (const r of resources) {
        const el = document.createElement('div');
        el.className = 'flex items-center justify-between p-2 rounded bg-white border border-slate-100';
        el.innerHTML = `
          <div class="flex items-center gap-2">
            <i class="fa-solid fa-file text-slate-400 text-xs"></i>
            <span class="text-sm text-slate-700">${escapeHtml(r.filename)}</span>
          </div>
          <span class="text-xs text-slate-500">${(r.file_size / 1024).toFixed(1)} KB</span>
        `;
        resList.appendChild(el);
      }
    }
  } catch (err) {
    // silent
  }
}

// ---------------------------------------------------------------
// Mobile shortcut bar
// ---------------------------------------------------------------
function isMobile() { return window.innerWidth <= 640; }
window.addEventListener('resize', () => {
  const bar = document.getElementById('mobile-shortcut-bar');
  if (isMobile()) bar.classList.remove('hidden');
  else bar.classList.add('hidden');
});

// ---------------------------------------------------------------
// Language toggle (tombol ada di dalam modal Pengaturan)
// ---------------------------------------------------------------
// (wiring dilakukan oleh setupSettings agar tetap sinkron saat modal dibuat)

// ---------------------------------------------------------------
// Tema (4 pilihan) + Pengaturan
// ---------------------------------------------------------------
const THEMES = ['light', 'dark', 'ocean', 'sunset'];

function applyTheme(theme) {
  if (!THEMES.includes(theme)) theme = 'light';
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('zelly-theme', theme);
  document.querySelectorAll('.theme-card').forEach((c) => {
    c.classList.toggle('active', c.dataset.theme === theme);
  });
}

function setupSettings() {
  const modal = document.getElementById('modal-settings');
  const grid = document.getElementById('theme-grid');
  if (!modal || !grid) return;

  const openModal = () => modal.classList.remove('hidden');
  const closeModal = () => modal.classList.add('hidden');

  // Dipakai router untuk membuka dialog
  window.openSettings = openModal;

  const btn = document.getElementById('btn-settings');
  if (btn) btn.onclick = openModal;
  const backdrop = document.getElementById('settings-backdrop');
  if (backdrop) backdrop.onclick = closeModal;
  const btnClose = document.getElementById('btn-settings-close');
  if (btnClose) btnClose.onclick = closeModal;

  // Kartu tema
  grid.innerHTML = THEMES.map((th) => `
    <button type="button" class="theme-card flex items-center gap-3 p-3 rounded-xl border transition text-left" data-theme="${th}">
      <span class="theme-swatch theme-swatch-${th} w-9 h-9 rounded-lg shrink-0"></span>
      <span class="theme-label text-sm font-medium text-slate-700">${t('theme_' + th)}</span>
    </button>
  `).join('');
  grid.querySelectorAll('.theme-card').forEach((c) => {
    c.onclick = () => applyTheme(c.dataset.theme);
  });

  // Bahasa
  document.querySelectorAll('.lang-btn').forEach((b) => {
    b.classList.toggle('active', b.dataset.lang === currentLang);
    b.onclick = () => setLang(b.dataset.lang);
  });

  // Terapkan tema tersimpan
  applyTheme(localStorage.getItem('zelly-theme') || 'light');
}

// Profile menu
function setupProfileMenu() {
  const btn = document.getElementById('nav-profile');
  const dropdown = document.getElementById('profile-dropdown');
  if (!btn || !dropdown) return;

  btn.onclick = (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('hidden');
  };

  // Tutup saat klik di luar
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target) && e.target !== btn) {
      dropdown.classList.add('hidden');
    }
  });
}

// Bind action toolbar buttons
function setupActionToolbar() {
  const btnRunAll = document.getElementById('btn-run-all');
  if (btnRunAll) btnRunAll.onclick = runAllCells;
  const btnStopAll = document.getElementById('btn-stop-all');
  if (btnStopAll) btnStopAll.onclick = stopAllCells;
  const btnAddCell = document.getElementById('btn-add-cell');
  if (btnAddCell) btnAddCell.onclick = addCell;
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
function renderAll() {
  renderAuthUI();
  if (token) {
    loadNotebooks();
    loadEnvironments();
    if (notificationInterval) clearInterval(notificationInterval);
    notificationInterval = setInterval(loadNotifications, 30000);
    loadNotifications();
  }
}

// Perpanjang sesi tiap kali aplikasi dibuka (token aktif ditukar baru, 30 hari)
async function refreshSession() {
  try {
    const data = await api('/auth/refresh', 'POST');
    token = data.token;
    localStorage.setItem('zelly-token', token);
  } catch (err) {
    // Token gugur/hilang: biar renderAll yang mengangkat layar login
  }
}

// Ketuk/klik area cell (termasuk output) untuk mulai menulis kode:
// - HP: ketuk 2x cepat → muncul keyboard on-screen
// - PC: 1 klik → langsung fokus, ketik pakai keyboard fisik
// Deteksi perangkat sentuh: peristiwa touchstart nyata ATAU pointer coarse
// (bukan 'ontouchstart' di window — laptop touchscreen ikut punya itu)
function setupCellEvents() {
  const container = document.getElementById('cells-container');
  if (!container) return;

  // Di HP, fokus sejak touchstart (lebih permissif) + touchend + click, supaya keyboard
  // virtual selalu muncul walau ketuk terjadi di area output (bukan langsung di textarea).
  container.addEventListener('touchstart', (e) => {
    if (e.target.closest('textarea')) return;
    const card = e.target.closest('.cell-card');
    if (!card) return;
    const ta = card.querySelector('textarea');
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, { passive: true });

  container.addEventListener('click', (e) => {
    // Ketukan di dalam textarea: biarkan native (pemposisian kursor bebas)
    if (e.target.closest('textarea')) return;
    const card = e.target.closest('.cell-card');
    if (!card) return;
    const ta = card.querySelector('textarea');
    if (!ta) return;

    // 1 ketukan/klik di mana pun pada cell → keyboard langsung muncul
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length); // kursor di akhir kode
  });

  // Percepat di HP: fokus saat jari diangkat (sebelum klik sintesis),
  // tanpa preventDefault agar klik tetap mengalir normal
  container.addEventListener('touchend', (e) => {
    if (e.target.closest('textarea')) return;
    const card = e.target.closest('.cell-card');
    if (!card) return;
    const ta = card.querySelector('textarea');
    if (!ta) return;
    ta.focus();
    ta.setSelectionRange(ta.value.length, ta.value.length);
  }, { passive: true });
}

function init() {
  applyStaticTexts();
  setupAuthEvents();
  setupNotifDropdown();
  setupNotebookForm();
  setupTerminal();
  setupCellEvents();
  setupFiles();
  setupTabs();
  setupSettings();
  setupProfileMenu();
  setupActionToolbar();
  setupNotebookSettings();
  setupFileEditor();

  // Tampil/hilangkan pilihan durasi saat tipe Temporary dipilih
  const typeSelect = document.querySelector('#form-add-notebook select[name="type"]');
  if (typeSelect) {
    typeSelect.onchange = () => {
      const d = document.getElementById('duration-wrap');
      if (d) d.classList.toggle('hidden', typeSelect.value !== 'temporary');
    };
  }
  renderAll();
  if (token) refreshSession();

  // Routing: terapkan tampilan sesuai address bar + dukung tombol Back/Forward browser
  applyRoute();
  window.addEventListener('popstate', () => applyRoute());
}

init();
