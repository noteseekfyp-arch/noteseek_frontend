"use client"

import Link from "next/link"
import { Bot, Clock, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock Quizzes Data across all courses
const MOCK_QUIZZES = [
  { 
    id: "quiz-101", 
    title: "Midterm Practice Quiz", 
    course: "Introduction to Computer Science", 
    duration: "45 mins",
    status: "Pending", 
  },
  { 
    id: "quiz-102", 
    title: "Module 3 Assessment", 
    course: "Economics 101", 
    duration: "30 mins",
    status: "Pending", 
  },
  { 
    id: "quiz-099", 
    title: "Derivatives Quiz", 
    course: "Advanced Calculus", 
    duration: "60 mins",
    status: "Completed", 
    score: 85
  },
  { 
    id: "quiz-098", 
    title: "Thermodynamics Basics", 
    course: "Quantum Physics", 
    duration: "20 mins",
    status: "Completed", 
    score: 95
  },
]

export default function StudentQuizzesGlobalPage() {
  const pendingQuizzes = MOCK_QUIZZES.filter(q => q.status === "Pending")
  const completedQuizzes = MOCK_QUIZZES.filter(q => q.status === "Completed")

  const renderQuizCard = (quiz: typeof MOCK_QUIZZES[0]) => (
    <Card key={quiz.id} className="hover:shadow-md transition">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="font-normal text-muted-foreground truncate max-w-[180px]">
            {quiz.course}
          </Badge>
          {quiz.status === "Pending" && (
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>
          )}
          {quiz.status === "Completed" && (
            <Badge className={`gap-1 ${quiz.score && quiz.score >= 70 ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
              <CheckCircle2 className="size-3" /> {quiz.score}%
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{quiz.title}</CardTitle>
        <CardDescription className="flex items-center gap-1.5 mt-2 text-primary font-medium text-xs">
          <Clock className="size-3.5" /> Time Limit: {quiz.duration}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <Button asChild className="w-full" variant={quiz.status === "Pending" ? "default" : "outline"}>
          <Link href={`/student/quizzes/${quiz.id}`}>
            {quiz.status === "Pending" ? "Start Quiz" : "View Results"} <ChevronRight className="ml-2 size-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
        <p className="mt-1 text-muted-foreground">
          View all your upcoming assessments and past quiz results.
        </p>
      </div>

      {pendingQuizzes.length > 0 && (
        <div className="bg-primary/10 border border-primary/20 text-primary-800 p-4 rounded-xl flex items-start gap-3">
          <Bot className="size-5 shrink-0 mt-0.5 text-primary" />
          <div>
            <h4 className="font-semibold text-sm text-primary">You have {pendingQuizzes.length} pending quiz(zes)</h4>
            <p className="text-sm mt-1 opacity-90">Find a quiet place and ensure you have enough time before starting a quiz.</p>
          </div>
        </div>
      )}

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="pending">Pending ({pendingQuizzes.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedQuizzes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-6">
          {pendingQuizzes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pendingQuizzes.map(renderQuizCard)}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
               <CheckCircle2 className="size-12 mx-auto mb-3 text-green-500/50" />
               <p className="font-medium text-foreground text-lg mb-1">No pending quizzes!</p>
               <p className="text-sm">Enjoy your free time.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          {completedQuizzes.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completedQuizzes.map(renderQuizCard)}
            </div>
          ) : (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
               <Bot className="size-12 mx-auto mb-3 text-muted" />
               <p className="font-medium text-foreground text-lg mb-1">No completed quizzes</p>
               <p className="text-sm">Your graded quizzes will appear here.</p>
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}
