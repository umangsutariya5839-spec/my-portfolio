# Umang Sutarsandhiya — portfolio

A full-stack portfolio: a **Next.js** frontend that reads everything from a **Node.js + Express + PostgreSQL** REST API. Every word on the site lives in the database and can be edited from `/admin` in the browser.

```
client/   Next.js 14 site + admin panel      → deploy on Vercel
server/   Express REST API + PostgreSQL      → deploy on Railway (or Render)
```

## Run it locally

You need Node.js 18+ and PostgreSQL (local, or a free hosted database).

**1. API**

```bash
cd server
npm install
cp .env.example .env          # set DATABASE_URL, ADMIN_PASSWORD, JWT_SECRET
npm run db:setup              # creates the tables and loads the resume content
npm run dev                   # http://localhost:4000
```

**2. Website** (in a second terminal)

```bash
cd client
npm install
cp .env.example .env.local    # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                   # http://localhost:3000
```

Open `http://localhost:3000/admin` and sign in with `ADMIN_PASSWORD` to edit content.

## Pages

| URL | Page |
| --- | --- |
| `/` | Home: intro, featured projects, links to the other pages |
| `/about` | About, stats, education and softball |
| `/services` | Freelance services and how a project runs |
| `/experience` | Work experience |
| `/projects` | All projects |
| `/projects/<slug>` | One project in detail |
| `/skills` | Skill groups |
| `/contact` | Contact details and the message form |
| `/admin` | Password-protected editor (not linked in the menu) |

The menu order lives in `client/lib/nav.js`.

## API

All responses are JSON. Reads are public; writes need `Authorization: Bearer <token>` from `/api/auth/login`.

| Method | Endpoint | What it does |
| --- | --- | --- |
| GET | `/api/health` | API and database status |
| GET | `/api/portfolio` | Everything the home page needs, in one call |
| GET / PUT | `/api/profile` | Name, intro, about, links, stats, "beyond the desk" |
| GET / POST | `/api/projects` | List / add projects |
| GET / PUT / DELETE | `/api/projects/:id` | One project (GET also accepts the slug) |
| PUT | `/api/projects/order` | Save a new order: `[3, 1, 2]` |
| same as projects | `/api/experience`, `/api/education`, `/api/skills` | The other lists |
| POST | `/api/contact` | Contact form (validated, honeypot, rate-limited) |
| GET | `/api/messages` | Inbox (admin) |
| PATCH / DELETE | `/api/messages/:id` | Mark read/unread, delete (admin) |
| POST | `/api/auth/login` | `{ "password": "…" }` → `{ "token": "…" }`, valid 8 hours |

Tables are in `server/db/schema.sql`; the starting content is in `server/db/seed-data.js`.
`npm run db:seed` never overwrites existing content; `npm run db:seed -- --force` resets it to the resume.

## Deploy

**API + database on Railway**

1. New project → *Deploy from GitHub repo* → pick this repo, set **Root Directory** to `server`.
2. Add a **PostgreSQL** database to the same project.
3. In the API service's Variables, add:
   - `DATABASE_URL` → reference the Postgres service's `DATABASE_URL`
   - `ADMIN_PASSWORD` → your admin password
   - `JWT_SECRET` → a long random string
   - `CORS_ORIGIN` → your Vercel URL, e.g. `https://umangsutariya.vercel.app`
4. Set the **Pre-deploy command** to `npm run db:setup`, then deploy and generate a public domain.

**Website on Vercel**

1. Import the repo, set **Root Directory** to `client`.
2. Add `NEXT_PUBLIC_API_URL` = the Railway API URL (no trailing slash). Deploy.

## Before it goes live

- [ ] Add your LinkedIn URL in `/admin → Profile`; the icon stays hidden until it's set.
- [ ] Add a photo URL in `/admin → Profile` (the hero shows your initials until then).
- [ ] Add GitHub code links and screenshot URLs to projects.
- [ ] The resume PDF (`client/public/resume.pdf`) still says `github.com/dashboard`; change it to `github.com/umangsutariya5839-spec`.
- [ ] Use a strong `ADMIN_PASSWORD` and `JWT_SECRET` in production.

## Restyling

Every colour and font is a CSS variable at the top of `client/app/globals.css`. Change them there to re-theme the whole site.
