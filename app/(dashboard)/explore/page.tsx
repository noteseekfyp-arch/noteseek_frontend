"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Search, Filter, BookOpen, CheckCircle2, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TeacherCourseCard } from "@/components/course/teacher-course-card"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { CardGridSkeleton } from "@/components/ui/skeletons"
import { CourseApi } from "@/features/courses/api"
import { getUserRole } from "@/features/auth/cookies"
import type { Course } from "@/types/course"

const ALL = "all"

function formatCourseUpdated(iso: string | null): string {
  if (!iso) return "Recently"
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return "Recently"
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

function CourseSearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [courses, setCourses] = useState<Course[]>([])
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [role, setRole] = useState<string | null>(null)
  const [enrollingId, setEnrollingId] = useState<string | null>(null)

  const [uniFilter, setUniFilter] = useState(ALL)
  const [deptFilter, setDeptFilter] = useState(ALL)
  const [semFilter, setSemFilter] = useState(ALL)

  useEffect(() => {
    setSearchQuery(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    setRole(getUserRole())
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setLoadError(null)
      try {
        const [catalog, mine] = await Promise.all([
          CourseApi.getCatalog(),
          CourseApi.getCourses().catch(() => [] as Course[]),
        ])
        if (!cancelled) {
          setCourses(catalog)
          setEnrolledIds(new Set(mine.map((c) => c.id)))
        }
      } catch (e) {
        if (!cancelled) {
          setCourses([])
          setLoadError(e instanceof Error ? e.message : "Could not load catalog")
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const universities = useMemo(
    () => [...new Set(courses.map((c) => c.university).filter(Boolean))].sort(),
    [courses]
  )
  const departments = useMemo(
    () => [...new Set(courses.map((c) => c.department).filter(Boolean))].sort(),
    [courses]
  )
  const semesters = useMemo(
    () => [...new Set(courses.map((c) => c.semester).filter(Boolean))].sort(),
    [courses]
  )

  const hasActiveFilters = uniFilter !== ALL || deptFilter !== ALL || semFilter !== ALL || searchQuery !== ""

  const filteredCourses = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return courses.filter((course) => {
      if (uniFilter !== ALL && course.university !== uniFilter) return false
      if (deptFilter !== ALL && course.department !== deptFilter) return false
      if (semFilter !== ALL && course.semester !== semFilter) return false
      if (!q) return true
      return (
        course.title.toLowerCase().includes(q) ||
        course.department.toLowerCase().includes(q) ||
        course.university.toLowerCase().includes(q) ||
        course.teacher.toLowerCase().includes(q)
      )
    })
  }, [courses, searchQuery, uniFilter, deptFilter, semFilter])

  function clearFilters() {
    setUniFilter(ALL)
    setDeptFilter(ALL)
    setSemFilter(ALL)
    setSearchQuery("")
  }

  async function handleEnroll(courseId: string) {
    setEnrollingId(courseId)
    try {
      await CourseApi.enroll(courseId)
      setEnrolledIds((prev) => new Set([...prev, courseId]))
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Enrollment failed")
    } finally {
      setEnrollingId(null)
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Discover"
        title="Explore Courses"
        description="Search and discover public courses. Students can enroll from here; teachers manage courses from the teacher dashboard."
      />

      {loadError && (
        <p className="text-sm text-destructive" role="alert">
          {loadError}
        </p>
      )}

      <div className="flex flex-col md:flex-row gap-5 items-start">
        <aside className="w-full md:w-64 space-y-4 shrink-0 bg-white p-4 rounded-xl border md:sticky md:top-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <Filter className="size-5" />
              Filters
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-primary font-medium hover:underline inline-flex items-center gap-1"
              >
                <X className="size-3" /> Clear
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>University</Label>
              <Select value={uniFilter} onValueChange={setUniFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value={ALL}>All Universities</SelectItem>
                  {universities.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select value={deptFilter} onValueChange={setDeptFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value={ALL}>All Departments</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select value={semFilter} onValueChange={setSemFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent className="max-h-64">
                  <SelectItem value={ALL}>All Semesters</SelectItem>
                  {semesters.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <p className="text-xs text-muted-foreground pt-1 border-t">
            {loading ? "Loading…" : `${filteredCourses.length} of ${courses.length} courses`}
          </p>
        </aside>

        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 size-5 text-muted-foreground" />
            <Input
              placeholder="Search by course, department, university, or teacher..."
              className="pl-11 pr-4 py-6 text-lg rounded-xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {loading ? (
            <CardGridSkeleton count={6} className="sm:grid-cols-2 lg:grid-cols-3 gap-6" cardClassName="h-56" />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => {
                const isEnrolled = enrolledIds.has(course.id)
                return (
                  <div key={course.id} className="space-y-3">
                    <TeacherCourseCard
                      title={course.title}
                      students={course.student_count}
                      updated={formatCourseUpdated(course.updated_at)}
                      category={course.department}
                      href={`/student/courses/${course.id}`}
                    />
                    {role === "student" &&
                      (isEnrolled ? (
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 h-8 px-3">
                            <CheckCircle2 className="size-3.5 mr-1" /> Enrolled
                          </Badge>
                          <Button asChild size="sm" variant="secondary" className="flex-1">
                            <Link href={`/student/courses/${course.id}`}>Open course</Link>
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="default"
                          size="sm"
                          className="w-full"
                          disabled={enrollingId === course.id}
                          onClick={() => void handleEnroll(course.id)}
                        >
                          {enrollingId === course.id ? "Enrolling…" : "Enroll"}
                        </Button>
                      ))}
                  </div>
                )
              })}
            </div>
          )}

          {!loading && filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
              <BookOpen className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground text-center max-w-sm mb-4">
                Try a different search term, or clear the filters to see the full catalog.
              </p>
              {hasActiveFilters && (
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  <X className="size-4 mr-1.5" /> Clear search & filters
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  )
}

export default function CourseSearchPage() {
  return (
    <Suspense fallback={<CardGridSkeleton count={6} className="sm:grid-cols-2 lg:grid-cols-3 gap-6" cardClassName="h-56" />}>
      <CourseSearchContent />
    </Suspense>
  )
}
