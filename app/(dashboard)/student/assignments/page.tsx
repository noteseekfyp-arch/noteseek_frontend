"use client"

import Link from "next/link"
import { FileUp, CalendarClock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Assignments Data across all courses
const MOCK_ASSIGNMENTS = [
  { 
    id: "assign-202", 
    title: "Assignment #1: Intro Concepts", 
    course: "Introduction to Computer Science", 
    dueDate: "Oct 25, 2024", 
    status: "Pending", 
    points: 100 
  },
  { 
    id: "assign-203", 
    title: "Essay: The Impact of AI on Modern Economy", 
    course: "Economics 101", 
    dueDate: "Oct 28, 2024", 
    status: "Pending", 
    points: 50 
  },
  { 
    id: "assign-105", 
    title: "Calculus Problem Set 3", 
    course: "Advanced Calculus", 
    dueDate: "Oct 15, 2024", 
    status: "Submitted", 
    points: 100 
  },
  { 
    id: "assign-098", 
    title: "Physics Lab Report #2", 
    course: "Quantum Physics", 
    dueDate: "Oct 10, 2024", 
    status: "Graded", 
    points: 100,
    score: 92
  },
]

export default function StudentAssignmentsGlobalPage() {
  const pendingAssignments = MOCK_ASSIGNMENTS.filter(a => a.status === "Pending")
  const completedAssignments = MOCK_ASSIGNMENTS.filter(a => a.status !== "Pending")

  const renderAssignmentCard = (assignment: typeof MOCK_ASSIGNMENTS[0]) => (
    <Card key={assignment.id} className="hover:shadow-md transition">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="font-normal text-muted-foreground">
            {assignment.course}
          </Badge>
          {assignment.status === "Pending" && (
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
          )}
          {assignment.status === "Submitted" && (
            <Badge className="bg-blue-600 hover:bg-blue-700">Submitted</Badge>
          )}
          {assignment.status === "Graded" && (
            <Badge className="bg-green-600 hover:bg-green-700 gap-1">
              <CheckCircle2 className="size-3" /> {assignment.score}/{assignment.points}
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{assignment.title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 mt-2 text-primary font-medium">
          <CalendarClock className="size-4" /> Due: {assignment.dueDate}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button asChild className="w-full" variant={assignment.status === "Pending" ? "default" : "outline"}>
          <Link href={`/student/assignments/${assignment.id}`}>
            {assignment.status === "Pending" ? "Start Assignment" : "View Submission"} <ChevronRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
        <p className="mt-1 text-muted-foreground">
          Track and submit all your coursework across enrolled courses.
        </p>
      </div>

      {pendingAssignments.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl flex items-start gap-3">
          <AlertCircle className="size-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-sm">You have {pendingAssignments.length} pending assignment(s)</h4>
            <p className="text-sm mt-1 opacity-90">Make sure to submit them before their respective deadlines to avoid point deductions.</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="pending">Pending ({pendingAssignments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedAssignments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingAssignments.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pendingAssignments.map(renderAssignmentCard)}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
               <CheckCircle2 className="size-12 mx-auto mb-3 text-green-500/50" />
               <p className="font-medium text-foreground text-lg mb-1">You're all caught up!</p>
               <p className="text-sm">You have no pending assignments at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedAssignments.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completedAssignments.map(renderAssignmentCard)}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
               <FileUp className="size-12 mx-auto mb-3 text-muted" />
               <p className="font-medium text-foreground text-lg mb-1">No completed assignments</p>
               <p className="text-sm">Assignments you submit will appear here.</p>
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}
