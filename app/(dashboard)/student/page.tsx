"use client"

import CourseCard from "@/components/course/course-card"
import Link from "next/link"
import { BadgeCheck, Globe, SlidersHorizontal } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { FadeIn } from "@/components/motion/fade-in"

export default function StudentDashboard() {
  return (
    <div className="space-y-12 pb-8">
      <PageHeader
        eyebrow="Welcome back"
        title="Student Dashboard"
        description="Explore courses, manage your study vault, and generate AI materials."
      />

      <FadeIn delay={0.05}>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <BadgeCheck className="size-5 text-primary" />
            Recommended from Stanford University
          </h2>
          <Link
            href="#"
            className="text-sm text-primary font-medium hover:underline"
          >
            View all recommendations
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <CourseCard
            title="Advanced Calculus"
            teacher="Dr. Sarah Jenkins"
            university="Stanford University"
            semester="Semester 1 • Fall 2024"
            tag="Mathematics"
            variant="recommended"
            href="/student/courses/1"
          />

          <CourseCard
            title="Quantum Physics"
            teacher="Prof. Robert Chen"
            university="Stanford University"
            semester="Semester 2 • Spring 2025"
            tag="Physics"
            variant="recommended"
            href="/student/courses/1"
          />

          <CourseCard
            title="Microeconomics"
            teacher="Dr. Emily White"
            university="Stanford University"
            semester="Semester 1 • Fall 2024"
            tag="Economics"
            variant="recommended"
            href="/student/courses/1"
          />
        </div>
      </section>

      </FadeIn>

      <FadeIn delay={0.1}>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="size-5 text-primary" />
            Trending from Other Universities
          </h2>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="size-9 rounded-lg border bg-white hover:bg-muted/40 flex items-center justify-center text-muted-foreground"
              aria-label="Filter"
            >
              <SlidersHorizontal className="size-4" />
            </button>
            <button
              type="button"
              className="size-9 rounded-lg border bg-white hover:bg-muted/40 flex items-center justify-center text-muted-foreground"
              aria-label="Sort"
            >
              <SlidersHorizontal className="size-4 rotate-90" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <CourseCard
            title="Embedded Systems"
            teacher="Prof. Marcus Thorne"
            university="MIT"
            semester="Semester 2"
            variant="trending"
            href="/student/courses/2"
          />

          <CourseCard
            title="Organic Chemistry II"
            teacher="Dr. Linda Kovac"
            university="Harvard"
            semester="Semester 1"
            variant="trending"
            href="/student/courses/2"
          />

          <CourseCard
            title="Network Security"
            teacher="Prof. James Wu"
            university="Caltech"
            semester="Semester 3"
            variant="trending"
            href="/student/courses/2"
          />

          <CourseCard
            title="Strategic Management"
            teacher="Dr. Arthur Pendragon"
            university="Oxford"
            semester="Semester 1"
            variant="trending"
            href="/student/courses/2"
          />
        </div>
      </section>
      </FadeIn>
    </div>
  )
}
