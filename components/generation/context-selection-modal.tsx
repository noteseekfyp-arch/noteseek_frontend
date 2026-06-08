"use client"

import { useEffect, useState } from "react"
import type { ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, FileText, CheckCircle2, ChevronRight, Wand2, Loader2, Sparkles } from "lucide-react"

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
import { cn } from "@/lib/utils"

export type ContextGeneratePayload = {
  type: string
  selectedFileIds: string[]
  rangeType: string
  customRange: string
  focusArea: string
}

interface ContextSelectionModalProps {
  children?: ReactNode
  defaultType?: "Quiz" | "Assignment" | "Summary" | "Flashcards"
  availableFiles?: { id: string; name: string }[]
  onGenerate?: (payload: ContextGeneratePayload) => Promise<void>
}

const TYPE_COLORS: Record<string, string> = {
  Quiz: "from-violet-500 to-purple-600",
  Assignment: "from-amber-500 to-orange-600",
  Summary: "from-blue-500 to-indigo-600",
  Flashcards: "from-fuchsia-500 to-pink-600",
}

export function ContextSelectionModal({
  children,
  defaultType = "Quiz",
  availableFiles = [],
  onGenerate,
}: ContextSelectionModalProps) {
  const [open, setOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [rangeType, setRangeType] = useState("all")
  const [customRange, setCustomRange] = useState("")
  const [focusArea, setFocusArea] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setLocalError(null)
    const ids = availableFiles.map((f) => f.id)
    setSelectedFiles(ids.length > 0 ? [ids[0]] : [])
  }, [open, availableFiles])

  const handleGenerate = async () => {
    setLocalError(null)
    const payload: ContextGeneratePayload = {
      type: defaultType,
      selectedFileIds: selectedFiles,
      rangeType,
      customRange,
      focusArea,
    }
    if (onGenerate) {
      setIsGenerating(true)
      try {
        await onGenerate(payload)
        setOpen(false)
      } catch (e) {
        setLocalError(e instanceof Error ? e.message : "Generation failed")
      } finally {
        setIsGenerating(false)
      }
    } else {
      setOpen(false)
    }
  }

  const gradient = TYPE_COLORS[defaultType] ?? TYPE_COLORS.Summary

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="secondary" className="rounded-full">
            <Wand2 className="mr-2 size-4" /> Generate {defaultType}
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[560px] max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden border-0 shadow-2xl">
        <div className={cn("px-6 pt-6 pb-4 bg-gradient-to-br text-white", gradient)}>
          <DialogHeader className="text-left space-y-2">
            <DialogTitle className="flex items-center gap-2 text-white text-xl">
              <Sparkles className="size-5" />
              Generate {defaultType}
            </DialogTitle>
            <DialogDescription className="text-white/80">
              Choose sources and focus — Ollama will build this on your laptop.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-6 px-6 py-5 overflow-y-auto flex-1 min-h-0 bg-white">
          {availableFiles.length === 0 && (
            <p className="text-sm text-muted-foreground rounded-xl border bg-muted/30 p-4">
              Upload a PDF first, then return here to generate.
            </p>
          )}

          <section className="space-y-3">
            <StepLabel n={1} title="Source material" />
            <div className="grid gap-2">
              {availableFiles.map((file) => {
                const isSelected = selectedFiles.includes(file.id)
                return (
                  <motion.button
                    key={file.id}
                    type="button"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedFiles((prev) =>
                        prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
                      )
                    }}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl border-2 text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 shadow-sm"
                        : "border-transparent bg-muted/40 hover:bg-muted/60"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className={cn("size-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                      <span className={cn("text-sm truncate", isSelected && "font-medium")}>{file.name}</span>
                    </div>
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 className="size-5 text-primary" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>
          </section>

          <section className="space-y-3">
            <StepLabel n={2} title="Scope" />
            <RadioGroup value={rangeType} onValueChange={setRangeType} className="space-y-3 pl-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all-pages" />
                <Label htmlFor="all-pages">Entire document</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <RadioGroupItem value="custom" id="custom-pages" className="mt-1" />
                  <div className="space-y-2 flex-1">
                    <Label htmlFor="custom-pages">Specific pages</Label>
                    {rangeType === "custom" && (
                      <Input
                        autoFocus
                        placeholder="e.g. 1-5, 8"
                        value={customRange}
                        onChange={(e) => setCustomRange(e.target.value)}
                        className="rounded-lg"
                      />
                    )}
                  </div>
                </div>
              </div>
            </RadioGroup>
          </section>

          <section className="space-y-3">
            <StepLabel n={3} title="Focus (optional)" />
            <Textarea
              placeholder="e.g. Focus on definitions and formulas only…"
              className="resize-none min-h-20 rounded-xl"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
            />
          </section>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row px-6 py-4 border-t bg-muted/20">
          {localError && <p className="text-sm text-destructive w-full">{localError}</p>}
          <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">
            Cancel
          </Button>
          <Button
            onClick={() => void handleGenerate()}
            disabled={
              selectedFiles.length === 0 ||
              (rangeType === "custom" && !customRange.trim()) ||
              isGenerating
            }
            className="rounded-full min-w-[140px]"
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating…
              </>
            ) : (
              <>
                Generate <ChevronRight className="size-4" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function StepLabel({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="text-sm font-semibold flex items-center gap-2">
      <span className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {n}
      </span>
      {title}
    </h3>
  )
}
