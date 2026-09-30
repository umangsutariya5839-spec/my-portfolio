import "dotenv/config";
import { pool, withTransaction } from "../src/db.js";
import { profile, projects, experience, education, skillGroups, services } from "./seed-data.js";

// Loads the resume content. Refuses to overwrite a database that already has content
// unless you pass --force, so a redeploy never wipes edits made in the admin panel.
const force = process.argv.includes("--force");

try {
  const { rows } = await pool.query("SELECT 1 FROM profile WHERE id = 1");
  if (rows.length && !force) {
    console.log("Content already exists; nothing seeded. Run `npm run db:seed -- --force` to replace it.");
  } else {
    await withTransaction(async (db) => {
      await db.query("TRUNCATE projects, experience, education, skill_groups, services RESTART IDENTITY");
      await db.query("DELETE FROM profile");

      await db.query(
        `INSERT INTO profile (id, name, role, headline, intro, about, location, email, phone, github,
           linkedin, resume_url, photo_url, available, stats, beyond_title, beyond_body)
         VALUES (1, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
        [
          profile.name, profile.role, profile.headline, profile.intro, profile.about, profile.location,
          profile.email, profile.phone, profile.github, profile.linkedin, profile.resume_url,
          profile.photo_url, profile.available, JSON.stringify(profile.stats), profile.beyond_title,
          profile.beyond_body,
        ]
      );

      for (const [i, p] of projects.entries()) {
        await db.query(
          `INSERT INTO projects (slug, title, category, summary, points, stack, live_url, code_url,
             image_url, year, featured, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
          [p.slug, p.title, p.category, p.summary, p.points, p.stack, p.live_url, p.code_url,
            p.image_url, p.year, p.featured, i]
        );
      }
      for (const [i, e] of experience.entries()) {
        await db.query(
          `INSERT INTO experience (role, org, period, current, points, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [e.role, e.org, e.period, e.current, e.points, i]
        );
      }
      for (const [i, e] of education.entries()) {
        await db.query(
          `INSERT INTO education (qualification, institute, period, result, note, sort_order)
           VALUES ($1, $2, $3, $4, $5, $6)`,
          [e.qualification, e.institute, e.period, e.result, e.note, i]
        );
      }
      for (const [i, s] of skillGroups.entries()) {
        await db.query(
          "INSERT INTO skill_groups (name, items, sort_order) VALUES ($1, $2, $3)",
          [s.name, s.items, i]
        );
      }
      for (const [i, s] of services.entries()) {
        await db.query(
          "INSERT INTO services (title, category, summary, items, sort_order) VALUES ($1, $2, $3, $4, $5)",
          [s.title, s.category, s.summary, s.items, i]
        );
      }
    });
    console.log("Seeded the portfolio content from the resume.");
  }
} catch (error) {
  console.error("Seeding failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
