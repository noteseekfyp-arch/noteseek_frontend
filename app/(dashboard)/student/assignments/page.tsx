"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileUp, CheckCircle2, ClipboardList, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { CourseApi } from "@/features/courses/api"
import { NotesApi } from "@/features/notes/api"
import type { Note } from "@/types/note"

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
  } catch {
    return "—"
  }
}

export default function StudentAssignmentsGlobalPage() {
  const [assignments, setAssignments] = useState<Note[]>([])
  const [courseNames, setCourseNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [published, courses] = await Promise.all([
          NotesApi.listPublished(),
          CourseApi.getCourses().catch(() => []),
        ])
        if (cancelled) return
        setAssignments(published.filter((n) => n.kind === "assignment"))
        setCourseNames(Object.fromEntries(courses.map((c) => [c.id, c.title])))
      } catch {
        if (!cancelled) setAssignments([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <PageShell>
      <PageHeader
        eyebrow="Coursework"
        title="My Assignments"
        description="Assignments your teachers have assigned across all your enrolled courses."
      />

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="pending">Assigned ({assignments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 rounded-xl shimmer" />
              ))}
            </div>
          ) : assignments.length === 0 ? (
            <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
              <CheckCircle2 className="size-10 mx-auto mb-3 text-green-500/50" />
              <p className="font-medium text-foreground text-base mb-1">No assignments yet</p>
              <p className="text-sm">When a teacher assigns coursework to one of your courses, it will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {assignments.map((n) => (
                <div
                  key={n.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 rounded-xl border bg-white/80 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
                      <ClipboardList className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                        {n.course_id && courseNames[n.course_id] && (
                          <>
                            <GraduationCap className="size-3" />
                            {courseNames[n.course_id]}
                            <span>·</span>
                          </>
                        )}
                        {fmtDate(n.created_at)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-12 sm:pl-0">
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                      Assigned
                    </Badge>
                    <Button asChild size="sm">
                      <Link href={`/notes/${n.id}`}>Open</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-4">
          <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
            <FileUp className="size-10 mx-auto mb-3 text-muted" />
            <p className="font-medium text-foreground text-base mb-1">No completed assignments</p>
            <p className="text-sm">Submissions will appear here once the submissions feature is available.</p>
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
