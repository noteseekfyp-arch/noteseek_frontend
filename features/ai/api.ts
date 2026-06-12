import { API_BASE_URL, getAiApiBaseUrl } from "@/config/api"
import { bearerHeaders, throwIfBad } from "@/features/http"
import type { GeneratePayload, GenerateResult, GenerationType } from "@/types/note"

const UI_TO_API: Record<string, GenerationType> = {
  Flashcards: "flashcards",
  Summary: "summary",
  "Practice Quiz": "quiz",
  "Study Guide": "study_guide",
  Quiz: "quiz",
  Assignment: "assignment",
}

export function mapUiGenerationType(label: string): GenerationType {
  return UI_TO_API[label] ?? "summary"
}

export const AiApi = {
  async generate(payload: GeneratePayload): Promise<GenerateResult> {
    const res = await fetch(`${getAiApiBaseUrl()}/ai/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...bearerHeaders(),
      },
      body: JSON.stringify({
        type: payload.type,
        source_material_ids: payload.sourceMaterialIds,
        prompt: payload.prompt ?? null,
        target_course_id: payload.targetCourseId ?? null,
        page_range: payload.pageRange ?? null,
        focus: payload.focus ?? null,
      }),
    })
    await throwIfBad(res)
    const data = (await res.json()) as {
      id: string
      title: string
      type: GenerationType
      content: string
    }
    return {
      id: data.id,
      title: data.title,
      type: data.type,
      content: data.content,
    }
  },

  /** Lightweight status check — uses the normal proxied base URL. */
  async status(): Promise<unknown> {
    const res = await fetch(`${API_BASE_URL}/ai/status`, {
      headers: { ...bearerHeaders() },
    })
    await throwIfBad(res)
    return res.json()
  },
}
