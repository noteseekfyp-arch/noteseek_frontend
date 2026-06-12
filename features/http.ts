import { getAccessToken, logout } from "@/features/auth/cookies"

export function bearerHeaders(): HeadersInit {
  const token = getAccessToken()
  if (!token) {
    redirectToLogin()
    throw new Error("Not authenticated")
  }
  return { Authorization: `Bearer ${token}` }
}

function redirectToLogin(): void {
  if (typeof window === "undefined") return
  logout()
  if (!window.location.pathname.startsWith("/login")) {
    window.location.href = "/login"
  }
}

export async function throwIfBad(res: Response): Promise<void> {
  if (res.ok) return
  if (res.status === 401) {
    redirectToLogin()
    throw new Error("Session expired. Redirecting to login…")
  }
  let detail = res.statusText
  try {
    const body = await res.json()
    if (typeof body?.detail === "string") detail = body.detail
    else if (Array.isArray(body?.detail))
      detail = body.detail.map((x: { msg?: string }) => x?.msg ?? JSON.stringify(x)).join(", ")
  } catch {
    /* ignore */
  }
  throw new Error(detail || `Request failed (${res.status})`)
}
