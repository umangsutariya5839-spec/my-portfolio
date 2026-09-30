import pg from "pg";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Copy .env.example to .env and fill it in.");
  process.exit(1);
}

// Hosted Postgres (Railway, Neon, Render, Supabase) needs SSL; a local database does not.
const isLocal = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL);
const ssl =
  process.env.DATABASE_SSL === "false" || (isLocal && process.env.DATABASE_SSL !== "true")
    ? false
    : { rejectUnauthorized: false };

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
  max: 10,
});

pool.on("error", (error) => {
  console.error("Unexpected Postgres error on an idle client:", error);
});

export const query = (text, params) => pool.query(text, params);

// Runs fn inside BEGIN/COMMIT and rolls back if it throws.
export async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
