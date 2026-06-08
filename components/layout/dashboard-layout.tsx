"use client"

import { ReactNode } from "react"
import Sidebar from "./sidebar"
import Topbar from "./topbar"

interface DashboardLayoutProps {
  children: ReactNode
  role: "student" | "teacher"
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen mesh-dashboard overflow-hidden">
      <Sidebar role={role} />
      <div className="flex flex-col flex-1 min-h-0 min-w-0">
        <Topbar role={role} />
        <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
