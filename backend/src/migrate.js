import fs from "node:fs";
import { getDb } from "./db.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = await getDb();
const schemaSql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");

await db.exec(schemaSql);
console.log("Migration done.");
await db.close();
