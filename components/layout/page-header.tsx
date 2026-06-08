"use client"

import type { ReactNode } from "react"
import { FadeIn } from "@/components/motion/fade-in"
import { cn } from "@/lib/utils"

interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  actions?: ReactNode
  className?: string
}

export function PageHeader({ title, description, eyebrow, actions, className }: PageHeaderProps) {
  return (
    <FadeIn className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-widest text-primary/80">{eyebrow}</p>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight gradient-text">{title}</h1>
        {description && <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2 shrink-0">{actions}</div>}
    </FadeIn>
  )
}
