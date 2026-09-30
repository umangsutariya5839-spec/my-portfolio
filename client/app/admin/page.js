"use client";

import { useCallback, useEffect, useState } from "react";
import { api, ApiError } from "@/lib/api";

const TOKEN_KEY = "portfolio-admin-token";

// ---------- field definitions for each editable list ----------
// kind: text | textarea | lines (one entry per line) | bool | url
const sections = {
  projects: {
    label: "Projects",
    path: "/projects",
    title: (item) => item.title || "New project",
    blank: { title: "", slug: "", category: "", summary: "", points: [], stack: [], liveUrl: "", codeUrl: "", imageUrl: "", year: "", featured: false },
    fields: [
      ["title", "Title", "text"],
      ["slug", "URL slug (leave empty to make one from the title)", "text"],
      ["category", "Category", "text"],
      ["year", "Year", "text"],
      ["summary", "Summary", "textarea"],
      ["points", "What you did (one point per line)", "lines"],
      ["stack", "Built with (one per line)", "lines"],
      ["liveUrl", "Live site URL", "url"],
      ["codeUrl", "Code URL (GitHub)", "url"],
      ["imageUrl", "Screenshot image URL", "url"],
      ["featured", "Featured", "bool"],
    ],
  },
  experience: {
    label: "Experience",
    path: "/experience",
    title: (item) => [item.role, item.org].filter(Boolean).join(" — ") || "New role",
    blank: { role: "", org: "", period: "", current: false, points: [] },
    fields: [
      ["role", "Role", "text"],
      ["org", "Company / organisation", "text"],
      ["period", "Period", "text"],
      ["current", "Current role", "bool"],
      ["points", "What you do (one point per line)", "lines"],
    ],
  },
  education: {
    label: "Education",
    path: "/education",
    title: (item) => item.qualification || "New entry",
    blank: { qualification: "", institute: "", period: "", result: "", note: "" },
    fields: [
      ["qualification", "Qualification", "text"],
      ["institute", "Institute", "text"],
      ["period", "Period", "text"],
      ["result", "Result", "text"],
      ["note", "Note", "textarea"],
    ],
  },
  services: {
    label: "Services",
    path: "/services",
    title: (item) => [item.title || "New service", item.category].filter(Boolean).join(" · "),
    blank: { title: "", category: "", summary: "", items: [] },
    fields: [
      ["title", "Service name", "text"],
      ["category", "Category (services with the same category are grouped)", "text"],
      ["summary", "Short description", "textarea"],
      ["items", "What's included (one per line)", "lines"],
    ],
  },
  skills: {
    label: "Skills",
    path: "/skills",
    title: (item) => item.name || "New group",
    blank: { name: "", items: [] },
    fields: [
      ["name", "Group name", "text"],
      ["items", "Skills (one per line)", "lines"],
    ],
  },
};

const profileFields = [
  ["name", "Name", "text"],
  ["role", "Role (under your name)", "text"],
  ["headline", "Headline quote", "text"],
  ["intro", "Short intro (hero)", "textarea"],
  ["about", "About (blank line between paragraphs)", "textarea"],
  ["location", "Location", "text"],
  ["email", "Email", "text"],
  ["phone", "Phone", "text"],
  ["github", "GitHub URL", "url"],
  ["linkedin", "LinkedIn URL", "url"],
  ["resumeUrl", "Resume URL", "url"],
  ["photoUrl", "Photo URL", "url"],
  ["available", "Show “Available for work”", "bool"],
  ["stats", "Stats (one per line: Label | Value)", "stats"],
  ["beyondTitle", "Beyond the desk: title", "text"],
  ["beyondBody", "Beyond the desk: text", "textarea"],
];

// ---------- small form pieces ----------

function toInput(kind, value) {
  if (kind === "lines") return (value || []).join("\n");
  if (kind === "stats") return (value || []).map((s) => `${s.label} | ${s.value}`).join("\n");
  return value ?? "";
}

function fromInput(kind, raw) {
  if (kind === "lines") return raw.split("\n").map((s) => s.trim()).filter(Boolean);
  if (kind === "stats")
    return raw
      .split("\n")
      .map((line) => line.split("|").map((s) => s.trim()))
      .filter(([label]) => label)
      .map(([label, value = ""]) => ({ label, value }));
  return raw;
}

function Field({ name, label, kind, value, onChange }) {
  const id = `f-${name}`;
  if (kind === "bool") {
    return (
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" className="h-4 w-4 accent-[rgb(var(--accent))]" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />
        {label}
      </label>
    );
  }
  const multiline = kind === "textarea" || kind === "lines" || kind === "stats";
  return (
    <label htmlFor={id} className="block">
      <span className="mb-1.5 block text-sm text-muted">{label}</span>
      {multiline ? (
        <textarea id={id} className="field" rows={kind === "textarea" ? 4 : 4} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} className="field" type={kind === "url" ? "text" : "text"} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

// Keeps text inputs as raw strings while editing, converts on save.
function useDraft(fields, source) {
  const make = useCallback(
    (src) => Object.fromEntries(fields.map(([key, , kind]) => [key, kind === "bool" ? Boolean(src?.[key]) : toInput(kind, src?.[key])])),
    [fields]
  );
  const [draft, setDraft] = useState(() => make(source));
  useEffect(() => setDraft(make(source)), [source, make]);
  const payload = () =>
    Object.fromEntries(fields.map(([key, , kind]) => [key, kind === "bool" ? draft[key] : fromInput(kind, draft[key])]));
  const set = (key) => (value) => setDraft((d) => ({ ...d, [key]: value }));
  return { draft, set, payload };
}

function Notice({ note }) {
  if (!note) return null;
  return <p className={`text-sm ${note.error ? "text-red-700" : "text-emerald-700"}`}>{note.text}</p>;
}

// ---------- editors ----------

function ProfileEditor({ token, onAuthError }) {
  const [profile, setProfile] = useState(null);
  const [note, setNote] = useState(null);
  const { draft, set, payload } = useDraft(profileFields, profile);

  useEffect(() => {
    api("/profile").then(setProfile).catch((e) => setNote({ error: true, text: e.message }));
  }, []);

  async function save() {
    setNote(null);
    try {
      setProfile(await api("/profile", { method: "PUT", token, body: payload() }));
      setNote({ text: "Profile saved." });
    } catch (e) {
      if (e.status === 401) return onAuthError();
      setNote({ error: true, text: e.message });
    }
  }

  if (!profile) return <Notice note={note || { text: "Loading…" }} />;
  return (
    <div className="card space-y-5 p-6 sm:p-8">
      {profileFields.map(([key, label, kind]) => (
        <Field key={key} name={key} label={label} kind={kind} value={draft[key]} onChange={set(key)} />
      ))}
      <div className="flex items-center gap-4">
        <button className="btn-primary" onClick={save}>Save profile</button>
        <Notice note={note} />
      </div>
    </div>
  );
}

function ItemEditor({ config, item, token, onSaved, onDeleted, onMove, isFirst, isLast, onAuthError }) {
  const [open, setOpen] = useState(!item.id);
  const [note, setNote] = useState(null);
  const { draft, set, payload } = useDraft(config.fields, item);

  async function save() {
    setNote(null);
    try {
      const body = payload();
      if (config === sections.projects && !body.slug) delete body.slug;
      const saved = item.id
        ? await api(`${config.path}/${item.id}`, { method: "PUT", token, body })
        : await api(config.path, { method: "POST", token, body });
      onSaved(saved, item);
      setNote({ text: "Saved." });
    } catch (e) {
      if (e.status === 401) return onAuthError();
      setNote({ error: true, text: e.message });
    }
  }

  async function remove() {
    if (!item.id) return onDeleted(item);
    if (!window.confirm(`Delete "${config.title(item)}"? This cannot be undone.`)) return;
    try {
      await api(`${config.path}/${item.id}`, { method: "DELETE", token });
      onDeleted(item);
    } catch (e) {
      if (e.status === 401) return onAuthError();
      setNote({ error: true, text: e.message });
    }
  }

  return (
    <li className="card overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4">
        <button className="flex-1 text-left font-medium" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          {config.title(item)}
          {!item.id ? <span className="ml-2 text-xs text-accent">unsaved</span> : null}
        </button>
        {item.id ? (
          <>
            <button className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-paper disabled:opacity-30" disabled={isFirst} onClick={() => onMove(-1)} aria-label="Move up">↑</button>
            <button className="rounded-lg px-2 py-1 text-sm text-muted hover:bg-paper disabled:opacity-30" disabled={isLast} onClick={() => onMove(1)} aria-label="Move down">↓</button>
          </>
        ) : null}
      </div>
      {open ? (
        <div className="space-y-4 border-t border-line p-5">
          {config.fields.map(([key, label, kind]) => (
            <Field key={key} name={`${item.id || "new"}-${key}`} label={label} kind={kind} value={draft[key]} onChange={set(key)} />
          ))}
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-primary !py-2.5" onClick={save}>Save</button>
            <button className="btn !py-2.5 text-red-700 hover:bg-red-50" onClick={remove}>Delete</button>
            <Notice note={note} />
          </div>
        </div>
      ) : null}
    </li>
  );
}

function ListEditor({ config, token, onAuthError }) {
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setItems(null);
    api(config.path).then(setItems).catch((e) => setError(e.message));
  }, [config]);

  async function move(index, delta) {
    const saved = items.filter((i) => i.id);
    const target = index + delta;
    const next = [...saved];
    [next[index], next[target]] = [next[target], next[index]];
    setItems([...next, ...items.filter((i) => !i.id)]);
    try {
      await api(`${config.path}/order`, { method: "PUT", token, body: next.map((i) => i.id) });
    } catch (e) {
      if (e.status === 401) return onAuthError();
      setError(e.message);
    }
  }

  if (!items) return <p className="text-sm text-muted">{error || "Loading…"}</p>;
  return (
    <div>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <ItemEditor
            key={item._key || item.id}
            config={config}
            item={item}
            token={token}
            isFirst={index === 0}
            isLast={index === items.filter((i) => i.id).length - 1}
            onMove={(delta) => move(index, delta)}
            onSaved={(saved, original) =>
              setItems((list) => list.map((i) => (i === original ? { ...saved, _key: original._key } : i)))
            }
            onDeleted={(original) => setItems((list) => list.filter((i) => i !== original))}
            onAuthError={onAuthError}
          />
        ))}
      </ul>
      <button
        className="btn-ghost mt-5"
        onClick={() => setItems((list) => [...list, { ...config.blank, _key: `new-${Date.now()}` }])}
      >
        + Add {config.label.toLowerCase().replace(/s$/, "")}
      </button>
      {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function Inbox({ token, onAuthError }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  const load = useCallback(() => {
    api("/messages", { token })
      .then(setData)
      .catch((e) => (e.status === 401 ? onAuthError() : setError(e.message)));
  }, [token, onAuthError]);

  useEffect(load, [load]);

  async function toggle(message) {
    await api(`/messages/${message.id}`, { method: "PATCH", token, body: { isRead: !message.isRead } });
    load();
  }
  async function remove(message) {
    if (!window.confirm("Delete this message?")) return;
    await api(`/messages/${message.id}`, { method: "DELETE", token });
    load();
  }

  if (!data) return <p className="text-sm text-muted">{error || "Loading…"}</p>;
  if (!data.messages.length) return <p className="card p-8 text-center text-muted">No messages yet.</p>;
  return (
    <ul className="space-y-3">
      {data.messages.map((m) => (
        <li key={m.id} className={`card p-5 ${m.isRead ? "opacity-70" : "border-accent/40"}`}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-medium">
              {!m.isRead ? <span className="mr-2 inline-block h-2 w-2 rounded-full bg-accent" aria-label="unread" /> : null}
              {m.name} · <a className="link-underline" href={`mailto:${m.email}?subject=${encodeURIComponent("Re: " + (m.subject || "your message"))}`}>{m.email}</a>
            </p>
            <time className="text-sm text-muted">{new Date(m.createdAt).toLocaleString("en-IN")}</time>
          </div>
          {m.subject ? <p className="mt-2 font-medium">{m.subject}</p> : null}
          <p className="mt-2 whitespace-pre-wrap text-ink/80">{m.body}</p>
          <div className="mt-4 flex gap-4 text-sm">
            <button className="link-underline" onClick={() => toggle(m)}>Mark as {m.isRead ? "unread" : "read"}</button>
            <button className="text-red-700 hover:underline" onClick={() => remove(m)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  );
}

// ---------- page ----------

const tabs = [
  ["profile", "Profile"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["education", "Education"],
  ["services", "Services"],
  ["skills", "Skills"],
  ["inbox", "Inbox"],
];

export default function Admin() {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState("profile");

  useEffect(() => {
    const saved = sessionStorage.getItem(TOKEN_KEY);
    if (!saved) return setReady(true);
    api("/auth/me", { token: saved })
      .then(() => setToken(saved))
      .catch(() => sessionStorage.removeItem(TOKEN_KEY))
      .finally(() => setReady(true));
  }, []);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  const onAuthError = useCallback(() => {
    signOut();
    setError("Your session expired. Sign in again.");
  }, [signOut]);

  async function signIn(event) {
    event.preventDefault();
    setError("");
    try {
      const { token: fresh } = await api("/auth/login", { body: { password } });
      sessionStorage.setItem(TOKEN_KEY, fresh);
      setToken(fresh);
      setPassword("");
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "Could not sign in.");
    }
  }

  if (!ready) return null;

  if (!token) {
    return (
      <main className="grid min-h-screen place-items-center px-5">
        <form onSubmit={signIn} className="card w-full max-w-sm space-y-5 p-8">
          <div>
            <p className="eyebrow">Admin</p>
            <h1 className="mt-3 text-3xl">Sign in</h1>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm text-muted">Password</span>
            <input className="field" type="password" autoFocus autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button className="btn-primary w-full" type="submit">Sign in</button>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="shell max-w-4xl py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="mt-3 text-4xl">Edit your portfolio</h1>
        </div>
        <div className="flex gap-3">
          <a href="/" target="_blank" className="btn-ghost !py-2.5">View site</a>
          <button className="btn !py-2.5 text-muted hover:text-ink" onClick={signOut}>Sign out</button>
        </div>
      </header>

      <nav className="mt-10 flex gap-1 overflow-x-auto border-b border-line" aria-label="Sections">
        {tabs.map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`-mb-px whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
              tab === key ? "border-accent text-ink" : "border-transparent text-muted hover:text-ink"
            }`}
            aria-current={tab === key ? "page" : undefined}
          >
            {label}
          </button>
        ))}
      </nav>

      <section className="mt-8">
        {tab === "profile" ? <ProfileEditor token={token} onAuthError={onAuthError} /> : null}
        {sections[tab] ? <ListEditor key={tab} config={sections[tab]} token={token} onAuthError={onAuthError} /> : null}
        {tab === "inbox" ? <Inbox token={token} onAuthError={onAuthError} /> : null}
      </section>
    </main>
  );
}
