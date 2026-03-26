"use client"

import { useState } from "react"
import { ClipboardCheck, Sparkles, CheckCircle2, Bot } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function TeacherCreateQuizPage() {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  const handleCreate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setIsCompleted(true)
    }, 2000)
  }

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="text-center p-8 border-2 border-primary/20 shadow-lg">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-12" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">Quiz Deployed!</CardTitle>
          <CardDescription className="text-lg mb-8">
            The AI has successfully generated the quiz questions and it is now active for your students to take.
          </CardDescription>
          
          <div className="flex justify-center gap-4">
            <Button onClick={() => window.location.href = "/teacher"}>Return to Dashboard</Button>
            <Button variant="outline" onClick={() => setIsCompleted(false)}>Create Another Quiz</Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary">
            <ClipboardCheck className="size-6" />
          </div>
          AI Quiz Generator
        </h1>
        <p className="mt-2 text-muted-foreground">
          Instantly build diverse multiple-choice and short-answer quizzes based strictly on your uploaded materials.
        </p>
      </div>

      <Card className="border-2 shadow-sm">
        <CardHeader className="bg-muted/20 border-b pb-6">
          <CardTitle>Quiz Parameters</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-8 pt-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Target Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs101">Introduction to Computer Science</SelectItem>
                  <SelectItem value="eng202">Advanced Literature</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Source Material (Required)</Label>
              <Select disabled={!selectedCourse}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedCourse ? "Select specific lecture/file..." : "Select course first"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="l1">Lecture 1 - Basics.pdf</SelectItem>
                  <SelectItem value="l2">Chapter 3 Slides.pptx</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>Quiz Title</Label>
              <Input placeholder="e.g. Chapter 3 Micro-Quiz" />
            </div>
            <div className="space-y-2">
              <Label>Number of Questions</Label>
              <Input type="number" defaultValue={10} min={1} max={50} />
            </div>
            <div className="space-y-2">
              <Label>Time Limit (Minutes)</Label>
              <Input type="number" defaultValue={15} min={5} />
            </div>
          </div>

          <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 flex gap-3 items-start">
             <Bot className="size-5 shrink-0 text-primary mt-0.5" />
             <p className="text-sm text-primary-800 leading-relaxed">
               The AI will automatically extract key terms, formulas, and definitions from the selected source material to build distractors and correct answers. You can manually edit the questions after generation if needed.
             </p>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/10 border-t p-6 flex justify-end">
          <Button 
            size="lg" 
            onClick={handleCreate} 
            disabled={isGenerating || !selectedCourse}
            className="w-full sm:w-auto min-w-[200px]"
          >
            {isGenerating ? "Building Quiz..." : (
               <>Generate Quiz <Sparkles className="ml-2 size-4" /></>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
