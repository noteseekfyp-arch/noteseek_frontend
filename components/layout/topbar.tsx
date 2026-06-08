"use client"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, Search, Sparkles } from "lucide-react"

interface TopbarProps {
  role: "student" | "teacher"
}

export default function Topbar({ role }: TopbarProps) {
  return (
    <header className="h-16 shrink-0 glass-panel border-b border-white/50 px-4 sm:px-6 flex items-center justify-between gap-4 z-10">
      <form
        className="relative flex-1 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault()
          const formData = new FormData(e.currentTarget)
          const query = formData.get("q")
          if (query) {
            window.location.href = `/explore?q=${encodeURIComponent(query.toString())}`
          } else {
            window.location.href = `/explore`
          }
        }}
      >
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          name="q"
          placeholder={
            role === "teacher"
              ? "Search courses, materials…"
              : "Search courses, notes…"
          }
          className="h-11 rounded-full pl-11 pr-4 bg-white/80 border-transparent shadow-inner focus-visible:ring-primary/30"
        />
      </form>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          className="size-10 rounded-full bg-primary/10 hover:bg-primary/15 flex items-center justify-center text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </button>

        <div className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          Ollama local
        </div>

        <div className="flex items-center gap-2 pl-1">
          {role === "student" && (
            <div className="text-right leading-tight hidden lg:block">
              <div className="text-sm font-semibold">Student</div>
              <div className="text-xs text-muted-foreground">NoteSeek</div>
            </div>
          )}
          <Avatar className="size-9 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-semibold">
              {role === "student" ? "ST" : "TC"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
