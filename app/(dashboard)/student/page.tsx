"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BadgeCheck, Globe, FolderSearch, GraduationCap } from "lucide-react"

import CourseCard from "@/components/course/course-card"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { FadeIn } from "@/components/motion/fade-in"
import { CardGridSkeleton } from "@/components/ui/skeletons"
import { CourseApi } from "@/features/courses/api"
import type { Course } from "@/types/course"

export default function StudentDashboard() {
  const [enrolled, setEnrolled] = useState<Course[]>([])
  const [discover, setDiscover] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [mine, catalog] = await Promise.all([
          CourseApi.getCourses().catch(() => [] as Course[]),
          CourseApi.getCatalog().catch(() => [] as Course[]),
        ])
        if (cancelled) return
        setEnrolled(mine)
        const enrolledIds = new Set(mine.map((c) => c.id))
        setDiscover(catalog.filter((c) => !enrolledIds.has(c.id)).slice(0, 4))
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
        eyebrow="Welcome back"
        title="Student Dashboard"
        description="Explore courses, manage your study vault, and generate AI materials."
      />

      <FadeIn delay={0.05}>
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <BadgeCheck className="size-4 text-primary" />
              My Enrolled Courses
            </h2>
            <Link href="/student/courses" className="text-sm text-primary font-medium hover:underline">
              View all my courses
            </Link>
          </div>

          {loading ? (
            <CardGridSkeleton count={3} className="md:grid-cols-3" cardClassName="h-64" />
          ) : enrolled.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-xl bg-muted/20 text-center">
              <GraduationCap className="size-10 text-muted-foreground mb-3" />
              <p className="font-medium mb-1">You are not enrolled in any course yet</p>
              <p className="text-sm text-muted-foreground mb-4">
                Browse the catalog and enroll to see your courses here.
              </p>
              <Button asChild size="sm">
                <Link href="/explore">
                  <FolderSearch className="size-4 mr-1.5" /> Explore courses
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {enrolled.slice(0, 6).map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  teacher={course.teacher}
                  university={course.university}
                  semester={course.semester}
                  tag={course.department}
                  variant="recommended"
                  href={`/student/courses/${course.id}`}
                />
              ))}
            </div>
          )}
        </section>
      </FadeIn>

      <FadeIn delay={0.1}>
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              Discover New Courses
            </h2>
            <Link href="/explore" className="text-sm text-primary font-medium hover:underline">
              Browse full catalog
            </Link>
          </div>

          {loading ? (
            <CardGridSkeleton count={4} className="md:grid-cols-4" cardClassName="h-64" />
          ) : discover.length === 0 ? (
            <p className="text-sm text-muted-foreground p-4 border rounded-xl bg-muted/20">
              No new courses to discover right now — you&apos;re enrolled in everything available!
            </p>
          ) : (
            <div className="grid md:grid-cols-4 gap-4">
              {discover.map((course) => (
                <CourseCard
                  key={course.id}
                  title={course.title}
                  teacher={course.teacher}
                  university={course.university}
                  semester={course.semester}
                  tag={course.department}
                  variant="trending"
                  href={`/student/courses/${course.id}`}
                />
              ))}
            </div>
          )}
        </section>
      </FadeIn>
    </PageShell>
  )
}
