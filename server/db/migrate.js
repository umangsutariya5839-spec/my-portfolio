import "dotenv/config";
import { readFile } from "node:fs/promises";
import { pool } from "../src/db.js";

const sql = await readFile(new URL("./schema.sql", import.meta.url), "utf8");

try {
  await pool.query(sql);
  console.log("Schema is up to date.");
} catch (error) {
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
