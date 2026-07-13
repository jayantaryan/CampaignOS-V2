// ─── Database Initialization (sql.js – pure JS SQLite) ─────────────────────
import initSqlJs from 'sql.js';
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'campaignos.db');

let db;

/**
 * Initialize (or load) the SQLite database.
 * Must be called once at startup before any queries.
 */
export async function initDatabase() {
  const SQL = await initSqlJs();

  // Load existing database file if it exists
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // Create tables
  db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT    NOT NULL,
      product     TEXT,
      objective   TEXT,
      audience    TEXT,
      budget      INTEGER DEFAULT 0,
      startDate   TEXT,
      endDate     TEXT,
      status      TEXT    DEFAULT 'pending',
      finalBudget INTEGER,
      finalStatus TEXT,
      explanation TEXT,
      createdAt   TEXT    DEFAULT (datetime('now')),
      updatedAt   TEXT    DEFAULT (datetime('now'))
    );
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS agent_results (
      id                INTEGER PRIMARY KEY AUTOINCREMENT,
      campaignId        INTEGER NOT NULL,
      agentName         TEXT    NOT NULL,
      recommendedBudget INTEGER,
      status            TEXT,
      reason            TEXT,
      confidence        REAL,
      createdAt         TEXT    DEFAULT (datetime('now')),
      FOREIGN KEY (campaignId) REFERENCES campaigns(id)
    );
  `);

  persist();
  console.log('✅  Database initialized at', DB_PATH);
  return db;
}

/**
 * Persist the in-memory database to disk.
 */
function persist() {
  try {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  } catch (err) {
    console.error('DB persist error:', err);
  }
}

// ─── Query Helpers ──────────────────────────────────────────────────────────

/**
 * Run a write statement (INSERT, UPDATE, DELETE) and persist.
 * Returns { changes, lastId }.
 */
export function run(sql, params = []) {
  db.run(sql, params);
  const lastId = db.exec('SELECT last_insert_rowid() AS id')[0]?.values[0][0] || 0;
  persist();
  return { changes: db.getRowsModified(), lastId };
}

/**
 * Query rows. Returns an array of plain objects.
 */
export function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/**
 * Query a single row. Returns a plain object or null.
 */
export function get(sql, params = []) {
  const rows = all(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

export function getDb() {
  return db;
}
