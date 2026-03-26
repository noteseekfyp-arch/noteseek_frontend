"use client"

import CourseCard from "@/components/course/course-card"
import { GraduationCap, FolderSearch, Library } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function StudentCoursesPage() {
  const MOCK_ENROLLED_COURSES = [
    {
      id: "cs101",
      title: "Introduction to Computer Science",
      teacher: "Prof. Anderson",
      university: "Global University",
      semester: "Fall 2024",
      tag: "Computer Science",
    },
    {
      id: "eng202",
      title: "Advanced Literature",
      teacher: "Dr. L. Jenkins",
      university: "Global University",
      semester: "Fall 2024",
      tag: "English",
    },
    {
      id: "phys101",
      title: "Quantum Physics",
      teacher: "Prof. Robert Chen",
      university: "Stanford University",
      semester: "Spring 2025",
      tag: "Physics",
    }
  ]

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <GraduationCap className="size-6" />
            </div>
            My Enrolled Courses
          </h1>
          <p className="mt-2 text-muted-foreground">
            Access your course materials, pending quizzes, assignments, and AI-generated notes.
          </p>
        </div>
        <Button asChild variant="outline" className="gap-2 text-primary border-primary/20 hover:bg-primary/10 shrink-0">
          <Link href="/explore">
            <FolderSearch className="size-4" /> Explore More Courses
          </Link>
        </Button>
      </div>

      {MOCK_ENROLLED_COURSES.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_ENROLLED_COURSES.map((course) => (
            <CourseCard
              key={course.id}
              title={course.title}
              teacher={course.teacher}
              university={course.university}
              semester={course.semester}
              tag={course.tag}
              href={`/student/courses/${course.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground flex flex-col items-center">
          <Library className="size-16 mb-4 text-muted" />
          <h3 className="font-semibold text-foreground text-xl mb-2">No courses enrolled yet</h3>
          <p className="max-w-md mx-auto mb-6 text-sm">
            It looks like you aren't enrolled in any courses for the current semester. Head over to the Explore page to find and enroll in new subjects!
          </p>
          <Button asChild className="px-8 shadow-sm">
            <Link href="/explore">
              Explore Courses
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
