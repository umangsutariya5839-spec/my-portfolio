import { Router } from "express";
import rateLimit from "express-rate-limit";
import { query } from "../db.js";
import { issueToken, passwordMatches, requireAdmin } from "../middleware/auth.js";
import { HttpError, pickFields, rowToJson } from "../utils.js";
import { crudRouter } from "./crud.js";

export const api = Router();

// ---------- schemas for the editable tables ----------

const profileSchema = {
  name: { type: "text", required: true },
  role: { type: "text" },
  headline: { type: "text" },
  intro: { type: "text" },
  about: { type: "text" },
  location: { type: "text" },
  email: { type: "text" },
  phone: { type: "text" },
  github: { type: "url" },
  linkedin: { type: "url" },
  resumeUrl: { type: "url" },
  photoUrl: { type: "url" },
  available: { type: "bool" },
  stats: { type: "json" },
  beyondTitle: { type: "text" },
  beyondBody: { type: "text" },
};

const projectSchema = {
  slug: { type: "text", required: true },
  title: { type: "text", required: true },
  category: { type: "text" },
  summary: { type: "text" },
  points: { type: "list" },
  stack: { type: "list" },
  liveUrl: { type: "url" },
  codeUrl: { type: "url" },
  imageUrl: { type: "url" },
  year: { type: "text" },
  featured: { type: "bool" },
  sortOrder: { type: "int" },
};

const experienceSchema = {
  role: { type: "text", required: true },
  org: { type: "text" },
  period: { type: "text" },
  current: { type: "bool" },
  points: { type: "list" },
  sortOrder: { type: "int" },
};

const educationSchema = {
  qualification: { type: "text", required: true },
  institute: { type: "text" },
  period: { type: "text" },
  result: { type: "text" },
  note: { type: "text" },
  sortOrder: { type: "int" },
};

const serviceSchema = {
  title: { type: "text", required: true },
  category: { type: "text" },
  summary: { type: "text" },
  items: { type: "list" },
  sortOrder: { type: "int" },
};

const skillSchema = {
  name: { type: "text", required: true },
  items: { type: "list" },
  sortOrder: { type: "int" },
};

// ---------- health ----------

api.get("/health", async (_req, res) => {
  await query("SELECT 1");
  res.json({ ok: true, database: "connected", time: new Date().toISOString() });
});

// ---------- everything in one call (what the home page uses) ----------

async function readProfile() {
  const { rows } = await query("SELECT * FROM profile WHERE id = 1");
  if (!rows.length) throw new HttpError(503, "No content yet. Run `npm run db:seed` on the server.");
  const { id, updatedAt, ...profile } = rowToJson(rows[0]);
  return profile;
}

api.get("/portfolio", async (_req, res) => {
  const [profile, projects, experience, education, skills, services] = await Promise.all([
    readProfile(),
    query("SELECT * FROM projects ORDER BY sort_order, id"),
    query("SELECT * FROM experience ORDER BY sort_order, id"),
    query("SELECT * FROM education ORDER BY sort_order, id"),
    query("SELECT * FROM skill_groups ORDER BY sort_order, id"),
    query("SELECT * FROM services ORDER BY sort_order, id"),
  ]);
  res.set("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=300");
  res.json({
    profile,
    projects: projects.rows.map(rowToJson),
    experience: experience.rows.map(rowToJson),
    education: education.rows.map(rowToJson),
    skills: skills.rows.map(rowToJson),
    services: services.rows.map(rowToJson),
  });
});

// ---------- profile ----------

api.get("/profile", async (_req, res) => {
  res.json(await readProfile());
});

api.put("/profile", requireAdmin, async (req, res) => {
  const { columns, values } = pickFields(req.body, profileSchema);
  if (!columns.length) throw new HttpError(400, "Nothing to update.");
  const sets = columns.map((c, i) => `${c} = $${i + 1}`).join(", ");
  const { rows } = await query(
    `UPDATE profile SET ${sets}, updated_at = now() WHERE id = 1 RETURNING *`,
    values
  );
  if (!rows.length) throw new HttpError(503, "No profile row yet. Run `npm run db:seed` first.");
  const { id, ...profile } = rowToJson(rows[0]);
  res.json(profile);
});

// ---------- list tables ----------

api.use("/projects", crudRouter({ table: "projects", schema: projectSchema, slugFrom: "title" }));
api.use("/experience", crudRouter({ table: "experience", schema: experienceSchema }));
api.use("/education", crudRouter({ table: "education", schema: educationSchema }));
api.use("/skills", crudRouter({ table: "skill_groups", schema: skillSchema }));
api.use("/services", crudRouter({ table: "services", schema: serviceSchema }));

// ---------- auth ----------

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many sign-in attempts. Try again in 15 minutes." },
});

api.post("/auth/login", loginLimiter, (req, res) => {
  if (!passwordMatches(req.body?.password)) throw new HttpError(401, "Wrong password.");
  res.json({ token: issueToken(), expiresIn: 8 * 60 * 60 });
});

api.get("/auth/me", requireAdmin, (_req, res) => {
  res.json({ signedIn: true });
});

// ---------- contact form ----------

const contactLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "You have sent a few messages already. Try again in a few minutes." },
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

api.post("/contact", contactLimiter, async (req, res) => {
  const { name, email, subject = "", message, company } = req.body || {};

  // Honeypot: the hidden "company" field stays empty for real people.
  if (company) return res.status(201).json({ ok: true });

  const clean = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const data = {
    name: clean(name, 120),
    email: clean(email, 200),
    subject: clean(subject, 200),
    body: clean(message, 5000),
  };
  if (!data.name || !data.email || !data.body) {
    throw new HttpError(400, "Name, email and message are all required.");
  }
  if (!EMAIL.test(data.email)) throw new HttpError(400, "That email address does not look right.");

  await query(
    "INSERT INTO messages (name, email, subject, body, ip) VALUES ($1, $2, $3, $4, $5)",
    [data.name, data.email, data.subject, data.body, req.ip || ""]
  );
  res.status(201).json({ ok: true });
});

// ---------- inbox (admin) ----------

api.get("/messages", requireAdmin, async (req, res) => {
  const unreadOnly = req.query.unread === "true";
  const { rows } = await query(
    `SELECT id, name, email, subject, body, is_read, created_at FROM messages
     ${unreadOnly ? "WHERE is_read = FALSE" : ""}
     ORDER BY created_at DESC LIMIT 200`
  );
  const { rows: count } = await query("SELECT COUNT(*)::int AS unread FROM messages WHERE is_read = FALSE");
  res.json({ unread: count[0].unread, messages: rows.map(rowToJson) });
});

api.patch("/messages/:id", requireAdmin, async (req, res) => {
  const { isRead } = req.body || {};
  if (typeof isRead !== "boolean") throw new HttpError(400, "isRead must be true or false.");
  const { rows } = await query(
    "UPDATE messages SET is_read = $1 WHERE id = $2 RETURNING id, is_read",
    [isRead, Number(req.params.id)]
  );
  if (!rows.length) throw new HttpError(404, "Not found.");
  res.json(rowToJson(rows[0]));
});

api.delete("/messages/:id", requireAdmin, async (req, res) => {
  const { rowCount } = await query("DELETE FROM messages WHERE id = $1", [Number(req.params.id)]);
  if (!rowCount) throw new HttpError(404, "Not found.");
  res.status(204).end();
});
