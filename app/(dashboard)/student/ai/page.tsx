"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, ChevronRight, GraduationCap, UploadCloud, BookOpen, ClipboardList, Layers, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { FadeIn } from "@/components/motion/fade-in"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CourseApi } from "@/features/courses/api"
import { MaterialApi } from "@/features/materials/api"
import { AiApi, mapUiGenerationType } from "@/features/ai/api"
import type { Course } from "@/types/course"
import type { Material } from "@/types/material"

export default function StudentAIGeneratorPage() {
  const [generationType, setGenerationType] = useState("Flashcards")
  const [sourceType, setSourceType] = useState("course")
  const [selectedCourse, setSelectedCourse] = useState("")
  const [selectedMaterial, setSelectedMaterial] = useState("")
  const [prompt, setPrompt] = useState("")
  const [notice, setNotice] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()

  const [courses, setCourses] = useState<Course[]>([])
  const [courseMaterials, setCourseMaterials] = useState<Material[]>([])
  const [personalMaterials, setPersonalMaterials] = useState<Material[]>([])

  const loadCourses = useCallback(async () => {
    try {
      setCourses(await CourseApi.getCourses())
    } catch {
      setCourses([])
    }
  }, [])

  const loadPersonal = useCallback(async () => {
    try {
      setPersonalMaterials(await MaterialApi.list(null))
    } catch {
      setPersonalMaterials([])
    }
  }, [])

  useEffect(() => {
    void loadCourses()
    void loadPersonal()
  }, [loadCourses, loadPersonal])

  useEffect(() => {
    if (sourceType !== "course" || !selectedCourse) {
      setCourseMaterials([])
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const m = await MaterialApi.list(selectedCourse)
        if (!cancelled) setCourseMaterials(m)
      } catch {
        if (!cancelled) setCourseMaterials([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sourceType, selectedCourse])

  const handleGenerate = async () => {
    setNotice(null)
    setIsGenerating(true)
    try {
      let sourceIds: string[] = []
      if (sourceType === "personal") {
        sourceIds = [selectedMaterial]
      } else if (selectedMaterial) {
        sourceIds = [selectedMaterial]
      } else {
        sourceIds = courseMaterials.map((m) => m.id)
      }
      if (sourceIds.length === 0) {
        throw new Error("Select at least one material or upload course files first.")
      }
      const result = await AiApi.generate({
        type: mapUiGenerationType(generationType),
        sourceMaterialIds: sourceIds,
        prompt: prompt.trim() || undefined,
        targetCourseId: sourceType === "course" ? selectedCourse : undefined,
      })
      router.push(`/notes/${result.id}`)
    } catch (e) {
      setNotice(e instanceof Error ? e.message : "Generation failed")
    } finally {
      setIsGenerating(false)
    }
  }

  const materialOptions = sourceType === "course" ? courseMaterials : personalMaterials

  const typeOptions = [
    { id: "Flashcards", icon: Layers, color: "from-fuchsia-500 to-pink-500" },
    { id: "Summary", icon: BookOpen, color: "from-blue-500 to-indigo-500" },
    { id: "Practice Quiz", icon: ClipboardList, color: "from-violet-500 to-purple-500" },
    { id: "Study Guide", icon: Sparkles, color: "from-emerald-500 to-teal-500" },
  ] as const

  return (
    <PageShell narrow>
      <PageHeader
        eyebrow="AI studio"
        title="AI Generator"
        description="Build notes, quizzes, flashcards, or study guides from your course or personal PDFs."
      />

      {notice && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5" role="status">
          {notice}
        </p>
      )}

      <FadeIn>
      <Card className="border-0 shadow-lg bg-white/90 overflow-hidden gap-3">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
        <CardHeader className="bg-muted/20 border-b py-3">
          <CardTitle className="text-base">Configure Your Generation</CardTitle>
          <CardDescription className="text-xs">Follow the steps below to instruct the AI what to build for you.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 pt-5">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                1
              </span>
              What would you like to build?
            </h3>
            <div className="pl-7 grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {typeOptions.map(({ id, icon: Icon, color }) => (
                <motion.button
                  key={id}
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setGenerationType(id)}
                  className={cn(
                    "rounded-xl p-3 text-center border-2 transition-all",
                    generationType === id
                      ? "border-primary shadow-md shadow-primary/15 bg-primary/5"
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto mb-1.5 flex size-9 items-center justify-center rounded-lg bg-gradient-to-br text-white",
                      color,
                      generationType !== id && "opacity-60 grayscale"
                    )}
                  >
                    <Icon className="size-4" />
                  </div>
                  <span className={cn("font-medium text-xs", generationType === id && "text-primary")}>{id}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                2
              </span>
              Where should the AI pull the information from?
            </h3>
            <div className="pl-7 space-y-4">
              <RadioGroup value={sourceType} onValueChange={setSourceType} className="flex gap-5">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="course" id="source-course" />
                  <Label htmlFor="source-course" className="flex items-center gap-2 cursor-pointer">
                    <GraduationCap className="size-4" /> Enrolled Courses
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal" id="source-personal" />
                  <Label htmlFor="source-personal" className="flex items-center gap-2 cursor-pointer">
                    <UploadCloud className="size-4" /> Personal Uploads
                  </Label>
                </div>
              </RadioGroup>

              <div className="grid sm:grid-cols-2 gap-3 bg-muted/20 p-3 rounded-lg border">
                {sourceType === "course" ? (
                  <>
                    <div className="space-y-2">
                      <Label>Select Course</Label>
                      <Select value={selectedCourse} onValueChange={(v) => { setSelectedCourse(v); setSelectedMaterial("") }}>
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder="Choose a course..." />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {courses.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Select Material (Optional)</Label>
                      <Select value={selectedMaterial} onValueChange={setSelectedMaterial} disabled={!selectedCourse}>
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            placeholder={selectedCourse ? "Select a file…" : "Select course first"}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-background">
                          {materialOptions.map((m) => (
                            <SelectItem key={m.id} value={m.id}>
                              {m.filename}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2 col-span-2">
                    <Label>Select Personal File</Label>
                    <Select value={selectedMaterial} onValueChange={setSelectedMaterial}>
                      <SelectTrigger className="bg-background w-full sm:w-1/2">
                        <SelectValue placeholder="Choose from your vault…" />
                      </SelectTrigger>
                      <SelectContent className="bg-background">
                        {personalMaterials.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.filename}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px]">
                3
              </span>
              Additional specific instructions (Optional)
            </h3>
            <div className="pl-7">
              <Textarea
                placeholder="E.g. Make sure the flashcards focus heavily on the mathematical formulas..."
                className="resize-none min-h-[72px] text-sm"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/10 border-t px-4 py-3 flex justify-end">
          <Button
            className="w-full sm:w-auto min-w-36"
            size="default"
            onClick={() => void handleGenerate()}
            disabled={
              isGenerating ||
              (sourceType === "course" && !selectedCourse) ||
              (sourceType === "personal" && !selectedMaterial)
            }
          >
            {isGenerating ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating with Ollama…
              </>
            ) : (
              <>
                Generate {generationType} <ChevronRight className="ml-2 size-4" />
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      </FadeIn>
    </PageShell>
  )
}
