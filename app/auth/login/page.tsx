// ... existing imports
import { ArrowLeft } from "lucide-react" // Removed Github, Mail from here

export default function LoginPage() {
  // ... (keep all existing logic/state)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          {/* ... existing Back to home link and Header ... */}

          {!forgotPassword ? (
            <div className="space-y-4">
              {/* ... existing Login Form ... */}

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => handleOAuthLogin("github")} disabled={loading} className="flex items-center justify-center">
                  <img 
                    src="https://authjs.dev/img/providers/github.svg" 
                    alt="GitHub" 
                    className="mr-2 h-4 w-4 dark:invert" 
                  />
                  GitHub
                </Button>
                <Button variant="outline" onClick={() => handleOAuthLogin("google")} disabled={loading} className="flex items-center justify-center">
                  <img 
                    src="https://authjs.dev/img/providers/google.svg" 
                    alt="Google" 
                    className="mr-2 h-4 w-4" 
                  />
                  Google
                </Button>
              </div>
            </div>
          ) : (
             // ... existing Forgot Password form
          )}

          {/* ... existing Sign up link */}
        </div>
      </Card>
    </div>
  )
}