import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageShellProps {
  children: ReactNode
  className?: string
  /** Narrow max-width for form-style pages (max-w-4xl). Default is max-w-6xl. */
  narrow?: boolean
}

export function PageShell({ children, className, narrow }: PageShellProps) {
  return (
    <div
      className={cn(
        "space-y-5 pb-6 mx-auto w-full",
        narrow ? "max-w-4xl" : "max-w-6xl",
        className
      )}
    >
      {children}
    </div>
  )
}
