"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bell, LogOut, Search, Sparkles } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface TopbarProps {
  role: "student" | "teacher"
}

export default function Topbar({ role }: TopbarProps) {
  const router = useRouter()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    router.push("/login")
  }

  return (
    <header className="h-14 shrink-0 glass-panel border-b border-white/50 px-4 sm:px-5 flex items-center justify-between gap-3 z-10">
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
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          name="q"
          placeholder={
            role === "teacher"
              ? "Search courses, materials…"
              : "Search courses, notes…"
          }
          className="h-9 text-sm rounded-full pl-10 pr-3 glass-input border-transparent shadow-inner focus-visible:ring-primary/30"
        />
      </form>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="size-9 rounded-full bg-primary/10 hover:bg-primary/15 flex items-center justify-center text-primary transition-colors"
          aria-label="Notifications"
        >
          <Bell className="size-4" />
        </button>

        <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-violet-500/10 px-3 py-1.5 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          Ollama local
        </div>

        <div className="flex items-center gap-2 pl-0.5">
          {role === "student" && (
            <div className="text-right leading-tight hidden lg:block">
              <div className="text-sm font-semibold">Student</div>
              <div className="text-xs text-muted-foreground">NoteSeek</div>
            </div>
          )}
          <Avatar className="size-8 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xs font-semibold">
              {role === "student" ? "ST" : "TC"}
            </AvatarFallback>
          </Avatar>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="h-9 px-2.5 text-muted-foreground hover:text-destructive"
            aria-label="Log out"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline text-sm ml-1.5">Log out</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
