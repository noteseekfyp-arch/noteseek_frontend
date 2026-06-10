"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  FileText,
  Download,
  Bot,
  Sparkles,
  BookOpen,
  ClipboardList,
  Layers,
  ArrowRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ContextSelectionModal } from "@/components/generation/context-selection-modal"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { EmptyState } from "@/components/ui/empty-state"
import { UploadZone } from "@/components/ui/upload-zone"
import { generateAndOpenNote } from "@/features/ai/generation-handlers"
import { MaterialApi } from "@/features/materials/api"
import { NotesApi } from "@/features/notes/api"
import type { Material } from "@/types/material"
import type { Note } from "@/types/note"
import { cn } from "@/lib/utils"

function fmtDate(iso: string) {
  try {
    return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
  } catch {
    return "—"
  }
}

const KIND_STYLES: Record<string, { icon: typeof BookOpen; color: string }> = {
  summary: { icon: BookOpen, color: "from-blue-500 to-indigo-600" },
  quiz: { icon: ClipboardList, color: "from-violet-500 to-purple-600" },
  flashcards: { icon: Layers, color: "from-fuchsia-500 to-pink-600" },
  study_guide: { icon: Sparkles, color: "from-emerald-500 to-teal-600" },
}

function GenButton({
  type,
  files,
  onGenerate,
  variant = "outline",
}: {
  type: "Summary" | "Quiz" | "Flashcards"
  files: { id: string; name: string }[]
  onGenerate: (p: Parameters<typeof generateAndOpenNote>[1]) => Promise<void>
  variant?: "default" | "outline" | "secondary"
}) {
  const icons = { Summary: BookOpen, Quiz: ClipboardList, Flashcards: Layers }
  const Icon = icons[type]
  return (
    <ContextSelectionModal defaultType={type} availableFiles={files} onGenerate={onGenerate}>
      <Button variant={variant} size="sm" className="gap-1.5 rounded-full" disabled={files.length === 0}>
        <Icon className="size-3.5" />
        {type === "Summary" ? "Notes" : type}
      </Button>
    </ContextSelectionModal>
  )
}

export default function StudentNotesPage() {
  const [materials, setMaterials] = useState<Material[]>([])
  const [generated, setGenerated] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [generatedLoading, setGeneratedLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [loadError, setLoadError] = useState<string | null>(null)
  const router = useRouter()

  const refresh = useCallback(async () => {
    setLoading(true)
    setLoadError(null)
    try {
      setMaterials(await MaterialApi.list(null))
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Failed to load files")
      setMaterials([])
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshGenerated = useCallback(async () => {
    setGeneratedLoading(true)
    try {
      setGenerated(await NotesApi.list(true))
    } catch {
      setGenerated([])
    } finally {
      setGeneratedLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
    void refreshGenerated()
  }, [refresh, refreshGenerated])

  const modalFiles = materials.map((m) => ({ id: m.id, name: m.filename }))

  const handleGenerate = async (payload: Parameters<typeof generateAndOpenNote>[1]) => {
    await generateAndOpenNote(router, payload, {
      onAfterNavigate: refreshGenerated,
    })
  }

  const onUpload = async (file: File) => {
    setUploading(true)
    try {
      await MaterialApi.upload(file, null)
      await refresh()
    } catch (err) {
      window.alert(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <PageShell>
      <PageHeader
        eyebrow="Study vault"
        title="My Study Vault"
        description="Upload PDFs, then generate notes, quizzes, and flashcards powered by your local Ollama model."
      />

      {loadError && (
        <p className="text-sm text-destructive rounded-lg border border-destructive/20 bg-destructive/5 p-3" role="alert">
          {loadError}
        </p>
      )}

      <FadeIn delay={0.05}>
        <UploadZone uploading={uploading} onFile={onUpload} />
      </FadeIn>

      <FadeIn delay={0.1}>
        <Tabs
          defaultValue="files"
          className="w-full"
          onValueChange={(tab) => {
            if (tab === "generated") void refreshGenerated()
          }}
        >
          <TabsList className="h-8 p-0.5 bg-white/80 shadow-sm border w-full sm:w-auto grid grid-cols-2 sm:inline-flex text-xs">
            <TabsTrigger value="files" className="rounded-md px-4 py-1">
              Uploaded files
              {materials.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {materials.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="generated" className="rounded-md px-4 py-1">
              AI library
              {generated.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {generated.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-4">
            <Card className="border-0 shadow-md shadow-indigo-500/5 bg-white/80 backdrop-blur-sm overflow-hidden gap-0 py-0">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-500/5 to-violet-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
                <div>
                  <CardTitle className="text-sm">Your PDFs</CardTitle>
                  <CardDescription className="text-xs">Pick a file and choose what to generate.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <GenButton type="Summary" files={modalFiles} onGenerate={handleGenerate} variant="default" />
                  <GenButton type="Quiz" files={modalFiles} onGenerate={handleGenerate} />
                  <GenButton type="Flashcards" files={modalFiles} onGenerate={handleGenerate} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-4 space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-10 rounded-lg shimmer" />
                    ))}
                  </div>
                ) : materials.length === 0 ? (
                  <EmptyState
                    icon={FileText}
                    title="No PDFs yet"
                    description="Upload your first lecture PDF above to start generating."
                  />
                ) : (
                  <Stagger className="divide-y">
                    {materials.map((file) => (
                      <StaggerItem key={file.id}>
                        <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-3 py-2 hover:bg-primary/[0.03] transition-colors">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-primary">
                              <FileText className="size-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate leading-tight">{file.filename}</p>
                              <p className="text-[11px] text-muted-foreground">{fmtDate(file.uploaded_at)}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-1 sm:justify-end pl-10 sm:pl-0">
                            <GenButton
                              type="Summary"
                              files={[{ id: file.id, name: file.filename }]}
                              onGenerate={handleGenerate}
                            />
                            <GenButton
                              type="Quiz"
                              files={[{ id: file.id, name: file.filename }]}
                              onGenerate={handleGenerate}
                            />
                            <GenButton
                              type="Flashcards"
                              files={[{ id: file.id, name: file.filename }]}
                              onGenerate={handleGenerate}
                            />
                            <Button variant="ghost" size="icon" className="size-7 rounded-full" asChild>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Download className="size-3.5" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generated" className="mt-4">
            {generatedLoading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-24 rounded-xl shimmer" />
                ))}
              </div>
            ) : generated.length === 0 ? (
              <EmptyState
                icon={Bot}
                title="No AI content yet"
                description="Generate notes, a quiz, or flashcards from any uploaded PDF."
              />
            ) : (
              <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {generated.map((item) => {
                  const kind = item.kind ?? "summary"
                  const style = KIND_STYLES[kind] ?? KIND_STYLES.summary
                  const Icon = style.icon
                  return (
                    <StaggerItem key={item.id}>
                      <Link href={`/notes/${item.id}`} className="block h-full">
                        <Card className="h-full card-interactive border-0 shadow-sm bg-white/90 overflow-hidden group gap-2 py-3">
                          <div className={cn("h-1 bg-gradient-to-r", style.color)} />
                          <CardHeader className="pb-0 pt-3">
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className={cn(
                                  "flex size-7 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-sm",
                                  style.color
                                )}
                              >
                                <Icon className="size-3.5" />
                              </div>
                              <ArrowRight className="size-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <CardTitle className="text-sm line-clamp-2 mt-2">{item.title}</CardTitle>
                            <CardDescription className="capitalize text-xs">{kind.replace("_", " ")}</CardDescription>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-[11px] text-muted-foreground">{fmtDate(item.created_at)}</p>
                          </CardContent>
                        </Card>
                      </Link>
                    </StaggerItem>
                  )
                })}
              </Stagger>
            )}
          </TabsContent>
        </Tabs>
      </FadeIn>
    </PageShell>
  )
}
