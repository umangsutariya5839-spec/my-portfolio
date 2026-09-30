import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./db.js";
import { api } from "./routes/api.js";
import { HttpError } from "./utils.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

// Behind Railway / Render / Nginx the client IP arrives in X-Forwarded-For.
app.set("trust proxy", 1);
app.disable("x-powered-by");

app.use(helmet());
app.use(express.json({ limit: "200kb" }));

// Only the listed frontends may call the API from a browser.
const allowed = (process.env.CORS_ORIGIN || "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, done) {
      if (!origin || allowed.includes("*") || allowed.includes(origin)) return done(null, true);
      done(new HttpError(403, `Origin ${origin} is not allowed.`));
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    maxAge: 600,
  })
);

app.get("/", (_req, res) => {
  res.json({ name: "Umang Sutarsandhiya portfolio API", docs: "/api/health", version: "2.0.0" });
});

app.use("/api", api);

app.use((_req, _res, next) => next(new HttpError(404, "No such endpoint.")));

// Every error ends up here and leaves as JSON: { error: "..." }.
app.use((error, _req, res, _next) => {
  if (error.type === "entity.parse.failed") {
    return res.status(400).json({ error: "The request body is not valid JSON." });
  }
  if (error.code === "23505") {
    return res.status(409).json({ error: "That value is already taken (for example, the project slug)." });
  }
  const status = error.status || 500;
  if (status >= 500) console.error(error);
  res.status(status).json({ error: status >= 500 && !(error instanceof HttpError) ? "Server error." : error.message });
});

const server = app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});

const shutdown = () => {
  server.close(() => pool.end().then(() => process.exit(0)));
};
process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default app;
