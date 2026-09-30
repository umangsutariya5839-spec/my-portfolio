import { Router } from "express";
import { query, withTransaction } from "../db.js";
import { requireAdmin } from "../middleware/auth.js";
import { HttpError, pickFields, rowToJson, slugify } from "../utils.js";

// Builds list / get / create / update / delete / reorder routes for one table.
// Reads are public; every write needs the admin token.
export function crudRouter({ table, schema, orderBy = "sort_order, id", slugFrom }) {
  const router = Router();
  const idParam = (req) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) throw new HttpError(400, "Invalid id.");
    return id;
  };

  router.get("/", async (_req, res) => {
    const { rows } = await query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
    res.json(rows.map(rowToJson));
  });

  // Accepts a numeric id, or a slug on tables that have one.
  router.get("/:id", async (req, res) => {
    const key = req.params.id;
    const bySlug = slugFrom && !/^\d+$/.test(key);
    const { rows } = await query(
      `SELECT * FROM ${table} WHERE ${bySlug ? "slug" : "id"} = $1`,
      [bySlug ? key : Number(key)]
    );
    if (!rows.length) throw new HttpError(404, "Not found.");
    res.json(rowToJson(rows[0]));
  });

  router.post("/", requireAdmin, async (req, res) => {
    const body = { ...req.body };
    if (slugFrom && !body.slug && body[slugFrom]) body.slug = slugify(body[slugFrom]);
    const { columns, values } = pickFields(body, schema, { creating: true });
    if (!columns.includes("sort_order")) {
      const { rows } = await query(`SELECT COALESCE(MAX(sort_order), -1) + 1 AS next FROM ${table}`);
      columns.push("sort_order");
      values.push(rows[0].next);
    }
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const { rows } = await query(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders}) RETURNING *`,
      values
    );
    res.status(201).json(rowToJson(rows[0]));
  });

  // Saves a new order in one go: body is an array of ids, first to last.
  router.put("/order", requireAdmin, async (req, res) => {
    const ids = req.body;
    if (!Array.isArray(ids) || !ids.every(Number.isInteger)) {
      throw new HttpError(400, "Send a list of ids in the order you want them.");
    }
    await withTransaction(async (db) => {
      for (const [index, id] of ids.entries()) {
        await db.query(`UPDATE ${table} SET sort_order = $1, updated_at = now() WHERE id = $2`, [index, id]);
      }
    });
    const { rows } = await query(`SELECT * FROM ${table} ORDER BY ${orderBy}`);
    res.json(rows.map(rowToJson));
  });

  router.put("/:id", requireAdmin, async (req, res) => {
    const id = idParam(req);
    const body = { ...req.body };
    if (slugFrom && body.slug !== undefined) body.slug = slugify(body.slug);
    const { columns, values } = pickFields(body, schema);
    if (!columns.length) throw new HttpError(400, "Nothing to update.");
    const sets = columns.map((c, i) => `${c} = $${i + 1}`).join(", ");
    const { rows } = await query(
      `UPDATE ${table} SET ${sets}, updated_at = now() WHERE id = $${values.length + 1} RETURNING *`,
      [...values, id]
    );
    if (!rows.length) throw new HttpError(404, "Not found.");
    res.json(rowToJson(rows[0]));
  });

  router.delete("/:id", requireAdmin, async (req, res) => {
    const { rowCount } = await query(`DELETE FROM ${table} WHERE id = $1`, [idParam(req)]);
    if (!rowCount) throw new HttpError(404, "Not found.");
    res.status(204).end();
  });

  return router;
}
