"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  BookOpen,
  Lightbulb,
  FileDigit,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ArrowLeft,
  Download,
  Trash2,
  Loader2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { NotesApi } from "@/features/notes/api"
import type { Note } from "@/types/note"
import { cn } from "@/lib/utils"

function renderMarkdownish(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.startsWith("## "))
      return (
        <h2 key={i} className="text-xl font-semibold mt-6 mb-2 text-foreground">
          {line.slice(3)}
        </h2>
      )
    if (line.startsWith("### "))
      return (
        <h3 key={i} className="text-lg font-medium mt-4 mb-2 text-foreground">
          {line.slice(4)}
        </h3>
      )
    if (line.startsWith("- "))
      return (
        <li key={i} className="ml-4 text-muted-foreground list-disc">
          {line.slice(2)}
        </li>
      )
    if (!line.trim()) return <br key={i} />
    return (
      <p key={i} className="text-muted-foreground leading-relaxed mb-2">
        {line}
      </p>
    )
  })
}

function defaultTabForKind(kind?: string | null) {
  if (kind === "flashcards") return "flashcards"
  if (kind === "quiz") return "quiz"
  return "content"
}

export default function AINotesPage() {
  const params = useParams()
  const noteId = useMemo(() => {
    const raw = params.id
    return Array.isArray(raw) ? raw[0] : raw
  }, [params.id])

  const router = useRouter()
  const [note, setNote] = useState<Note | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cardIndex, setCardIndex] = useState(0)
  const [showBack, setShowBack] = useState(false)
  const [activeTab, setActiveTab] = useState("content")
  const [downloading, setDownloading] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleDownloadPdf = async () => {
    if (!note || downloading) return
    setDownloading(true)
    try {
      await NotesApi.downloadPdf(note.id, note.title)
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Download failed")
    } finally {
      setDownloading(false)
    }
  }

  const handleDelete = async () => {
    if (!note || deleting) return
    if (!window.confirm(`Delete "${note.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await NotesApi.delete(note.id)
      router.back()
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "Delete failed")
      setDeleting(false)
    }
  }

  useEffect(() => {
    if (!noteId) return
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await NotesApi.get(noteId)
        if (!cancelled) {
          setNote(data)
          setActiveTab(defaultTabForKind(data.kind))
        }
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load note")
          setNote(null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [noteId])

  const flashcards = note?.metadata?.flashcards ?? []
  const quizQuestions = note?.metadata?.quiz_questions ?? []
  const currentCard = flashcards[cardIndex]

  if (loading) {
    return (
      <div className="space-y-4 max-w-3xl">
        <div className="h-10 w-48 rounded-lg shimmer" />
        <div className="h-64 rounded-2xl shimmer" />
      </div>
    )
  }

  if (error || !note) {
    return (
      <div className="space-y-4 max-w-xl">
        <p className="text-destructive text-sm">{error ?? "Note not found."}</p>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/student/notes">
            <ArrowLeft className="size-4 mr-2" /> Back to vault
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <PageShell narrow>
      <Button asChild variant="ghost" size="sm" className="-ml-2 text-muted-foreground rounded-full w-fit">
        <Link href="/student/notes">
          <ArrowLeft className="size-4 mr-1" /> Vault
        </Link>
      </Button>

      <PageHeader
        title={note.title}
        description={
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5" />
            <span className="capitalize">{note.kind?.replace("_", " ") ?? "Note"}</span>
          </span>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            {note.is_generated && (
              <Badge className="bg-primary/10 text-primary border-0">AI generated</Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full"
              onClick={() => void handleDownloadPdf()}
              disabled={downloading}
            >
              {downloading ? (
                <Loader2 className="size-4 mr-1.5 animate-spin" />
              ) : (
                <Download className="size-4 mr-1.5" />
              )}
              Download PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/30"
              onClick={() => void handleDelete()}
              disabled={deleting}
            >
              {deleting ? (
                <Loader2 className="size-4 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="size-4 mr-1.5" />
              )}
              Delete
            </Button>
          </div>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto flex-wrap gap-1 bg-white/80 shadow-sm border p-1.5 rounded-xl">
          <TabsTrigger value="content" className="rounded-lg data-[state=active]:shadow-sm">
            {note.kind === "quiz" ? "Overview" : "Notes"}
          </TabsTrigger>
          {note.kind !== "flashcards" && note.kind !== "quiz" && (
            <>
              <TabsTrigger value="summary" className="rounded-lg">Summary</TabsTrigger>
              <TabsTrigger value="keypoints" className="rounded-lg">Key points</TabsTrigger>
            </>
          )}
          {(flashcards.length > 0 || note.kind === "flashcards") && (
            <TabsTrigger value="flashcards" className="rounded-lg gap-1">
              <FileDigit className="size-3.5" /> {flashcards.length}
            </TabsTrigger>
          )}
          {(quizQuestions.length > 0 || note.kind === "quiz") && (
            <TabsTrigger value="quiz" className="rounded-lg gap-1">
              <ClipboardList className="size-3.5" /> {quizQuestions.length}
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="content" className="mt-5">
          <Card className="border-0 shadow-lg bg-white/90 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500" />
            <CardHeader>
              <CardTitle>Study content</CardTitle>
              <CardDescription>Generated from your PDF via local Ollama.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-slate max-w-none rounded-xl bg-muted/30 p-6 sm:p-8">
                {renderMarkdownish(note.content)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="mt-5">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="size-5 text-primary" /> Brief summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {note.metadata.brief_summary || "No summary stored."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keypoints" className="mt-5">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="size-5 text-amber-500" /> Key takeaways
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(note.metadata.key_points ?? []).map((point, i) => (
                <div
                  key={i}
                  className="flex gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/10"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-amber-500/15 text-amber-700 text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground pt-0.5">{point}</span>
                </div>
              ))}
              {(note.metadata.key_points ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground">No key points stored.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flashcards" className="mt-5">
          <Card className="max-w-md mx-auto border-0 shadow-xl bg-gradient-to-b from-violet-500/5 to-fuchsia-500/5">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <FileDigit className="size-5 text-violet-600" /> Flashcards
              </CardTitle>
              <CardDescription>{flashcards.length} cards · click to flip</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[200px] flex items-center justify-center perspective-[1000px]">
              {currentCard ? (
                <motion.button
                  type="button"
                  onClick={() => setShowBack((b) => !b)}
                  className="w-full min-h-48 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={showBack ? "back" : "front"}
                      initial={{ rotateY: 90, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      exit={{ rotateY: -90, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="w-full min-h-48 rounded-2xl bg-white border-2 border-violet-200 shadow-lg p-8 flex flex-col items-center justify-center text-center"
                    >
                      <p className="text-xs font-bold uppercase tracking-widest text-violet-500 mb-4">
                        {showBack ? "Answer" : "Question"}
                      </p>
                      <p className="font-medium text-lg text-foreground">
                        {showBack ? currentCard.back : currentCard.front}
                      </p>
                    </motion.div>
                  </AnimatePresence>
                </motion.button>
              ) : (
                <p className="text-sm text-muted-foreground">No flashcards in this artifact.</p>
              )}
            </CardContent>
            {flashcards.length > 0 && (
              <CardFooter className="flex justify-between border-t bg-white/50">
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  disabled={cardIndex === 0}
                  onClick={() => {
                    setCardIndex((i) => i - 1)
                    setShowBack(false)
                  }}
                >
                  <ChevronLeft className="size-4" /> Prev
                </Button>
                <span className="text-sm font-medium tabular-nums">
                  {cardIndex + 1} / {flashcards.length}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full"
                  disabled={cardIndex >= flashcards.length - 1}
                  onClick={() => {
                    setCardIndex((i) => i + 1)
                    setShowBack(false)
                  }}
                >
                  Next <ChevronRight className="size-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="quiz" className="mt-5">
          <div className="space-y-4">
            {quizQuestions.map((q, i) => (
              <Card key={i} className="border-0 shadow-md overflow-hidden card-interactive">
                <div className="h-0.5 bg-gradient-to-r from-violet-500 to-purple-500" />
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium leading-snug">
                    <span className="text-primary mr-2">Q{i + 1}.</span>
                    {q.question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(q.options ?? []).map((opt, j) => (
                    <div
                      key={j}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm border",
                        j === q.correct_index
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 font-medium"
                          : "bg-muted/30 border-transparent text-muted-foreground"
                      )}
                    >
                      <span className="font-mono text-xs mr-2 opacity-60">{String.fromCharCode(65 + j)}</span>
                      {opt}
                    </div>
                  ))}
                  {q.explanation && (
                    <p className="text-xs text-muted-foreground pt-2 border-t mt-2">{q.explanation}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {quizQuestions.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No quiz questions stored.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
