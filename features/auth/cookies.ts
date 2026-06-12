// Keep cookies alive as long as the backend JWT (7 days).
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

export function saveToken(token: string, role: string) {
    document.cookie = `access_token=${token}; path=/; max-age=${COOKIE_MAX_AGE}`
    document.cookie = `user_role=${role}; path=/; max-age=${COOKIE_MAX_AGE}`
}

export function getAccessToken(): string | null {
    if (typeof document === "undefined") return null
    const parts = document.cookie.split(";")
    for (const part of parts) {
        const idx = part.indexOf("=")
        if (idx === -1) continue
        const name = part.slice(0, idx).trim()
        if (name !== "access_token") continue
        return decodeURIComponent(part.slice(idx + 1).trim())
    }
    return null
}

export function getUserRole(): string | null {
    if (typeof document === "undefined") return null
    const parts = document.cookie.split(";")
    for (const part of parts) {
        const idx = part.indexOf("=")
        if (idx === -1) continue
        const name = part.slice(0, idx).trim()
        if (name !== "user_role") continue
        return decodeURIComponent(part.slice(idx + 1).trim())
    }
    return null
}

export function logout() {
    document.cookie = "access_token=; Max-Age=0; path=/"
    document.cookie = "user_role=; Max-Age=0; path=/"
}
