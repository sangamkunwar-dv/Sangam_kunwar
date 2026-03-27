// ... existing imports
import { ArrowLeft } from "lucide-react"

export default function SignupPage() {
  // ... (keep existing logic)
  
  // Add the OAuth handler to Signup as well
  const handleOAuthLogin = async (provider: "github" | "google") => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      })
      if (error) throw error
    } catch (err: any) {
      toast({ title: "OAuth Error", description: err.message, variant: "destructive" })
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          {/* ... Back to home and Header ... */}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* ... Full Name, Email, Password inputs ... */}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or join with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={() => handleOAuthLogin("github")} disabled={loading}>
              <img src="https://authjs.dev/img/providers/github.svg" alt="GitHub" className="mr-2 h-4 w-4 dark:invert" />
              GitHub
            </Button>
            <Button variant="outline" onClick={() => handleOAuthLogin("google")} disabled={loading}>
              <img src="https://authjs.dev/img/providers/google.svg" alt="Google" className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>

          <div className="text-center text-sm">
             {/* ... Sign in link */}
          </div>
        </div>
      </Card>
    </div>
  )
}