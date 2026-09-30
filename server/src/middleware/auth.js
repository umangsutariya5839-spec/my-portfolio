import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { HttpError } from "../utils.js";

const secret = () => {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 16) {
    throw new HttpError(500, "JWT_SECRET must be set to a random string of at least 16 characters.");
  }
  return value;
};

// Constant-time compare so the password check does not leak timing information.
export function passwordMatches(candidate) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new HttpError(500, "ADMIN_PASSWORD is not set on the server.");
  if (typeof candidate !== "string") return false;
  const a = crypto.createHash("sha256").update(candidate).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}

export function issueToken() {
  return jwt.sign({ role: "admin" }, secret(), { expiresIn: "8h" });
}

// Protects admin routes. Expects "Authorization: Bearer <token>".
export function requireAdmin(req, _res, next) {
  const header = req.get("authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, "Sign in first."));
  try {
    const payload = jwt.verify(token, secret());
    if (payload.role !== "admin") throw new Error("wrong role");
    req.admin = payload;
    next();
  } catch (error) {
    if (error instanceof HttpError) return next(error);
    next(new HttpError(401, "Your session has expired. Sign in again."));
  }
}
