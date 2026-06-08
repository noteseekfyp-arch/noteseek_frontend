"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Building2, CalendarDays, GraduationCap } from "lucide-react"
import { cn } from "@/lib/utils"

interface CourseCardProps {
  title: string
  teacher: string
  university: string
  semester: string
  tag?: string
  variant?: "recommended" | "trending"
  href?: string
}

const GRADIENTS = [
  "from-indigo-500/80 to-violet-600/80",
  "from-blue-500/80 to-cyan-600/80",
  "from-violet-500/80 to-fuchsia-600/80",
  "from-emerald-500/80 to-teal-600/80",
]

export default function CourseCard({
  title,
  teacher,
  university,
  semester,
  tag,
  variant = "recommended",
  href,
}: CourseCardProps) {
  const grad = GRADIENTS[title.length % GRADIENTS.length]

  const content = (
    <Card className="overflow-hidden h-full border-0 shadow-md card-interactive bg-white/90 group">
      <div className={cn("relative h-40 bg-gradient-to-br flex items-center justify-center", grad)}>
        <GraduationCap className="size-16 text-white/30 group-hover:scale-110 transition-transform duration-500" />
        {tag && (
          <span className="absolute top-3 right-3 text-[10px] font-bold tracking-wide bg-white/95 text-foreground px-2.5 py-1 rounded-full shadow-sm">
            {tag.toUpperCase()}
          </span>
        )}
        {variant === "trending" && (
          <motion.div
            whileHover={{ scale: 1.1 }}
            role="button"
            aria-label="Add course"
            className="absolute bottom-3 right-3 size-10 rounded-full bg-white shadow-lg flex items-center justify-center text-primary"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <Plus className="size-5" />
          </motion.div>
        )}
      </div>

      <CardContent className="p-5">
        <div className="space-y-1">
          <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-sm text-muted-foreground">{teacher}</p>
        </div>

        <div className="my-4 h-px bg-border/60" />

        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Building2 className="size-4 shrink-0 text-primary/60" />
            <span className="truncate">{university}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-4 shrink-0 text-primary/60" />
            <span>{semester}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href) {
    return (
      <Link href={href} className="block w-full h-full">
        {content}
      </Link>
    )
  }

  return content
}
