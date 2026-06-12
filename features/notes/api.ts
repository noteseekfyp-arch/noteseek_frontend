import { API_BASE_URL } from "@/config/api"
import { bearerHeaders, throwIfBad } from "@/features/http"
import type { Note } from "@/types/note"

export const NotesApi = {
  async list(generatedOnly?: boolean): Promise<Note[]> {
    const params = new URLSearchParams()
    if (generatedOnly === true) params.set("generated_only", "true")
    else if (generatedOnly === false) params.set("generated_only", "false")
    const qs = params.toString()
    // Trailing slash avoids FastAPI 307 redirect (redirect drops Authorization via Next proxy).
    const url = qs ? `${API_BASE_URL}/notes/?${qs}` : `${API_BASE_URL}/notes/`
    const res = await fetch(url, {
      headers: { ...bearerHeaders() },
      cache: "no-store",
    })
    await throwIfBad(res)
    return res.json() as Promise<Note[]>
  },

  async get(noteId: string): Promise<Note> {
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      headers: { ...bearerHeaders() },
      cache: "no-store",
    })
    await throwIfBad(res)
    return res.json() as Promise<Note>
  },

  async delete(noteId: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
      headers: { ...bearerHeaders() },
    })
    await throwIfBad(res)
  },

  async downloadPdf(
    noteId: string,
    title?: string,
    opts?: { answers?: boolean; suffix?: string }
  ): Promise<void> {
    const params = new URLSearchParams()
    if (opts?.answers === false) params.set("answers", "false")
    const qs = params.toString()
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}/pdf${qs ? `?${qs}` : ""}`, {
      headers: { ...bearerHeaders() },
    })
    await throwIfBad(res)
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    const base = (title ?? "noteseek_note").replace(/[^\w \-]/g, "").trim() || "noteseek_note"
    a.download = `${base}${opts?.suffix ?? ""}.pdf`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  },

  async publish(noteId: string, published: boolean): Promise<Note> {
    const res = await fetch(`${API_BASE_URL}/notes/${noteId}/publish?published=${published}`, {
      method: "PATCH",
      headers: { ...bearerHeaders() },
    })
    await throwIfBad(res)
    return res.json() as Promise<Note>
  },

  async listPublished(courseId?: string): Promise<Note[]> {
    const qs = courseId ? `?course_id=${encodeURIComponent(courseId)}` : ""
    const res = await fetch(`${API_BASE_URL}/notes/published${qs}`, {
      headers: { ...bearerHeaders() },
      cache: "no-store",
    })
    await throwIfBad(res)
    return res.json() as Promise<Note[]>
  },
}
