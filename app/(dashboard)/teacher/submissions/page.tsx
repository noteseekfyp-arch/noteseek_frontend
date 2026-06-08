"use client"

import { useState } from "react"
import { Search, ClipboardList } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"

export default function TeacherSubmissionsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const submissions: never[] = []

  return (
    <PageShell>
      <PageHeader
        eyebrow="Grading"
        title="Student Submissions"
        description="Grade assignments and quizzes. Data will load from `GET /api/submissions` (or equivalent) when implemented."
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search by student name…"
          className="pl-9 h-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="pending">Needs grading (0)</TabsTrigger>
          <TabsTrigger value="graded">Graded (0)</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pending submissions</CardTitle>
              <CardDescription>Submissions awaiting your review will appear here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                <ClipboardList className="size-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No submissions to grade yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="graded" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Graded submissions</CardTitle>
              <CardDescription>Previously graded work will be listed here.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="py-8 text-center text-muted-foreground">
                <ClipboardList className="size-10 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No graded submissions yet.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </PageShell>
  )
}
