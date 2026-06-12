import { API_BASE_URL } from "@/config/api"
import { bearerHeaders, throwIfBad } from "@/features/http"
import type { Material } from "@/types/material"

export const MaterialApi = {
    async list(courseId?: string | null): Promise<Material[]> {
        const q =
            courseId !== undefined && courseId !== null && courseId !== ""
                ? `?course_id=${encodeURIComponent(courseId)}`
                : ""
        const res = await fetch(`${API_BASE_URL}/materials${q}`, { headers: { ...bearerHeaders() } })
        await throwIfBad(res)
        return res.json() as Promise<Material[]>
    },

    async upload(file: File, courseId: string | null): Promise<Material> {
        const fd = new FormData()
        fd.append("file", file)
        if (courseId) fd.append("course_id", courseId)
        const res = await fetch(`${API_BASE_URL}/materials/upload`, {
            method: "POST",
            headers: { ...bearerHeaders() },
            body: fd,
        })
        await throwIfBad(res)
        return res.json() as Promise<Material>
    },

    async delete(materialId: string): Promise<void> {
        const res = await fetch(`${API_BASE_URL}/materials/${materialId}`, {
            method: "DELETE",
            headers: { ...bearerHeaders() },
        })
        await throwIfBad(res)
    },
}
