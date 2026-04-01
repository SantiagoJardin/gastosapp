import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'gastos_app_secret_master_key_123';

// Middleware
app.use(cors());
app.use(express.json());

// Serve static Vite files in production
app.use(express.static(join(__dirname, 'dist')));

// Database setup
const dataDir = process.env.DATA_DIR || __dirname;
const dbPath = join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err);
  } else {
    console.log('Connected to SQLite database.');
    
    // Create tables
    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS categories (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          color TEXT NOT NULL,
          iconName TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS expenses (
          id TEXT PRIMARY KEY,
          amount REAL NOT NULL,
          note TEXT,
          categoryId TEXT NOT NULL,
          date TEXT NOT NULL,
          type TEXT DEFAULT 'expense',
          FOREIGN KEY (categoryId) REFERENCES categories(id)
        )
      `);

      // Check if categories are empty, if so, seed them
      db.get('SELECT COUNT(*) as count FROM categories', (err, row) => {
        if (!err && row.count === 0) {
          const defaultCategories = [
            { id: 'cat-1', name: 'Comida', color: '#ec4899', iconName: 'utensils' },
            { id: 'cat-2', name: 'Transporte', color: '#3b82f6', iconName: 'car' },
            { id: 'cat-3', name: 'Entretenimiento', color: '#8b5cf6', iconName: 'gamepad-2' },
            { id: 'cat-4', name: 'Hogar', color: '#10b981', iconName: 'home' },
          ];
          
          const stmt = db.prepare('INSERT INTO categories (id, name, color, iconName) VALUES (?, ?, ?, ?)');
          defaultCategories.forEach(cat => {
            stmt.run(cat.id, cat.name, cat.color, cat.iconName);
          });
          stmt.finalize();
          console.log('Seeded default categories');
        }
      });
    });
  }
});

// --- API ROUTES ---

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Acceso denegado. Token no provisto.' });
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido o expirado.' });
    req.user = user;
    next();
  });
};

// Auth routes
app.get('/api/auth/setup-status', (req, res) => {
  db.get('SELECT COUNT(*) as count FROM users', (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ isSetup: row.count > 0 });
  });
});

app.post('/api/auth/setup', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Faltan datos requeridos.' });

  db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row.count > 0) return res.status(400).json({ error: 'La cuenta maestra ya está configurada.' });

    try {
      const hash = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)');
      stmt.run(username, hash, function (insertErr) {
        if (insertErr) return res.status(500).json({ error: insertErr.message });
        res.status(201).json({ success: true, message: 'Cuenta maestra creada correctamente.' });
      });
      stmt.finalize();
    } catch (hashError) {
      res.status(500).json({ error: 'Error encriptando la contraseña.' });
    }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Usuario incorrecto.' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ error: 'Contraseña incorrecta.' });

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, username: user.username });
  });
});

// Expenses
app.get('/api/expenses', authenticateToken, (req, res) => {
  db.all('SELECT * FROM expenses ORDER BY date DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/expenses', authenticateToken, (req, res) => {
  const { id, amount, note, categoryId, date, type = 'expense' } = req.body;
  if (!id || amount == null || !categoryId || !date) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare('INSERT INTO expenses (id, amount, note, categoryId, date, type) VALUES (?, ?, ?, ?, ?, ?)');
  stmt.run(id, amount, note, categoryId, date, type, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, id });
  });
  stmt.finalize();
});

app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM expenses WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// Categories
app.get('/api/categories', authenticateToken, (req, res) => {
  db.all('SELECT * FROM categories', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/categories', authenticateToken, (req, res) => {
  const { id, name, color, iconName } = req.body;
  if (!id || !name || !color || !iconName) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const stmt = db.prepare('INSERT INTO categories (id, name, color, iconName) VALUES (?, ?, ?, ?)');
  stmt.run(id, name, color, iconName, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ success: true, id });
  });
  stmt.finalize();
});

app.delete('/api/categories/:id', authenticateToken, (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM categories WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    
    // Also delete associated expenses? User didn't specify cascade, but let's keep it simple
    res.json({ success: true, deleted: this.changes });
  });
});

// React Catch-all route for frontend handling
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
