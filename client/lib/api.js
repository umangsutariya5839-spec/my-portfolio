// One place that knows where the API lives. Server components and the browser both use it.
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export async function api(path, { token, body, method, ...options } = {}) {
  const headers = { ...(options.headers || {}) };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      cache: "no-store",
      ...options,
      method: method || (body !== undefined ? "POST" : "GET"),
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Could not reach the server. Check your connection and try again.");
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.error || `Request failed (${res.status}).`);
  return data;
}

export const getPortfolio = () => api("/portfolio");

// For pages: returns { content } or { error } so a page can show a friendly message
// instead of crashing when the API is down.
export async function loadContent() {
  try {
    return { content: await getPortfolio() };
  } catch (error) {
    return { error };
  }
}
