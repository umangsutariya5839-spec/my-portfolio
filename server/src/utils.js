// Small helpers for turning request bodies into safe column values and rows into API JSON.

export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const toSnake = (key) => key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`);
const toCamel = (key) => key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());

export function rowToJson(row) {
  if (!row) return row;
  const out = {};
  for (const [key, value] of Object.entries(row)) out[toCamel(key)] = value;
  return out;
}

const cleaners = {
  text(value, field) {
    if (typeof value !== "string") throw new HttpError(400, `${field} must be text.`);
    const trimmed = value.trim();
    if (trimmed.length > 5000) throw new HttpError(400, `${field} is too long.`);
    return trimmed;
  },
  url(value, field) {
    const text = cleaners.text(value, field);
    if (text && !/^(https?:\/\/|\/|mailto:)/i.test(text)) {
      throw new HttpError(400, `${field} must start with https://, / or mailto:.`);
    }
    return text;
  },
  bool(value, field) {
    if (typeof value !== "boolean") throw new HttpError(400, `${field} must be true or false.`);
    return value;
  },
  int(value, field) {
    if (!Number.isInteger(value)) throw new HttpError(400, `${field} must be a whole number.`);
    return value;
  },
  list(value, field) {
    if (!Array.isArray(value)) throw new HttpError(400, `${field} must be a list.`);
    if (value.length > 50) throw new HttpError(400, `${field} has too many entries.`);
    return value.map((item) => cleaners.text(item, field)).filter(Boolean);
  },
  json(value, field) {
    if (!Array.isArray(value)) throw new HttpError(400, `${field} must be a list.`);
    return JSON.stringify(value);
  },
};

// schema: { fieldName: { type: "text" | "url" | "bool" | "int" | "list" | "json", required?: true } }
// Returns { columns, values } containing only the fields present in body (all required ones when creating).
export function pickFields(body, schema, { creating = false } = {}) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new HttpError(400, "Send a JSON object.");
  }
  const columns = [];
  const values = [];
  for (const [field, rule] of Object.entries(schema)) {
    if (body[field] === undefined) {
      if (creating && rule.required) throw new HttpError(400, `${field} is required.`);
      continue;
    }
    const value = cleaners[rule.type](body[field], field);
    if (rule.required && value === "") throw new HttpError(400, `${field} cannot be empty.`);
    columns.push(toSnake(field));
    values.push(value);
  }
  return { columns, values };
}

export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}
