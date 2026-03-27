"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      console.log("[v0] Handling auth callback...")
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        console.error("[v0] Auth callback error:", error)
        router.push("/auth/login?error=callback_failed")
        return
      }

      if (session) {
        console.log("[v0] Session established for:", session.user.email)
        if (session.user.email === "sangamkunwar48@gmail.com") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        router.push("/")
      }
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  )
}
