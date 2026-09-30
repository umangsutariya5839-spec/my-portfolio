-- Portfolio schema. Safe to run more than once.

CREATE TABLE IF NOT EXISTS profile (
  id           SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),  -- one row only
  name         TEXT NOT NULL,
  role         TEXT NOT NULL DEFAULT '',
  headline     TEXT NOT NULL DEFAULT '',
  intro        TEXT NOT NULL DEFAULT '',
  about        TEXT NOT NULL DEFAULT '',
  location     TEXT NOT NULL DEFAULT '',
  email        TEXT NOT NULL DEFAULT '',
  phone        TEXT NOT NULL DEFAULT '',
  github       TEXT NOT NULL DEFAULT '',
  linkedin     TEXT NOT NULL DEFAULT '',
  resume_url   TEXT NOT NULL DEFAULT '',
  photo_url    TEXT NOT NULL DEFAULT '',
  available    BOOLEAN NOT NULL DEFAULT TRUE,
  stats        JSONB NOT NULL DEFAULT '[]',   -- [{ "label": "CGPA", "value": "7.93" }]
  beyond_title TEXT NOT NULL DEFAULT '',
  beyond_body  TEXT NOT NULL DEFAULT '',
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT '',
  summary     TEXT NOT NULL DEFAULT '',
  points      TEXT[] NOT NULL DEFAULT '{}',
  stack       TEXT[] NOT NULL DEFAULT '{}',
  live_url    TEXT NOT NULL DEFAULT '',
  code_url    TEXT NOT NULL DEFAULT '',
  image_url   TEXT NOT NULL DEFAULT '',
  year        TEXT NOT NULL DEFAULT '',
  featured    BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS experience (
  id          SERIAL PRIMARY KEY,
  role        TEXT NOT NULL,
  org         TEXT NOT NULL DEFAULT '',
  period      TEXT NOT NULL DEFAULT '',
  current     BOOLEAN NOT NULL DEFAULT FALSE,
  points      TEXT[] NOT NULL DEFAULT '{}',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS education (
  id            SERIAL PRIMARY KEY,
  qualification TEXT NOT NULL,
  institute     TEXT NOT NULL DEFAULT '',
  period        TEXT NOT NULL DEFAULT '',
  result        TEXT NOT NULL DEFAULT '',
  note          TEXT NOT NULL DEFAULT '',
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS skill_groups (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  items       TEXT[] NOT NULL DEFAULT '{}',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS services (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  category    TEXT NOT NULL DEFAULT '',
  summary     TEXT NOT NULL DEFAULT '',
  items       TEXT[] NOT NULL DEFAULT '{}',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE services ADD COLUMN IF NOT EXISTS category TEXT NOT NULL DEFAULT '';

CREATE TABLE IF NOT EXISTS messages (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL,
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  ip          TEXT NOT NULL DEFAULT '',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS messages_created_at_idx ON messages (created_at DESC);
