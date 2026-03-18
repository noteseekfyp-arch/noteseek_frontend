"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import {
  FileText,
  Download,
  Save,
  BookOpen,
  ListHeart,
  Lightbulb,
  FileDigit,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function AINotesPage() {
  const params = useParams()
  const notesId = params.id

  const materialName = "Lecture_01_Introduction.pdf"

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] max-w-7xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">AI Generated Notes</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary">Generated</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4" />
            <span>Source: <span className="font-medium">{materialName}</span></span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Save className="size-4" /> Save Notes
          </Button>
          <Button variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
            <Download className="size-4" /> PDF
          </Button>
          <Button variant="outline" className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
            <Download className="size-4" /> DOCX
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Main Notes Viewer */}
        <Card className="flex-1 flex flex-col min-h-0 border-2">
          <CardHeader className="shrink-0 border-b bg-muted/20 pb-4">
            <CardTitle className="text-lg">Detailed Notes</CardTitle>
            <CardDescription>Comprehensive markdown notes generated from the source material.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-6 prose prose-slate max-w-none">
                <h2>1. Introduction to the Course</h2>
                <p>
                  This section covers the fundamental concepts that will be explored throughout the semester. Focus is highly placed on understanding the underlying mechanics of modern systems rather than just applications.
                </p>
                
                <h3>1.1 Basic Terminology</h3>
                <ul>
                  <li><strong>Algorithm:</strong> A step-by-step procedure for calculations.</li>
                  <li><strong>Data Structure:</strong> A data organization, management, and storage format that enables efficient access and modification.</li>
                  <li><strong>System Architecture:</strong> The conceptual model that defines the structure, behavior, and more views of a system.</li>
                </ul>

                <h3>1.2 The Evolution of Computing</h3>
                <p>
                  From early mechanical computers to modern quantum machines, the journey of computing has been exponential. Key milestones include the invention of the transistor, the development of von Neumann architecture, and the advent of the internet.
                </p>

                <blockquote>
                  "Computer science is no more about computers than astronomy is about telescopes." - Edsger W. Dijkstra
                </blockquote>

                <h3>1.3 Core Principles</h3>
                <p>
                  We will dive deep into principles such as abstraction, modularity, and encapsulation. These are critical for building scalable software solutions.
                </p>
                
                {/* Simulated long content */}
                <div className="h-40 bg-muted/20 rounded-xl my-4 flex items-center justify-center text-muted-foreground border border-dashed">
                  Diagram Visualization (Placeholder)
                </div>
                
                <p>
                  As we proceed, you will be expected to implement these concepts in weekly lab assignments. 
                </p>
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="w-full lg:w-96 shrink-0 flex flex-col min-h-0">
          <Tabs defaultValue="summary" className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-3 shrink-0">
              <TabsTrigger value="summary" className="text-xs sm:text-sm">Summary</TabsTrigger>
              <TabsTrigger value="keypoints" className="text-xs sm:text-sm">Key Points</TabsTrigger>
              <TabsTrigger value="flashcards" className="text-xs sm:text-sm">Flashcards</TabsTrigger>
            </TabsList>

            <div className="flex-1 mt-4 overflow-hidden">
              <TabsContent value="summary" className="h-full m-0 p-0">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3 shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <BookOpen className="size-4 text-primary" /> Brief Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      The introductory lecture sets the stage for the entire course by defining core terminologies like Algorithms and Data Structures. It explores the historical evolution of computing from mechanical to quantum, and emphasizes crucial software engineering principles such as abstraction and modularity. Students are prepared for a rigorous hands-on approach through weekly lab assignments.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="keypoints" className="h-full m-0 p-0">
                <Card className="h-full flex flex-col">
                  <CardHeader className="pb-3 shrink-0">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Lightbulb className="size-4 text-amber-500" /> Key Takeaways
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-auto">
                    <ul className="space-y-4 text-sm">
                      <li className="flex gap-3 items-start">
                        <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">1</div>
                        <span className="text-muted-foreground">Understanding underlying mechanics is more important than memorizing applications.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">2</div>
                        <span className="text-muted-foreground">Abstraction and modularity are the pillars of scalable software architecture.</span>
                      </li>
                      <li className="flex gap-3 items-start">
                        <div className="size-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">3</div>
                        <span className="text-muted-foreground">Weekly labs are mandatory for applying theoretical concepts.</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flashcards" className="h-full m-0 p-0">
                <Card className="h-full flex flex-col bg-slate-50 border-dashed">
                  <CardHeader className="pb-3 shrink-0 text-center">
                    <CardTitle className="flex items-center justify-center gap-2 text-base">
                      <FileDigit className="size-4 text-violet-500" /> Deck: Intro Concepts
                    </CardTitle>
                    <CardDescription>5 cards generated</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 flex items-center justify-center p-6">
                    <div className="w-full aspect-[4/3] bg-white rounded-xl shadow-sm border p-6 flex items-center justify-center text-center cursor-pointer hover:shadow-md transition">
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">Front</p>
                        <p className="font-medium text-lg">What is a Data Structure?</p>
                        <p className="text-xs text-muted-foreground mt-4 opacity-0 hover:opacity-100 transition-opacity">
                          Click to flip
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="shrink-0 flex justify-between px-6 pb-6">
                    <Button variant="ghost" size="sm">Previous</Button>
                    <span className="text-sm font-medium">1 / 5</span>
                    <Button variant="ghost" size="sm">Next</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
