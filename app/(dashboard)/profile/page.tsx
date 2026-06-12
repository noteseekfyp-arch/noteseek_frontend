"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Mail, ShieldCheck, UserRound, GraduationCap, Presentation } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageHeader } from "@/components/layout/page-header"
import { PageShell } from "@/components/layout/page-shell"
import { getCurrentUser } from "@/features/auth/api"
import { getAccessToken } from "@/features/auth/cookies"
import { useAuth } from "@/hooks/useAuth"

interface UserProfile {
  id: string
  email: string
  role: string
  is_active: boolean
  is_verified: boolean
}

export default function ProfilePage() {
  const router = useRouter()
  const { logout } = useAuth()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const token = getAccessToken()
      if (!token) {
        router.push("/login")
        return
      }
      try {
        const data = await getCurrentUser(token)
        if (!cancelled) setUser(data)
      } catch {
        if (!cancelled) setError("Could not load your profile. Please log in again.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  function handleLogout() {
    logout()
    router.push("/login")
  }

  const isTeacher = user?.role === "teacher"
  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "NS"

  return (
    <PageShell>
      <PageHeader
        eyebrow="Account"
        title="My Profile"
        description="Your NoteSeek account details."
      />

      {loading ? (
        <div className="max-w-xl space-y-4">
          <div className="shimmer h-32 rounded-xl" />
          <div className="shimmer h-48 rounded-xl" />
        </div>
      ) : error || !user ? (
        <p className="text-sm text-destructive" role="alert">
          {error ?? "Profile unavailable."}
        </p>
      ) : (
        <div className="max-w-xl space-y-5">
          <Card className="glass-card border-0 shadow-md overflow-hidden">
            <div className="h-20 bg-gradient-to-r from-indigo-500/90 to-violet-600/90" />
            <CardContent className="-mt-10 pb-6 flex items-end gap-4">
              <Avatar className="size-20 ring-4 ring-white shadow-lg">
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="pb-1">
                <div className="font-semibold text-lg leading-tight">{user.email.split("@")[0]}</div>
                <Badge variant="outline" className="mt-1 capitalize">
                  {isTeacher ? (
                    <Presentation className="size-3 mr-1" />
                  ) : (
                    <GraduationCap className="size-3 mr-1" />
                  )}
                  {user.role}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <UserRound className="size-4 text-primary" />
                Account details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="size-4" /> Email
                </span>
                <span className="font-medium">{user.email}</span>
              </div>
              <div className="flex items-center justify-between border-b pb-3">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <ShieldCheck className="size-4" /> Account status
                </span>
                <Badge variant="outline" className={user.is_active ? "text-green-600 border-green-200 bg-green-50" : ""}>
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-muted-foreground">
                  <UserRound className="size-4" /> Role
                </span>
                <span className="font-medium capitalize">{user.role}</span>
              </div>
            </CardContent>
          </Card>

          <Button variant="outline" onClick={handleLogout} className="text-destructive hover:text-destructive">
            <LogOut className="size-4 mr-1.5" /> Log out
          </Button>
        </div>
      )}
    </PageShell>
  )
}
