"use client"

import { useState } from "react"
import { FileText, Download, UploadCloud, Bot, FileUp, Sparkles, Folder } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ContextSelectionModal } from "@/components/generation/context-selection-modal"

// Mock Data
const MOCK_PERSONAL_FILES = [
  { id: "101", name: "My_Research_Paper.pdf", date: "Today, 10:00 AM", size: "1.2 MB" },
  { id: "102", name: "Chapter_5_Draft.docx", date: "Yesterday", size: "450 KB" },
]

const MOCK_GENERATED = [
  { id: "1", title: "Global Economy Impact Summary", date: "Oct 21, 2024", type: "Summary", from: "My_Research_Paper.pdf" },
  { id: "2", title: "Chapter 5 Key Points", date: "Oct 18, 2024", type: "Flashcards", from: "Chapter_5_Draft.docx" },
]

export default function StudentNotesPage() {
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = () => {
    setIsUploading(true)
    setTimeout(() => {
      setIsUploading(false)
      alert("File uploaded successfully!")
    }, 2000)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Study Vault</h1>
        <p className="mt-1 text-muted-foreground">
          Upload your own personal materials to generate smart summaries, flashcards, and study guides.
        </p>
      </div>

      {/* Upload Zone */}
      <Card className="border-dashed border-2 bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="p-4 rounded-full bg-primary/10 text-primary mb-4">
            <UploadCloud className="size-8" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Drag and drop your files here</h3>
          <p className="text-sm text-muted-foreground max-w-sm mb-6">
            We support PDF, DOCX, PPTX, and standard image files (up to 25MB each).
          </p>
          <Button onClick={handleUpload} disabled={isUploading} className="px-8">
            {isUploading ? "Uploading..." : "Browse Files"}
          </Button>
        </CardContent>
      </Card>

      <Tabs defaultValue="files" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
          <TabsTrigger value="files">My Uploaded Files</TabsTrigger>
          <TabsTrigger value="generated">AI Generated Library</TabsTrigger>
        </TabsList>

        {/* PERSONAL UPLOADED FILES TAB */}
        <TabsContent value="files" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
              <div>
                <CardTitle>Personal Files</CardTitle>
                <CardDescription>Generate study materials directly from your uploads.</CardDescription>
              </div>
              <ContextSelectionModal defaultType="Summary" availableFiles={MOCK_PERSONAL_FILES}>
                <Button variant="default" className="gap-2">
                  <Sparkles className="size-4" /> Generate AI Notes
                </Button>
              </ContextSelectionModal>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y border-b">
                {MOCK_PERSONAL_FILES.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-blue-50 text-blue-500">
                        <FileText className="size-5" />
                      </div>
                      <div>
                        <p className="font-medium text-sm sm:text-base">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.date} &bull; {file.size}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 shrink-0">
                      <ContextSelectionModal defaultType="Flashcards" availableFiles={[{id: file.id, name: file.name}]}>
                        <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                          Create Flashcards
                        </Button>
                      </ContextSelectionModal>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {MOCK_PERSONAL_FILES.length === 0 && (
                  <div className="p-8 text-center text-muted-foreground flex flex-col items-center">
                    <Folder className="size-12 mb-3 text-muted" />
                    <p>No files uploaded yet.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GENERATED CONTENT TAB */}
        <TabsContent value="generated" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {MOCK_GENERATED.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Badge variant="secondary" className="font-medium">
                      {item.type}
                    </Badge>
                    <span>{item.date}</span>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                  <CardDescription className="text-xs mt-2 line-clamp-1">
                    Generated from: <span className="font-medium">{item.from}</span>
                  </CardDescription>
                </CardHeader>
                <CardFooter className="pt-0 flex gap-2">
                  <Button variant="outline" className="w-full text-xs h-8">View</Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
                    <Download className="size-3" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {MOCK_GENERATED.length === 0 && (
            <div className="p-12 text-center border-2 border-dashed rounded-xl bg-muted/20 text-muted-foreground">
               <Bot className="size-12 mx-auto mb-3 text-muted" />
               <p className="font-medium text-foreground text-lg mb-1">No generated content</p>
               <p className="text-sm">Select one of your uploaded files to start generating AI notes.</p>
            </div>
          )}
        </TabsContent>

      </Tabs>
    </div>
  )
}
