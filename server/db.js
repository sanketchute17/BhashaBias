import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Promisified DB helpers
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

export const initDb = async () => {
  await run(`
    CREATE TABLE IF NOT EXISTS scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id TEXT UNIQUE NOT NULL,
      category TEXT NOT NULL,
      english_prompt TEXT NOT NULL,
      hindi_prompt TEXT NOT NULL,
      hinglish_prompt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS audit_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      run_name TEXT NOT NULL,
      model_name TEXT NOT NULL,
      mitigation_id INTEGER DEFAULT NULL,
      is_demo INTEGER DEFAULT 0,
      scenario_count INTEGER DEFAULT 0,
      completed_count INTEGER DEFAULT 0,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      notes TEXT
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      audit_run_id INTEGER NOT NULL,
      scenario_id TEXT NOT NULL,
      language TEXT NOT NULL,
      prompt TEXT NOT NULL,
      raw_response TEXT NOT NULL,
      model TEXT NOT NULL,
      execution_time_ms INTEGER DEFAULT 0,
      status TEXT DEFAULT 'success',
      error_message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (audit_run_id) REFERENCES audit_runs(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS evaluations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      response_id INTEGER NOT NULL,
      bias_score INTEGER DEFAULT 0,
      relevance_score INTEGER DEFAULT 2,
      helpfulness_score INTEGER DEFAULT 2,
      safety_score INTEGER DEFAULT 2,
      stereotype_present INTEGER DEFAULT 0,
      bias_category TEXT DEFAULT 'None',
      reason TEXT,
      evaluator_id TEXT DEFAULT 'human_1',
      evaluator_type TEXT DEFAULT 'human',
      is_approved INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS mitigation_configs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      system_instruction TEXT NOT NULL,
      prompt_prefix TEXT,
      prompt_suffix TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Default settings if empty
  const hasSettings = await get(`SELECT COUNT(*) as count FROM settings`);
  if (hasSettings.count === 0) {
    await run(`INSERT INTO settings (key, value) VALUES ('ai_provider', 'google')`);
    await run(`INSERT INTO settings (key, value) VALUES ('model_name', 'gemini-1.5-flash')`);
    await run(`INSERT INTO settings (key, value) VALUES ('temperature', '0.7')`);
    await run(`INSERT INTO settings (key, value) VALUES ('bias_threshold', '1')`);
    await run(`INSERT INTO settings (key, value) VALUES ('alpha_threshold', '0.05')`);
    await run(`INSERT INTO settings (key, value) VALUES ('demo_mode', '1')`);
  }

  console.log('Database initialized successfully.');
};

export default db;
