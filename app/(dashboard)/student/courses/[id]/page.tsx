"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { FileText, Download, Bot, CheckCircle, FileUp, Sparkles, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Building2, BookA, Clock, Users } from "lucide-react"
import { ContextSelectionModal } from "@/components/generation/context-selection-modal"

// Mock Data
const MOCK_FILES = [
  { id: "1", name: "Lecture_01_Introduction.pdf", date: "Oct 12, 2024", size: "2.4 MB" },
  { id: "2", name: "Chapter_3_Slides.pptx", date: "Oct 15, 2024", size: "5.1 MB" },
  { id: "3", name: "Midterm_Study_Guide.docx", date: "Oct 20, 2024", size: "1.2 MB" },
]

const MOCK_GENERATED = [
  { id: "1", title: "My Custom Flashcards", date: "Oct 21, 2024", type: "Flashcards" },
  { id: "2", title: "Lecture 1 Summary Notes", date: "Oct 18, 2024", type: "Summary" },
]

export default function StudentCoursePage() {
  const params = useParams()
  const courseId = params.id
  const [isEnrolled, setIsEnrolled] = useState(true)

  // Real implementation will fetch course by ID
  const course = {
    title: "Introduction to Computer Science",
    code: "CS101",
    department: "Computer Science",
    university: "Global University",
    teacher: "Prof. Anderson",
    semester: "Fall 2024",
    students: 124,
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Course Info Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
            <Badge variant="secondary">{course.code}</Badge>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground"><Users className="size-4" /> Instructor: {course.teacher}</span>
            <span className="flex items-center gap-1.5"><Building2 className="size-4" /> {course.university}</span>
            <span className="flex items-center gap-1.5"><BookA className="size-4" /> {course.department}</span>
            <span className="flex items-center gap-1.5"><Clock className="size-4" /> {course.semester}</span>
          </div>
        </div>

        <div className="flex gap-2 shrink-0">
          {!isEnrolled ? (
            <Button onClick={() => setIsEnrolled(true)} className="gap-2">
              <CheckCircle className="size-4" /> Enroll Now
            </Button>
          ) : (
            <Button variant="outline" className="text-green-600 border-green-200 bg-green-50 pointer-events-none">
              <CheckCircle className="mr-2 size-4" /> Enrolled
            </Button>
          )}
          <ContextSelectionModal defaultType="Summary" availableFiles={MOCK_FILES}>
            <Button variant="default" className="gap-2 shrink-0">
              <Sparkles className="size-4" /> Generate Study Guide
            </Button>
          </ContextSelectionModal>
        </div>
      </div>

      <Tabs defaultValue="materials" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="materials">Course Materials</TabsTrigger>
          <TabsTrigger value="assessments">Pending Assessments</TabsTrigger>
          <TabsTrigger value="my-notes">My AI Notes</TabsTrigger>
        </TabsList>

        {/* MATERIALS TAB */}
        <TabsContent value="materials" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Materials Provided by Instructor</CardTitle>
              <CardDescription>Download slides and documents or generate active recall materials directly from them.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 font-medium border-b bg-muted/50 text-sm">
                  <div>File Name</div>
                  <div className="w-24 text-right">Date</div>
                  <div className="w-48 text-right">Actions</div>
                </div>
                {MOCK_FILES.map((file) => (
                  <div key={file.id} className="grid grid-cols-[1fr_auto_auto] gap-4 p-4 text-sm items-center border-b last:border-0 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="size-4 text-blue-500" />
                      <div>
                        <p className="font-medium truncate max-w-[200px] sm:max-w-[400px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{file.size}</p>
                      </div>
                    </div>
                    <div className="w-24 text-right text-muted-foreground">{file.date}</div>
                    <div className="w-48 flex justify-end gap-2">
                      <ContextSelectionModal defaultType="Flashcards" availableFiles={[{id: file.id, name: file.name}]}>
                        <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-primary">
                          <Wand2 className="size-3.5" /> <span className="hidden sm:inline">AI Generate</span>
                        </Button>
                      </ContextSelectionModal>
                      <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                        <Download className="size-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ASSESSMENTS TAB */}
        <TabsContent value="assessments" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2.5 w-fit rounded-lg bg-primary/10 text-primary">
                    <Bot className="size-6" />
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
                </div>
                <CardTitle>Midterm Practice Quiz</CardTitle>
                <CardDescription>Created by Prof. Anderson &#x2022; Due in 3 days</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Start Quiz</Button>
              </CardContent>
            </Card>

            <Card className="hover:border-primary/50 transition-colors group">
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2.5 w-fit rounded-lg bg-blue-100 text-blue-600">
                    <FileUp className="size-6" />
                  </div>
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
                </div>
                <CardTitle>Assignment #1: Intro Concepts</CardTitle>
                <CardDescription>Created by Prof. Anderson &#x2022; Due next week</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" variant="secondary">View Details</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* MY AI NOTES TAB */}
        <TabsContent value="my-notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>My Generated Library</CardTitle>
              <CardDescription>Review and download the AI notes, summaries, and flashcards you generated for this course.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_GENERATED.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border gap-4 hover:shadow-sm transition">
                    <div className="flex gap-4 items-center">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10">
                        {item.type === "Flashcards" && <Bot className="size-5 text-primary" />}
                        {item.type === "Summary" && <FileText className="size-5 text-primary" />}
                      </div>
                      <div>
                        <p className="font-medium cursor-pointer hover:underline text-primary">{item.title}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">{item.type}</Badge>
                          <span>Generated: {item.date}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <Download className="mr-2 size-3" /> PDF
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 text-blue-600 border-blue-200 hover:bg-blue-50">
                        <Download className="mr-2 size-3" /> DOCX
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  )
}
