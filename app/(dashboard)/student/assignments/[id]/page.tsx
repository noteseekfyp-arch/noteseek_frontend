"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { CheckCircle2, UploadCloud, FileText, CalendarClock, Download, FileUp, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"

// Mock Assignment Data
const MOCK_ASSIGNMENT = {
  id: "assign-202",
  title: "Assignment #1: Intro Concepts",
  course: "Introduction to Computer Science (CS101)",
  dueDate: "Oct 25, 2024 - 11:59 PM",
  points: 100,
  description: "Write a short summary on the history of operating systems mentioned in Chapter 1. Then, implement a basic queue data structure in Python and submit the code file or text below. Make sure to comment your code thoroughly explaining each operation.",
  attachments: [
    { id: "att-1", name: "Assignment_1_Rubric.pdf", size: "120 KB" }
  ],
  status: "Pending" // "Pending" | "Submitted" | "Graded"
}

export default function StudentAssignmentPage() {
  const params = useParams()
  const assignmentId = params.id
  
  const [submissionText, setSubmissionText] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(MOCK_ASSIGNMENT.status)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false)
      setStatus("Submitted")
      alert("Assignment submitted successfully!")
    }, 1500)
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-4 border-b">
        <div>
          <p className="text-sm font-medium text-primary mb-1">{MOCK_ASSIGNMENT.course}</p>
          <h1 className="text-3xl font-bold tracking-tight mb-2">{MOCK_ASSIGNMENT.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Badge variant={status === "Submitted" ? "default" : "outline"} className={status === "Submitted" ? "bg-green-600 hover:bg-green-700" : "text-amber-600 border-amber-200 bg-amber-50"}>
               {status}
            </Badge>
            <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <CalendarClock className="size-4" /> Due: {MOCK_ASSIGNMENT.dueDate}
            </span>
            <span className="text-muted-foreground font-medium border-l pl-4">
              Points: {MOCK_ASSIGNMENT.points}
            </span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_380px] gap-8">
        
        {/* Left Column: Instructions & Details */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b bg-muted/20">
              <CardTitle className="text-lg">Instructions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {MOCK_ASSIGNMENT.description}
              </p>
            </CardContent>
          </Card>

          {MOCK_ASSIGNMENT.attachments.length > 0 && (
            <Card>
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="text-lg">Teacher Attachments</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 p-0">
                <div className="divide-y relative">
                  {MOCK_ASSIGNMENT.attachments.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="size-5 text-blue-500" />
                        <div>
                          <p className="font-medium text-sm">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground shrink-0">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Submission Area */}
        <div className="space-y-6">
          <Card className={status === "Submitted" ? "border-green-200 shadow-sm" : ""}>
            <CardHeader className={`${status === "Submitted" ? "bg-green-50/50" : "bg-muted/20"}`}>
              <CardTitle className="flex items-center gap-2">
                {status === "Submitted" ? (
                  <CheckCircle2 className="size-5 text-green-600" />
                ) : (
                  <FileUp className="size-5 text-primary" />
                )}
                Your Submission
              </CardTitle>
              {status === "Submitted" && (
                <CardDescription className="text-green-700 font-medium">
                  Successfully submitted for grading.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {status === "Pending" ? (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Text Submission (Optional)</label>
                    <Textarea 
                      placeholder="Type your answer or paste a link here..." 
                      className="min-h-32 resize-none"
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-2 text-muted-foreground font-medium">
                        And / Or
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">File Upload</label>
                    <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/10 hover:bg-muted/30 transition-colors relative">
                      <UploadCloud className="size-8 text-muted-foreground mb-2" />
                      {uploadedFile ? (
                        <div className="font-medium text-sm text-primary flex items-center gap-2">
                          <FileText className="size-4" /> {uploadedFile.name}
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground">PDF, DOCX, ZIP up to 50MB</p>
                        </>
                      )}
                      
                      {/* Hidden File Input */}
                      <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg space-y-4 text-sm">
                  {submissionText && (
                    <div>
                      <span className="font-medium text-muted-foreground block mb-1">Submitted Text:</span>
                      <p className="text-card-foreground italic">"{submissionText}"</p>
                    </div>
                  )}
                  {uploadedFile && (
                    <div>
                      <span className="font-medium text-muted-foreground block mb-1">Attached File:</span>
                      <div className="flex items-center gap-2 font-medium bg-white p-2 border rounded-md">
                        <FileText className="size-4 text-blue-500" /> {uploadedFile.name}
                      </div>
                    </div>
                  )}
                  {!submissionText && !uploadedFile && (
                    <p className="text-muted-foreground italic">Empty submission recorded.</p>
                  )}
                </div>
              )}
            </CardContent>
            
            {status === "Pending" && (
              <CardFooter className="pt-0">
                <Button 
                  className="w-full shadow-sm" 
                  onClick={handleSubmit}
                  disabled={isSubmitting || (!submissionText.trim() && !uploadedFile)}
                >
                  {isSubmitting ? "Submitting..." : "Turn In Assignment"}
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {status === "Pending" && (
            <div className="flex items-start gap-2 text-xs text-muted-foreground p-3 rounded-lg bg-blue-50 text-blue-800 border border-blue-100">
               <AlertCircle className="size-4 shrink-0 mt-0.5" />
               <p>Make sure to review your files before turning in. You cannot undo a submission once it's sent to the instructor.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
