"use client"

import { useEffect } from "react"
import CourseCard from "@/components/course/course-card"
import { FolderSearch, Library } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { CardGridSkeleton } from "@/components/ui/skeletons"
import { useCourses } from "@/features/courses/hooks"

export default function StudentCoursesPage() {
  const { courses, loading, error, fetchCourses } = useCourses()

  useEffect(() => {
    void fetchCourses()
  }, [fetchCourses])

  return (
    <PageShell>
      <PageHeader
        eyebrow="Courses"
        title="My Enrolled Courses"
        description="Access your course materials, pending quizzes, assignments, and AI-generated notes."
        actions={
          <Button asChild variant="outline" className="gap-2 text-primary border-primary/20 hover:bg-primary/10 shrink-0">
            <Link href="/explore">
              <FolderSearch className="size-4" /> Explore More Courses
            </Link>
          </Button>
        }
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <CardGridSkeleton count={6} cardClassName="h-48" />
      ) : courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              teacher={course.teacher}
              university={course.university}
              semester={course.semester}
              tag={course.department}
              href={`/student/courses/${course.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground flex flex-col items-center">
          <Library className="size-12 mb-3 text-muted" />
          <h3 className="font-semibold text-foreground text-base mb-1">No courses enrolled yet</h3>
          <p className="max-w-md mx-auto mb-4 text-sm">
            It looks like you aren&apos;t enrolled in any courses for the current semester. Head over to the Explore page
            to find public courses and enroll.
          </p>
          <Button asChild className="shadow-sm">
            <Link href="/explore">Explore Courses</Link>
          </Button>
        </div>
      )}
    </PageShell>
  )
}
