import { cn } from "@/lib/utils"

/** Grid of shimmer placeholder cards — for course/content lists. */
export function CardGridSkeleton({
  count = 6,
  className,
  cardClassName,
}: {
  count?: number
  className?: string
  cardClassName?: string
}) {
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={cn("rounded-xl shimmer h-44", cardClassName)} />
      ))}
    </div>
  )
}

/** Header + content block shimmer — for detail pages (course, note). */
export function DetailSkeleton() {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="h-4 w-24 rounded-md shimmer" />
        <div className="h-9 w-72 max-w-full rounded-lg shimmer" />
        <div className="h-4 w-96 max-w-full rounded-md shimmer" />
      </div>
      <div className="h-9 w-80 max-w-full rounded-lg shimmer" />
      <div className="h-72 rounded-2xl shimmer" />
    </div>
  )
}
