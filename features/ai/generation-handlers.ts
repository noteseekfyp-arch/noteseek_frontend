import { AiApi, mapUiGenerationType } from "@/features/ai/api"
import type { ContextGeneratePayload } from "@/components/generation/context-selection-modal"
import type { GeneratePayload, GenerateResult, GenerationType } from "@/types/note"

type AppRouter = { push: (href: string) => void }

export function contextPayloadToGenerate(
  payload: ContextGeneratePayload,
  options?: { targetCourseId?: string; typeOverride?: GenerationType }
) {
  return AiApi.generate({
    type: options?.typeOverride ?? mapUiGenerationType(payload.type),
    sourceMaterialIds: payload.selectedFileIds,
    pageRange: payload.rangeType === "custom" ? payload.customRange : undefined,
    focus: payload.focusArea.trim() || undefined,
    targetCourseId: options?.targetCourseId,
  })
}

/** Generate content, navigate to the note viewer, then run optional side effects (e.g. list refresh). */
export async function generateAndOpenNote(
  router: AppRouter,
  payload: ContextGeneratePayload,
  options?: {
    targetCourseId?: string
    typeOverride?: GenerationType
    onAfterNavigate?: () => void | Promise<void>
  }
): Promise<GenerateResult> {
  const result = await contextPayloadToGenerate(payload, {
    targetCourseId: options?.targetCourseId,
    typeOverride: options?.typeOverride,
  })
  router.push(`/notes/${result.id}`)
  try {
    await options?.onAfterNavigate?.()
  } catch {
    /* list refresh is best-effort; viewer navigation is the primary outcome */
  }
  return result
}

/** Same flow for pages that build a GeneratePayload directly (AI generator, teacher forms). */
export async function directGenerateAndOpen(
  router: AppRouter,
  payload: GeneratePayload,
  options?: { onAfterNavigate?: () => void | Promise<void> }
): Promise<GenerateResult> {
  const result = await AiApi.generate(payload)
  router.push(`/notes/${result.id}`)
  try {
    await options?.onAfterNavigate?.()
  } catch {
    /* best-effort */
  }
  return result
}
