"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"

export default function StudentQuizPage() {
  const params = useParams()
  const id = Array.isArray(params.id) ? params.id[0] : params.id

  return (
    <PageShell narrow>
      <PageHeader
        eyebrow="Quiz"
        title="Quiz Details"
        description={`Quiz ID: ${id}`}
      />

      <Card>
        <CardContent className="space-y-4 pt-4 text-sm text-muted-foreground">
          <p>
            There is no quiz-taking API wired yet. When `GET /api/assessments/:id` returns questions, this page will
            render the attempt UI from the server.
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href="/student/quizzes">Back to quizzes</Link>
          </Button>
        </CardContent>
      </Card>
    </PageShell>
  )
}
