import sqlite3 from "sqlite3";
import { open } from "sqlite";

export async function openDb() {
  return open({
    filename: "./database.db",
    driver: sqlite3.Database,
  });
}

export async function initializeDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT,
      method TEXT,
      url TEXT,
      headers TEXT,
      data TEXT,
      status INTEGER,
      response TEXT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS session_metrics (
      session_id TEXT PRIMARY KEY,
      total_requests INTEGER DEFAULT 0,
      requests_per_second REAL DEFAULT 0,
      average_response_time REAL DEFAULT 0,
      error_percentage REAL DEFAULT 0,
      total_time REAL DEFAULT 0
    )
  `);
}
