"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  BookOpen,
  LayoutDashboard,
  NotebookPen,
  Sparkles,
  GraduationCap,
  ClipboardList,
  Upload,
  FilePlus2,
  ClipboardCheck,
  User2,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"

interface SidebarProps {
  role: "student" | "teacher"
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  function handleLogout() {
    logout()
    router.push("/login")
  }

  const studentNav = [
    { href: "/student", label: "Dashboard", icon: LayoutDashboard },
    { href: "/student/courses", label: "My Courses", icon: GraduationCap },
    { href: "/student/notes", label: "Study Vault", icon: NotebookPen },
    { href: "/student/ai", label: "AI Generator", icon: Sparkles },
    { href: "/student/assignments", label: "Assignments", icon: ClipboardList },
    { href: "/student/quizzes", label: "Quizzes", icon: ClipboardCheck },
  ] as const

  const teacherNav = [
    { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
    { href: "/teacher/courses", label: "My Courses", icon: GraduationCap },
    { href: "/teacher/materials", label: "Upload Material", icon: Upload },
    { href: "/teacher/assignments", label: "Create Assignment", icon: FilePlus2 },
    { href: "/teacher/quizzes", label: "Create Quiz", icon: ClipboardCheck },
    { href: "/teacher/submissions", label: "Submissions", icon: ClipboardList },
  ] as const

  const nav = role === "student" ? studentNav : teacherNav

  return (
    <aside className="hidden md:flex w-60 flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border shadow-xl">
      <div className="px-4 py-4 border-b border-sidebar-border">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 transition group-hover:scale-105">
            <BookOpen className="size-4" />
          </span>
          <div className="leading-tight">
            <div className="font-bold text-base tracking-tight">NoteSeek</div>
            <div className="text-[10px] text-sidebar-foreground/60">Learn smarter</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-2 py-3 flex flex-col gap-0.5 overflow-y-auto">
        {nav.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                isActive
                  ? "text-white font-medium"
                  : "text-sidebar-foreground/70 hover:text-white hover:bg-sidebar-accent"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/90 to-violet-600/80 shadow-md"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className={cn("relative size-4 shrink-0", isActive && "text-white")} />
              <span className="relative">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t border-sidebar-border space-y-0.5">
        <Link
          href="/profile"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-white transition-colors"
        >
          <User2 className="size-3.5" />
          Profile
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/70 hover:bg-destructive/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="size-3.5" />
          Log out
        </button>
      </div>
    </aside>
  )
}
