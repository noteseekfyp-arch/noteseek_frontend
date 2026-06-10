/**
 * Backend HTTP API configuration
 *
 * - Default (no `NEXT_PUBLIC_API_ORIGIN`): browser calls **same-origin** `/api/...`.
 *   Next.js rewrites that to the real FastAPI server (`API_PROXY_TARGET` in `next.config.ts`),
 *   which avoids CORS issues (e.g. app on `localhost:3000` vs API on `127.0.0.1:8000`).
 * - Set `NEXT_PUBLIC_API_ORIGIN` to a full URL when the API is on another host and you
 *   are not using a proxy (ensure FastAPI CORS allows your site origin).
 */
const configuredOrigin = process.env.NEXT_PUBLIC_API_ORIGIN?.trim().replace(/\/$/, "") ?? ""

export const API_ORIGIN = configuredOrigin

export const API_PREFIX = "/api"

export const API_BASE_URL =
  configuredOrigin.length > 0 ? `${configuredOrigin}${API_PREFIX}` : API_PREFIX

/**
 * AI generation can take minutes (Ollama). Next.js dev rewrites drop long proxied
 * requests ("socket hang up") while the backend still saves the note.
 * Call the API directly for /ai/generate; FastAPI CORS allows localhost origins.
 */
export function getAiApiBaseUrl(): string {
  if (configuredOrigin.length > 0) {
    return `${configuredOrigin}${API_PREFIX}`
  }
  if (process.env.NODE_ENV === "development") {
    return `http://127.0.0.1:8000${API_PREFIX}`
  }
  return API_BASE_URL
}
