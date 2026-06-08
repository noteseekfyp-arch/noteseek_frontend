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
import { FadeIn, Stagger, StaggerItem } from "@/components/motion/fade-in"
import { EmptyState } from "@/components/ui/empty-state"
import { UploadZone } from "@/components/ui/upload-zone"
import { contextPayloadToGenerate } from "@/features/ai/generation-handlers"
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
  onGenerate: (p: Parameters<typeof contextPayloadToGenerate>[0]) => Promise<void>
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

  const handleGenerate = async (payload: Parameters<typeof contextPayloadToGenerate>[0]) => {
    const result = await contextPayloadToGenerate(payload)
    await refreshGenerated()
    router.push(`/notes/${result.id}`)
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
    <div className="space-y-8 pb-8">
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
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="h-11 p-1 bg-white/80 shadow-sm border w-full sm:w-auto grid grid-cols-2 sm:inline-flex">
            <TabsTrigger value="files" className="rounded-lg px-6">
              Uploaded files
              {materials.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {materials.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="generated" className="rounded-lg px-6">
              AI library
              {generated.length > 0 && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-[10px]">
                  {generated.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="mt-6">
            <Card className="border-0 shadow-lg shadow-indigo-500/5 bg-white/80 backdrop-blur-sm overflow-hidden">
              <CardHeader className="border-b bg-gradient-to-r from-indigo-500/5 to-violet-500/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle>Your PDFs</CardTitle>
                  <CardDescription>Pick a file and choose what to generate.</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <GenButton type="Summary" files={modalFiles} onGenerate={handleGenerate} variant="default" />
                  <GenButton type="Quiz" files={modalFiles} onGenerate={handleGenerate} />
                  <GenButton type="Flashcards" files={modalFiles} onGenerate={handleGenerate} />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {loading ? (
                  <div className="p-8 space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 rounded-xl shimmer" />
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
                        <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 hover:bg-primary/[0.03] transition-colors">
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/15 text-primary group-hover:scale-105 transition-transform">
                              <FileText className="size-6" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate">{file.filename}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{fmtDate(file.uploaded_at)}</p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
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
                            <Button variant="ghost" size="icon" className="rounded-full" asChild>
                              <a href={file.url} target="_blank" rel="noopener noreferrer">
                                <Download className="size-4" />
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

          <TabsContent value="generated" className="mt-6">
            {generatedLoading ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {[1, 2].map((i) => (
                  <div key={i} className="h-36 rounded-2xl shimmer" />
                ))}
              </div>
            ) : generated.length === 0 ? (
              <EmptyState
                icon={Bot}
                title="No AI content yet"
                description="Generate notes, a quiz, or flashcards from any uploaded PDF."
              />
            ) : (
              <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {generated.map((item) => {
                  const kind = item.kind ?? "summary"
                  const style = KIND_STYLES[kind] ?? KIND_STYLES.summary
                  const Icon = style.icon
                  return (
                    <StaggerItem key={item.id}>
                      <Link href={`/notes/${item.id}`} className="block h-full">
                        <Card className="h-full card-interactive border-0 shadow-md bg-white/90 overflow-hidden group">
                          <div className={cn("h-1.5 bg-gradient-to-r", style.color)} />
                          <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                              <div
                                className={cn(
                                  "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm",
                                  style.color
                                )}
                              >
                                <Icon className="size-5" />
                              </div>
                              <ArrowRight className="size-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                            </div>
                            <CardTitle className="text-base line-clamp-2 mt-3">{item.title}</CardTitle>
                            <CardDescription className="capitalize">{kind.replace("_", " ")}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-muted-foreground">{fmtDate(item.created_at)}</p>
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
    </div>
  )
}
