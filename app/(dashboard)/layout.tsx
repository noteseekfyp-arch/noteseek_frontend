"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { getUserRole } from "@/features/auth/cookies"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  // Routes without a role prefix (e.g. /notes/{id}, /explore, /profile) fall
  // back to the logged-in user's role from the cookie.
  const [cookieRole, setCookieRole] = useState<"student" | "teacher" | null>(null)

  useEffect(() => {
    const r = getUserRole()
    if (r === "teacher" || r === "student") setCookieRole(r)
  }, [])

  const role = pathname?.startsWith("/teacher")
    ? "teacher"
    : pathname?.startsWith("/student")
      ? "student"
      : (cookieRole ?? "student")

  return <DashboardLayout role={role}>{children}</DashboardLayout>
}
