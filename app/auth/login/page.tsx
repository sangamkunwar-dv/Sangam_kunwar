"use client"

import React, { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Github } from "lucide-react"

const GoogleLogo = () => (
  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [forgotPassword, setForgotPassword] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  const handleOAuth = async (provider: "github" | "google") => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
    // Note: Profiles for OAuth are usually handled in the /auth/callback route 
    // or via the Supabase SQL Trigger we discussed earlier.
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else if (!data.user?.email_confirmed_at) {
      toast({ title: "Verify Email", description: "Please check your inbox.", variant: "destructive" })
      await supabase.auth.signOut()
    } else {
      // --- BROADCAST SYNC LOGIC ---
      // Ensure user is in the profiles table for email broadcasts
      try {
        await supabase.from("profiles").upsert({
          id: data.user.id,
          email: data.user.email,
        })
      } catch (syncError) {
        console.error("Failed to sync profile for broadcast", syncError)
      }
      // ----------------------------

      window.location.href = email === "sangamkunwar48@gmail.com" ? "/admin" : "/dashboard"
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8 shadow-xl border-muted/50">
        <div className="space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">{forgotPassword ? "Reset" : "Welcome Back"}</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {!forgotPassword && <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />}
            <Button className="w-full" disabled={loading}>{loading ? "Processing..." : forgotPassword ? "Send Reset Link" : "Sign In"}</Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
            <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleOAuth("github")} className="hover:bg-[#24292F] hover:text-white transition-all">
              <Github className="mr-2 h-4 w-4" /> GitHub
            </Button>
            <Button variant="outline" onClick={() => handleOAuth("google")} className="hover:bg-gray-50">
              <GoogleLogo /> Google
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            New here? <Link href="/auth/signup" className="text-primary hover:underline font-medium">Create account</Link>
          </p>
        </div>
      </Card>
    </div>
  )
}