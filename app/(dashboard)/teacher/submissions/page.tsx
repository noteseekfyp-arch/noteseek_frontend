"use client"

import { useState } from "react"
import { CheckCircle2, ChevronRight, FileText, Search, GraduationCap, ClipboardList, PenTool, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// Mock Submissions Data
const MOCK_SUBMISSIONS = [
  {
    id: "sub-101",
    studentName: "Alex Johnson",
    studentId: "STU-084",
    course: "Introduction to Computer Science",
    assessmentTitle: "Assignment #1: Intro Concepts",
    type: "Assignment",
    submittedAt: "Oct 25, 2024 - 10:30 AM",
    status: "Needs Grading",
    score: null,
    maxScore: 100,
    content: "Here is my submission for the first assignment. I have attached the code file.",
    attachment: "alex_assignment1.py"
  },
  {
    id: "sub-102",
    studentName: "Sarah Connor",
    studentId: "STU-091",
    course: "Introduction to Computer Science",
    assessmentTitle: "Midterm Practice Quiz",
    type: "Quiz",
    submittedAt: "Oct 24, 2024 - 2:15 PM",
    status: "Auto-Graded",
    score: 85,
    maxScore: 100,
    content: null,
    attachment: null
  },
  {
    id: "sub-103",
    studentName: "John Connor",
    studentId: "STU-092",
    course: "Advanced Literature",
    assessmentTitle: "Essay: AI in Society",
    type: "Assignment",
    submittedAt: "Oct 24, 2024 - 4:45 PM",
    status: "Graded",
    score: 92,
    maxScore: 100,
    content: "Please find my essay exploring the themes we discussed in class.",
    attachment: "essay_ai_society_john.docx"
  },
  {
    id: "sub-104",
    studentName: "Kyle Reese",
    studentId: "STU-095",
    course: "Introduction to Computer Science",
    assessmentTitle: "Assignment #1: Intro Concepts",
    type: "Assignment",
    submittedAt: "Oct 25, 2024 - 11:55 PM",
    status: "Needs Grading",
    score: null,
    maxScore: 100,
    content: "I struggled a bit with the queue implementation, but I commented the parts I wasn't sure about.",
    attachment: "kyle_queue.py"
  }
]

export default function TeacherSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubmission, setSelectedSubmission] = useState<typeof MOCK_SUBMISSIONS[0] | null>(null)
  const [gradeInput, setGradeInput] = useState("")
  const [feedbackInput, setFeedbackInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissions, setSubmissions] = useState(MOCK_SUBMISSIONS)

  const pendingSubmissions = submissions.filter(s => s.status === "Needs Grading" && s.studentName.toLowerCase().includes(searchQuery.toLowerCase()))
  const gradedSubmissions = submissions.filter(s => s.status !== "Needs Grading" && s.studentName.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleGradeSubmit = () => {
    if (!selectedSubmission) return
    setIsSubmitting(true)

    // Simulate API Call
    setTimeout(() => {
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === selectedSubmission.id 
            ? { ...sub, status: "Graded", score: Number(gradeInput) } 
            : sub
        )
      )
      setIsSubmitting(false)
      setSelectedSubmission(null)
      setGradeInput("")
      setFeedbackInput("")
    }, 1000)
  }

  const renderSubmissionRow = (sub: typeof MOCK_SUBMISSIONS[0]) => (
    <div key={sub.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all gap-4 bg-card">
      <div className="flex gap-4 items-start md:items-center">
        <div className={`p-3 rounded-full shrink-0 ${sub.type === "Quiz" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
          {sub.type === "Quiz" ? <ClipboardList className="size-5" /> : <FileText className="size-5" />}
        </div>
        
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg leading-none">{sub.studentName}</h3>
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{sub.studentId}</span>
            {sub.status === "Needs Grading" && (
              <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 rounded-sm">Needs Grading</Badge>
            )}
            {sub.status === "Auto-Graded" && (
              <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 rounded-sm">Auto-Graded</Badge>
            )}
            {sub.status === "Graded" && (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 rounded-sm">Graded</Badge>
            )}
          </div>
          
          <p className="text-sm font-medium text-primary line-clamp-1">{sub.assessmentTitle}</p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1.5">
            <GraduationCap className="size-3.5" /> {sub.course} &bull; Submitted: {sub.submittedAt}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6 border-t pt-4 md:border-0 md:pt-0 shrink-0">
        {sub.score !== null ? (
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Score</p>
            <p className={`text-xl font-bold ${sub.score >= (sub.maxScore * 0.7) ? "text-green-600" : "text-amber-600"}`}>
              {sub.score}<span className="text-sm text-muted-foreground font-medium">/{sub.maxScore}</span>
            </p>
          </div>
        ) : (
           <div className="text-right text-muted-foreground">
             <p className="text-xs uppercase tracking-wider font-semibold">Max Score</p>
             <p className="text-lg font-bold">{sub.maxScore}</p>
           </div>
        )}

        <Button onClick={() => setSelectedSubmission(sub)} variant={sub.status === "Needs Grading" ? "default" : "outline"} className="gap-2 shrink-0">
          {sub.status === "Needs Grading" ? <PenTool className="size-4" /> : <Search className="size-4" />}
          {sub.status === "Needs Grading" ? "Grade Now" : "Review"}
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Submissions</h1>
          <p className="mt-1 text-muted-foreground">
            Review, grade, and provide feedback on your students' assignments and quizzes.
          </p>
        </div>
      </div>

      <Card className="border-0 shadow-none bg-transparent">
        <CardHeader className="px-0 pt-0 pb-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by student name..." 
              className="pl-9 h-11 rounded-full bg-white shadow-sm border-muted/60"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
            <TabsTrigger value="pending">Needs Grading ({pendingSubmissions.length})</TabsTrigger>
            <TabsTrigger value="graded">Graded ({gradedSubmissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-6 space-y-4">
            {pendingSubmissions.length > 0 ? (
              pendingSubmissions.map(renderSubmissionRow)
            ) : (
              <div className="p-12 text-center border-2 border-dashed rounded-xl bg-white text-muted-foreground">
                 <CheckCircle2 className="size-12 mx-auto mb-3 text-green-500/50" />
                 <p className="font-medium text-foreground text-lg mb-1">All caught up!</p>
                 <p className="text-sm">There are no pending submissions requiring your attention.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="graded" className="mt-6 space-y-4">
            {gradedSubmissions.length > 0 ? (
              gradedSubmissions.map(renderSubmissionRow)
            ) : (
              <div className="p-12 text-center border-2 border-dashed rounded-xl bg-white text-muted-foreground">
                 <Search className="size-12 mx-auto mb-3 text-muted" />
                 <p className="font-medium text-foreground text-lg mb-1">No graded submissions</p>
                 <p className="text-sm">Once you grade student submissions or the AI auto-grades quizzes, they will appear here.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* GRADING MODAL */}
      {selectedSubmission && (
        <Dialog open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0 bg-muted/10">
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="text-xl">{selectedSubmission.assessmentTitle}</DialogTitle>
                  <DialogDescription className="mt-1 flex items-center gap-2">
                    <span className="font-medium text-foreground">{selectedSubmission.studentName}</span> 
                    <span>({selectedSubmission.studentId})</span>
                  </DialogDescription>
                </div>
                {selectedSubmission.status !== "Needs Grading" && (
                  <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
                    Score: {selectedSubmission.score} / {selectedSubmission.maxScore}
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              {/* Submission Content */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">Student's Work</h3>
                <div className="bg-muted/30 p-4 rounded-xl text-sm border">
                  {selectedSubmission.content ? (
                    <p className="whitespace-pre-wrap">{selectedSubmission.content}</p>
                  ) : (
                    <p className="italic text-muted-foreground">No text submitted. Please refer to attachments.</p>
                  )}
                  
                  {selectedSubmission.attachment && (
                    <div className="mt-4 pt-4 border-t flex items-center justify-between">
                      <div className="flex items-center gap-2 font-medium text-primary">
                        <FileText className="size-4" /> {selectedSubmission.attachment}
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Grading Form */}
              {selectedSubmission.status === "Needs Grading" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Grading Panel</h3>
                  <div className="grid sm:grid-cols-3 gap-6">
                    <div className="space-y-2 sm:col-span-1 border p-4 rounded-xl bg-card shadow-sm">
                      <Label htmlFor="score" className="font-bold text-primary">Points Awarded</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="score" 
                          type="number" 
                          max={selectedSubmission.maxScore} 
                          min={0}
                          value={gradeInput}
                          onChange={(e) => setGradeInput(e.target.value)}
                          className="font-bold text-lg"
                        />
                        <span className="text-muted-foreground font-medium shrink-0">/ {selectedSubmission.maxScore}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="feedback">Instructor Feedback (Optional)</Label>
                      <Textarea 
                        id="feedback" 
                        placeholder="Excellent work on the code structure, but..." 
                        className="resize-none h-24"
                        value={feedbackInput}
                        onChange={(e) => setFeedbackInput(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="px-6 py-4 border-t shrink-0 bg-muted/10 gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                {selectedSubmission.status === "Needs Grading" ? "Cancel" : "Close"}
              </Button>
              {selectedSubmission.status === "Needs Grading" && (
                <Button 
                  onClick={handleGradeSubmit} 
                  disabled={!gradeInput || isSubmitting || Number(gradeInput) < 0 || Number(gradeInput) > selectedSubmission.maxScore}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? "Saving..." : "Submit Grade"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
