"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Filter, BookOpen } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TeacherCourseCard } from "@/components/course/teacher-course-card"

const MOCK_COURSES = [
  {
    id: "CS101",
    title: "Introduction to Computer Science",
    department: "Computer Science",
    university: "Global University",
    semester: "Fall 2024",
    students: 124,
  },
  {
    id: "CS201",
    title: "Data Structures and Algorithms",
    department: "Computer Science",
    university: "Global University",
    semester: "Fall 2024",
    students: 85,
  },
  {
    id: "MATH101",
    title: "Calculus I",
    department: "Mathematics",
    university: "State College",
    semester: "Fall 2024",
    students: 210,
  },
  {
    id: "PHYS201",
    title: "Physics for Engineers",
    department: "Physics",
    university: "Global University",
    semester: "Spring 2024",
    students: 95,
  },
]

export default function CourseSearchPage() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") ?? ""
  
  const [searchQuery, setSearchQuery] = useState(initialQuery)
  
  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
    }
  }, [initialQuery])

  // Simple client-side mock filtering
  const filteredCourses = MOCK_COURSES.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
        <p className="text-muted-foreground">Search and discover courses from various universities and departments.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-64 space-y-6 shrink-0 bg-white p-5 rounded-xl border">
          <div className="flex items-center gap-2 font-semibold">
            <Filter className="size-5" />
            Filters
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>University</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Universities</SelectItem>
                  <SelectItem value="global">Global University</SelectItem>
                  <SelectItem value="state">State College</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Department</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="math">Mathematics</SelectItem>
                  <SelectItem value="phys">Physics</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="All Semesters" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="fall24">Fall 2024</SelectItem>
                  <SelectItem value="spring24">Spring 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button className="w-full">Apply Filters</Button>
        </aside>

        {/* Search and Results */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 size-5 text-muted-foreground" />
            <Input 
              placeholder="Search courses by name, code, or topic..." 
              className="pl-11 pr-4 py-6 text-lg rounded-xl shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <TeacherCourseCard
                key={course.id}
                title={course.title}
                students={course.students}
                updated="Recently"
                category={course.department}
                href={`/teacher/courses/${course.id}`} // Using teacher link for now, could be student
              />
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-xl bg-muted/20">
              <BookOpen className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No courses found</h3>
              <p className="text-muted-foreground text-center max-w-sm">
                Try adjusting your search query or filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
