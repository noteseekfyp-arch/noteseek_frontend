"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { BookOpen, LogIn, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false)
      
      const normalizedEmail = email.toLowerCase().trim()
      
      // Temporary Hardcoded Auth Logic
      if (normalizedEmail === "teacher@noteseek.com" && password === "password123") {
        router.push("/teacher")
      } else if (normalizedEmail === "student@noteseek.com" && password === "password123") {
        router.push("/student")
      } else {
        setError("Invalid email or password. Please use the demo credentials.")
      }
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-90 transition-opacity">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
          <BookOpen className="size-6" />
        </div>
        <span className="font-bold text-3xl tracking-tight text-slate-900">NoteSeek</span>
      </Link>

      <Card className="w-full max-w-md shadow-xl border-primary/10">
        <CardHeader className="space-y-2 text-center pb-6">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to access your digital classroom.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 mb-4 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md flex items-start gap-2">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@noteseek.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="text-xs text-primary font-medium hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading ? "Signing in..." : (
                <>Sign In <LogIn className="ml-2 size-4" /></>
              )}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-4 border-t px-6 py-4 bg-muted/20">
          <div className="w-full text-sm text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link href="#" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </div>
          
          <div className="w-full p-4 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800">
            <p className="font-bold mb-2 text-blue-900 uppercase tracking-wider text-[10px]">Demo Credentials</p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="font-semibold text-blue-900">Teacher:</p>
                <p>teacher@noteseek.com</p>
                <p>password123</p>
              </div>
              <div>
                <p className="font-semibold text-blue-900">Student:</p>
                <p>student@noteseek.com</p>
                <p>password123</p>
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
