import { open } from "sqlite";
import sqlite3 from "sqlite3";
import fs from "node:fs";
import path from "node:path";
import { config } from "./config.js";

/**
 * Return a connected sqlite database (sqlite package, promise-based).
 * Uses DB_PATH from env.
 */
export async function getDb(dbPath = config.dbPath) {
  const dir = path.dirname(dbPath);
  if (dir && dir !== "." && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  await db.exec("PRAGMA foreign_keys = ON;");
  return db;
}

/**
 * Run a function within a transaction.
 * NOTE: For concurrency safety on SQLite, candidates can consider:
 * - BEGIN IMMEDIATE to acquire a reserved lock early
 * - or atomic UPDATE ... WHERE stock >= qty
 */
export async function withTransaction(db, fn) {
  await db.exec("BEGIN IMMEDIATE;");
  try {
    const result = await fn();
    await db.exec("COMMIT;");
    return result;
  } catch (err) {
    await db.exec("ROLLBACK;");
    throw err;
  }
}
