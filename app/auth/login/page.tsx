"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Github, Mail } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false) // Added state for forgot password
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  const handleOAuthLogin = async (provider: "github" | "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (err: any) {
      toast({
        title: "OAuth Error",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      console.log("[v0] Attempting login for:", email)

      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("[v0] Login error:", signInError)
        toast({
          title: "Login Failed",
          description: signInError.message,
          variant: "destructive",
        })
        return
      }

      if (!signInData.user) {
        toast({
          title: "Login Failed",
          description: "No user data returned",
          variant: "destructive",
        })
        return
      }

      console.log("[v0] Login successful for:", signInData.user.email)
      console.log("[v0] Email verified:", !!signInData.user.email_confirmed_at)

      // Check if email is verified
      if (!signInData.user.email_confirmed_at) {
        toast({
          title: "Email Not Verified",
          description: "Please verify your email before logging in. Check your inbox for the verification link.",
          variant: "destructive",
        })
        await supabase.auth.signOut()
        return
      }

      toast({
        title: "Success",
        description: "Logged in successfully! Redirecting...",
      })

      // Redirect based on email
      setTimeout(() => {
        if (email === "sangamkunwar48@gmail.com") {
          console.log("[v0] Redirecting to admin panel")
          window.location.href = "/admin"
        } else {
          console.log("[v0] Redirecting to dashboard")
          window.location.href = "/dashboard"
        }
      }, 800)
    } catch (err) {
      console.error("[v0] Unexpected login error:", err)
      toast({
        title: "Error",
        description: "An unexpected error occurred during login",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      if (error) throw error
      toast({
        title: "Reset Link Sent",
        description: "Please check your email for the password reset link.",
      })
      setForgotPassword(false)
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold">{forgotPassword ? "Reset Password" : "Welcome Back"}</h1>
            <p className="text-muted-foreground mt-2">
              {forgotPassword ? "Enter your email to receive a reset link" : "Sign in to your account"}
            </p>
          </div>

          {!forgotPassword ? (
            <div className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-sm font-medium">Password</label>
                    <button
                      type="button"
                      onClick={() => setForgotPassword(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleOAuthLogin("github")} disabled={loading}>
                  <Github className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
                <Button variant="outline" onClick={() => handleOAuthLogin("google")} disabled={loading}>
                  <Mail className="mr-2 h-4 w-4" />
                  Google
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending link..." : "Send Reset Link"}
              </Button>
              <Button type="button" variant="ghost" className="w-full" onClick={() => setForgotPassword(false)}>
                Back to Login
              </Button>
            </form>
          )}

          <div className="text-center text-sm">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-primary hover:underline font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
