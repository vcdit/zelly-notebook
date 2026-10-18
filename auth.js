'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { runUsers, allUsers, getUsers } = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'zelly_super_secret_change_me';
const SALT_ROUNDS = 10;

// ---------------------------------------------------------------
// Register user baru. User pertama otomatis jadi 'owner'.
// ---------------------------------------------------------------
function register({ email, password, name }) {
  const existing = getUsers('SELECT id FROM users WHERE email = ?', [email]);
  if (existing && (Array.isArray(existing) ? existing.length > 0 : true)) throw new Error('Email sudah terdaftar');

  const count = allUsers('SELECT id FROM users').length;
  const role = count === 0 ? 'owner' : 'member';

  const password_hash = bcrypt.hashSync(password, SALT_ROUNDS);
  runUsers(
    'INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, ?)',
    [email, password_hash, name || email, role]
  );

  // Ambil kembali user yang barusan dibuat (id auto-generated oleh SQLite)
  const user = getUsers('SELECT * FROM users WHERE email = ?', [email]);
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

// ---------------------------------------------------------------
// Login. Kembalikan user + JWT token.
// ---------------------------------------------------------------
function login({ email, password }) {
  const user = getUsers('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) throw new Error('Email atau password salah');

  const valid = bcrypt.compareSync(password, user.password_hash);
  if (!valid) throw new Error('Email atau password salah');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    token
  };
}

// ---------------------------------------------------------------
// Middleware verifikasi JWT dari header Authorization: Bearer <token>
// ---------------------------------------------------------------
function authenticate(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) token = authHeader.slice(7);
  else if (req.query && req.query.token) token = req.query.token;
  if (!token) return res.status(401).json({ error: 'Token tidak ada' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token tidak valid' });
  }
}

// ---------------------------------------------------------------
// Hanya owner yang boleh melewati middleware ini
// ---------------------------------------------------------------
function requireOwner(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Login dulu' });
  if (req.user.role !== 'owner') {
    return res.status(403).json({ error: 'Hanya owner yang boleh melakukan ini' });
  }
  next();
}

// ---------------------------------------------------------------
// Cek apakah user boleh mengakses notebook (pemilik atau owner)
// ---------------------------------------------------------------
function canAccessNotebook(userId, role, notebookUserId) {
  if (role === 'owner') return true;
  return userId === notebookUserId;
}

// Perpanjang sesi: verifikasi token lama (masih valid), keluarkan token baru 30 hari.
// Dipanggil frontend setiap kali aplikasi dibuka — user aktif tidak pernah ke-logout otomatis.
function refreshToken(oldToken) {
  let decoded;
  try {
    decoded = jwt.verify(oldToken, JWT_SECRET);
  } catch (err) {
    throw new Error('Sesi kedaluwarsa, silakan masuk lagi');
  }
  const user = getUsers('SELECT * FROM users WHERE id = ?', [decoded.id]);
  if (!user) throw new Error('Akun tidak ditemukan');

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '30d' }
  );
  return { id: user.id, email: user.email, name: user.name, role: user.role, token };
}

module.exports = {
  register,
  login,
  refreshToken,
  authenticate,
  requireOwner,
  canAccessNotebook,
  JWT_SECRET
};
