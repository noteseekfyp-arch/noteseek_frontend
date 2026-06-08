"use client"

import { useCallback, useRef, useState } from "react"
import { UploadCloud, Loader2 } from "lucide-react"
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
      animate={{ scale: dragOver ? 1.005 : 1 }}
      className={cn(
        "relative overflow-hidden rounded-xl border-2 border-dashed transition-colors duration-300",
        dragOver ? "border-primary bg-primary/5" : "border-primary/20 bg-white/60",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-violet-500/10 pointer-events-none" />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 sm:px-5">
        <motion.div
          animate={{ y: dragOver ? -2 : 0 }}
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg shadow-sm",
            dragOver ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
          )}
        >
          {uploading ? <Loader2 className="size-5 animate-spin" /> : <UploadCloud className="size-5" />}
        </motion.div>
        <div className="flex-1 min-w-0 text-left">
          <h3 className="text-sm font-semibold">
            {dragOver ? "Drop your PDF here" : "Upload lecture PDFs"}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Drag & drop or browse · PDF only · processed locally
          </p>
        </div>
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
          size="sm"
          className="rounded-full shrink-0 shadow-sm"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Choose PDF"}
        </Button>
      </div>
    </motion.div>
  )
}
