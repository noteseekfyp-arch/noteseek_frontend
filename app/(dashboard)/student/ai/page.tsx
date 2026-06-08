"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, ChevronRight, GraduationCap, UploadCloud, BookOpen, ClipboardList, Layers, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"
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
    <div className="space-y-8 max-w-4xl mx-auto pb-8">
      <PageHeader
        eyebrow="AI studio"
        title="AI Generator"
        description="Build notes, quizzes, flashcards, or study guides from your course or personal PDFs."
      />

      {notice && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl p-4" role="status">
          {notice}
        </p>
      )}

      <FadeIn>
      <Card className="border-0 shadow-xl bg-white/90 overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
        <CardHeader className="bg-muted/20 border-b pb-6">
          <CardTitle>Configure Your Generation</CardTitle>
          <CardDescription>Follow the steps below to instruct the AI what to build for you.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-8">
          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                1
              </span>
              What would you like to build?
            </h3>
            <div className="pl-8 grid grid-cols-2 md:grid-cols-4 gap-3">
              {typeOptions.map(({ id, icon: Icon, color }) => (
                <motion.button
                  key={id}
                  type="button"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setGenerationType(id)}
                  className={cn(
                    "rounded-2xl p-4 text-center border-2 transition-all",
                    generationType === id
                      ? "border-primary shadow-lg shadow-primary/15 bg-primary/5"
                      : "border-transparent bg-muted/50 hover:bg-muted"
                  )}
                >
                  <div
                    className={cn(
                      "mx-auto mb-2 flex size-10 items-center justify-center rounded-xl bg-gradient-to-br text-white",
                      color,
                      generationType !== id && "opacity-60 grayscale"
                    )}
                  >
                    <Icon className="size-5" />
                  </div>
                  <span className={cn("font-medium text-sm", generationType === id && "text-primary")}>{id}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                2
              </span>
              Where should the AI pull the information from?
            </h3>
            <div className="pl-8 space-y-6">
              <RadioGroup value={sourceType} onValueChange={setSourceType} className="flex gap-6">
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

              <div className="grid sm:grid-cols-2 gap-4 bg-muted/20 p-4 rounded-xl border">
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

          <div className="space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                3
              </span>
              Additional specific instructions (Optional)
            </h3>
            <div className="pl-8">
              <Textarea
                placeholder="E.g. Make sure the flashcards focus heavily on the mathematical formulas..."
                className="resize-none min-h-24"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-muted/10 border-t p-6 flex justify-end">
          <Button
            className="w-full sm:w-auto min-w-40"
            size="lg"
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
    </div>
  )
}
