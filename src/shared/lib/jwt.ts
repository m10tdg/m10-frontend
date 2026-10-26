// src/shared/lib/jwt.ts
// Client-side expiry check only, so the UI can drop stale sessions early.
// The signature is always verified by the server.
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp !== "number" || exp * 1000 <= Date.now();
  } catch {
    return true;
  }
}
