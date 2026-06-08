"use client"

import { useCallback, useRef, useState } from "react"
import { UploadCloud, FileText, Loader2 } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface UploadZoneProps {
  accept?: string
  uploading?: boolean
  onFile: (file: File) => void | Promise<void>
  className?: string
}

export function UploadZone({
  accept = "application/pdf,.pdf",
  uploading = false,
  onFile,
  className,
}: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const f = files?.[0]
      if (f) void onFile(f)
    },
    [onFile]
  )

  return (
    <motion.div
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
      animate={{ scale: dragOver ? 1.01 : 1 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors duration-300",
        dragOver ? "border-primary bg-primary/5" : "border-primary/20 bg-white/60",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/10 pointer-events-none" />
      <div className="relative flex flex-col items-center justify-center p-10 sm:p-14 text-center">
        <motion.div
          animate={{ y: dragOver ? -4 : 0 }}
          className={cn(
            "mb-5 flex size-20 items-center justify-center rounded-2xl shadow-lg",
            dragOver ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          )}
        >
          {uploading ? <Loader2 className="size-9 animate-spin" /> : <UploadCloud className="size-9" />}
        </motion.div>
        <h3 className="text-xl font-semibold mb-2">
          {dragOver ? "Drop your PDF here" : "Upload lecture PDFs"}
        </h3>
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          Drag and drop or browse. Then generate notes, quizzes, and flashcards with your local AI.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          disabled={uploading}
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
        <Button
          type="button"
          size="lg"
          className="rounded-full px-8 shadow-md shadow-primary/20"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Choose PDF"}
        </Button>
        <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <FileText className="size-3.5" /> PDF only · processed on your machine
        </p>
      </div>
    </motion.div>
  )
}
