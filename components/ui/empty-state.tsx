import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  className?: string
  children?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, className, children }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center rounded-xl border-2 border-dashed border-primary/15 bg-gradient-to-b from-primary/5 to-transparent p-8",
        className
      )}
    >
      <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shadow-inner">
        <Icon className="size-5" />
      </div>
      <p className="font-semibold text-sm text-foreground">{title}</p>
      {description && <p className="mt-2 text-sm text-muted-foreground max-w-sm">{description}</p>}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
