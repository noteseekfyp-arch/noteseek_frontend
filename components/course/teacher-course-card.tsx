"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Clock, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeacherCourseCardProps {
  title: string
  students: number
  updated: string
  category: string
  href: string
}

const GRADIENTS = [
  "from-indigo-500/80 to-violet-600/80",
  "from-blue-500/80 to-cyan-600/80",
  "from-violet-500/80 to-fuchsia-600/80",
  "from-emerald-500/80 to-teal-600/80",
]

export function TeacherCourseCard({
  title,
  students,
  updated,
  category,
  href,
}: TeacherCourseCardProps) {
  const grad = GRADIENTS[title.length % GRADIENTS.length]

  return (
    <Link href={href} className="block transition-transform hover:-translate-y-1">
      <Card className="overflow-hidden hover:shadow-lg transition bg-white h-full group">
        <div className={cn("relative h-40 bg-gradient-to-br flex items-center justify-center", grad)}>
        <GraduationCap className="size-16 text-white/30 group-hover:scale-110 transition-transform duration-500" />
        {category && (
          <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wide bg-white/95 text-foreground px-2.5 py-1 rounded-full shadow-sm">
            {category.toUpperCase()}
          </span>
        )}
      </div>

      <CardContent className="p-5 space-y-3">
        <h3 className="text-base font-semibold leading-snug">{title}</h3>

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Users className="size-4" />
            <span>{students} Students</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" />
            <span>Updated {updated}</span>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}
