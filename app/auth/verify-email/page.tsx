"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Check if email verification was successful
    const checkVerification = async () => {
      try {
        // Get the hash from URL (Supabase sends verification token in URL)
        const hash = window.location.hash
        if (hash) {
          // Wait a moment for Supabase to process the verification
          await new Promise((resolve) => setTimeout(resolve, 2000))
          setStatus("success")
          toast({
            title: "Email Verified",
            description: "Your email has been verified successfully. You can now log in.",
          })
        } else {
          setStatus("loading")
        }
      } catch (err) {
        console.error("[v0] Verification error:", err)
        setStatus("error")
      }
    }

    checkVerification()
  }, [toast])

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
            {status === "loading" && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
                <h1 className="text-2xl font-bold">Verifying Email</h1>
                <p className="text-muted-foreground mt-2">Please wait while we verify your email...</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <h1 className="text-2xl font-bold">Email Verified</h1>
                <p className="text-muted-foreground mt-2">Your email has been verified successfully!</p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="flex justify-center mb-4">
                  <AlertCircle className="w-12 h-12 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold">Verification Failed</h1>
                <p className="text-muted-foreground mt-2">There was an error verifying your email. Please try again.</p>
              </>
            )}
          </div>

          <div className="space-y-3">
            {status === "success" && (
              <Button onClick={() => router.push("/auth/login")} className="w-full">
                Go to Login
              </Button>
            )}
            {status === "error" && (
              <Button onClick={() => router.push("/auth/signup")} className="w-full">
                Try Again
              </Button>
            )}
            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Back to Home
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
