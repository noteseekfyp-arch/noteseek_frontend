"use client"

import { useState } from "react"
import { ReactNode } from "react"
import { Bot, FileText, CheckCircle2, ChevronRight, Wand2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface ContextSelectionModalProps {
  children?: ReactNode
  defaultType?: "Quiz" | "Assignment" | "Summary" | "Flashcards"
  availableFiles?: { id: string; name: string }[]
}

const DEFAULT_FILES = [
  { id: "1", name: "Lecture_01_Introduction.pdf" },
  { id: "2", name: "Chapter_3_Slides.pptx" },
]

export function ContextSelectionModal({
  children,
  defaultType = "Quiz",
  availableFiles = DEFAULT_FILES,
}: ContextSelectionModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(availableFiles[0]?.id)
  const [rangeType, setRangeType] = useState("all") // "all" | "custom"
  const [customRange, setCustomRange] = useState("")
  const [focusArea, setFocusArea] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    setIsGenerating(true)
    
    console.log({
      type: defaultType,
      file: selectedFile,
      rangeParameters: rangeType === "all" ? "All pages" : customRange,
      focusArea,
    })

    // Simulate AI Generation
    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    setIsGenerating(false)
    setOpen(false)
    
    // In a real app, we might redirect to a generation progress page or the generated notes page
    // window.location.href = `/notes/generated-id-123`
    alert(`Successfully generated ${defaultType}!`)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="secondary">
            <Wand2 className="mr-2 size-4" /> Generate {defaultType}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="size-5 text-primary" />
            Generate {defaultType}
          </DialogTitle>
          <DialogDescription>
            Select the source material and define the exact scope you want the AI to focus on for generation.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Step 1: Select Material */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
              Select Source Material
            </h3>
            <div className="grid gap-2 pl-8">
              {availableFiles.map((file) => (
                <div
                  key={file.id}
                  onClick={() => setSelectedFile(file.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                    selectedFile === file.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className={`size-4 ${selectedFile === file.id ? "text-primary" : "text-muted-foreground"}`} />
                    <span className={`text-sm ${selectedFile === file.id ? "font-medium" : ""}`}>
                      {file.name}
                    </span>
                  </div>
                  {selectedFile === file.id && (
                    <CheckCircle2 className="size-4 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 2: Select Scope/Range */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
              What parts of the document?
            </h3>
            <div className="pl-8">
              <RadioGroup value={rangeType} onValueChange={setRangeType} className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="all" id="all-pages" />
                  <Label htmlFor="all-pages">Read entire document</Label>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <RadioGroupItem value="custom" id="custom-pages" className="mt-1" />
                    <div className="space-y-2 w-full pr-4">
                      <Label htmlFor="custom-pages" className="leading-5 block">
                        Specific Pages / Slides
                      </Label>
                      {rangeType === "custom" && (
                        <Input
                          autoFocus
                          placeholder="e.g. 1-5, 8, 11-13"
                          value={customRange}
                          onChange={(e) => setCustomRange(e.target.value)}
                          className="h-9"
                        />
                      )}
                      <p className="text-xs text-muted-foreground">
                        Use this to restrict generation to a specific topic or lecture section.
                      </p>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Step 3: Optional Focus Area */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
              Additional Instructions (Optional)
            </h3>
            <div className="pl-8">
              <Textarea
                placeholder="e.g. Focus specifically on the time complexity of the sorting algorithms..."
                className="resize-none h-20"
                value={focusArea}
                onChange={(e) => setFocusArea(e.target.value)}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleGenerate} 
            disabled={!selectedFile || (rangeType === "custom" && !customRange.trim()) || isGenerating}
            className="w-full sm:w-auto"
          >
            {isGenerating ? "Processing Document..." : (
              <>
                Continue <ChevronRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
