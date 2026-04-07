const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// DB stored inside the project under /data/
const DATA_DIR = path.join(__dirname, '..', '..', 'data');
const DB_PATH = path.join(DATA_DIR, 'inventory.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

// Ensure /data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('[DB] Failed to connect:', err.message);
    process.exit(1);
  }
  console.log('[DB] Connected to SQLite');
});

// Enable WAL mode and foreign keys, then initialize schema
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');
  db.run('PRAGMA journal_mode = WAL');

  const schema = fs.readFileSync(SCHEMA_PATH, 'utf-8');
  const statements = schema.split(';').map(s => s.trim()).filter(s => s.length > 0);
  statements.forEach(stmt => {
    db.run(stmt, (err) => {
      if (err) console.error('[DB] Schema error:', err.message);
    });
  });
});

// Promisified helpers
db.asyncGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)));
  });

db.asyncAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)));
  });

db.asyncRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err);
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

module.exports = db;
