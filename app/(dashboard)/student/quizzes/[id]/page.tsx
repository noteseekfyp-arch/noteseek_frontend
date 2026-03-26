"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { CheckCircle2, ChevronLeft, ChevronRight, AlertCircle, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
// import { Textarea } from "@/components/ui/textarea" // For open ended questions if needed

// Mock Quiz Data
const MOCK_QUIZ = {
  id: "quiz-101",
  title: "Midterm Practice Quiz",
  course: "Introduction to Computer Science (CS101)",
  timeLimit: 45, // minutes
  questions: [
    {
      id: "q1",
      question: "Which data structure uses LIFO (Last In First Out) ordering?",
      options: ["Queue", "Tree", "Stack", "Linked List"],
    },
    {
      id: "q2",
      question: "What is the time complexity of a binary search algorithm in the worst case?",
      options: ["O(1)", "O(n)", "O(n log n)", "O(log n)"],
    },
    {
      id: "q3",
      question: "Which of the following sorting algorithms is generally the fastest for large datasets?",
      options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    },
    {
      id: "q4",
      question: "What does HTTP stand for?",
      options: ["Hyper Text Transfer Protocol", "Hyper Transfer Text Protocol", "High Text Transfer Protocol", "Hyper Text Transmission Protocol"],
    }
  ]
}

export default function StudentQuizPage() {
  const params = useParams()
  const quizId = params.id
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [score, setScore] = useState(0)

  const handleNext = () => {
    if (currentQuestionIndex < MOCK_QUIZ.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleOptionSelect = (option: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: option
    }))
  }

  const handleSubmit = () => {
    // Basic mock scoring
    setScore(Math.floor(Math.random() * 40) + 60) // Random score between 60-100
    setIsSubmitted(true)
  }

  const currentQuestion = MOCK_QUIZ.questions[currentQuestionIndex]
  const progressPercentage = ((Object.keys(answers).length) / MOCK_QUIZ.questions.length) * 100

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto mt-12">
        <Card className="text-center p-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-full bg-green-100 text-green-600">
              <CheckCircle2 className="size-12" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold mb-2">Quiz Completed!</CardTitle>
          <CardDescription className="text-lg mb-8">
            You have successfully submitted '{MOCK_QUIZ.title}'.
          </CardDescription>
          
          <div className="bg-muted/30 rounded-xl p-6 mb-8 inline-block min-w-48">
             <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">Your Score</p>
             <p className={`text-4xl font-bold ${score >= 70 ? 'text-green-600' : 'text-amber-600'}`}>
               {score}%
             </p>
          </div>

          <div>
            <Button onClick={() => window.history.back()} variant="outline">
              Return to Course
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4 pb-4 border-b">
        <div>
          <p className="text-sm font-medium text-primary mb-1">{MOCK_QUIZ.course}</p>
          <h1 className="text-3xl font-bold tracking-tight">{MOCK_QUIZ.title}</h1>
        </div>
        <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-md font-medium text-sm">
          <Clock className="size-4" /> 
          <span>{MOCK_QUIZ.timeLimit} mins remaining</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_250px] gap-8">
        {/* Main Quiz Area */}
        <div className="space-y-6">
          <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
            <span>Question {currentQuestionIndex + 1} of {MOCK_QUIZ.questions.length}</span>
            <span>{Object.keys(answers).length} answered</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          <Card className="mt-6 border-2 border-muted/50 shadow-sm">
            <CardHeader className="bg-muted/20 pb-6">
              <CardTitle className="text-xl leading-relaxed font-semibold">
                {currentQuestion.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RadioGroup 
                value={answers[currentQuestionIndex] || ""} 
                onValueChange={handleOptionSelect}
                className="space-y-3"
              >
                {currentQuestion.options.map((option, idx) => (
                  <div key={idx} className="flex items-center">
                    <RadioGroupItem 
                      value={option} 
                      id={`option-${idx}`} 
                      className="peer sr-only" 
                    />
                    <Label
                      htmlFor={`option-${idx}`}
                      className="flex flex-1 items-center justify-between rounded-lg border-2 border-muted bg-transparent p-4 hover:bg-muted/50 hover:border-primary/50 cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 transition-colors"
                    >
                      <span className="text-base font-medium">{option}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>

          <div className="flex justify-between items-center pt-4">
            <Button 
              variant="outline" 
              onClick={handlePrev} 
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2 size-4" /> Previous
            </Button>

            {currentQuestionIndex === MOCK_QUIZ.questions.length - 1 ? (
              <Button onClick={handleSubmit} className="px-8 shadow-md">
                Submit Quiz
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next <ChevronRight className="ml-2 size-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="hidden md:block">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm">Questions Navigator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {MOCK_QUIZ.questions.map((_, idx) => {
                  const isAnswered = !!answers[idx];
                  const isCurrent = currentQuestionIndex === idx;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentQuestionIndex(idx)}
                      className={`
                        size-10 rounded-md flex items-center justify-center font-medium text-sm transition-colors border
                        ${isCurrent ? 'ring-2 ring-primary ring-offset-1 border-primary bg-primary text-primary-foreground' : ''}
                        ${isAnswered && !isCurrent ? 'bg-primary/10 border-primary/30 text-primary' : ''}
                        ${!isAnswered && !isCurrent ? 'bg-muted/30 border-transparent hover:bg-muted text-muted-foreground' : ''}
                      `}
                    >
                      {idx + 1}
                    </button>
                  )
                })}
              </div>

              <div className="mt-6 flex flex-col gap-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-sm bg-primary/10 border border-primary/30"></div> Answered
                </div>
                <div className="flex items-center gap-2">
                  <div className="size-3 rounded-sm bg-muted/30 border border-transparent"></div> Not Answered
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
