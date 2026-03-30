"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Moon, Sun, User } from "lucide-react"
import { useTheme } from "./theme-provider"
import { createClient } from "@/lib/supabase/client"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { isDark, toggleTheme } = useTheme()
  const supabase = createClient()

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ]

  // Listen for Auth changes to update photo automatically
  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT SIDE: Account & Logo Section */}
          <Link href={user ? "/admin" : "/"} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-sm bg-muted flex items-center justify-center">
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
                // Default photo if not logged in
                <Image
                  src="/sangamkunwarphoto.png"
                  alt="Sangam Kunwar"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="flex flex-col">
              <span className="hidden sm:inline font-bold text-sm leading-tight text-foreground">
                {user ? (user.user_metadata?.full_name || "Account") : "Sangam Kunwar"}
              </span>
              {user && <span className="hidden sm:inline text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Verified</span>}
            </div>
          </Link>

          {/* Desktop Navigation (Center) */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* If NOT logged in: Show Auth Buttons */}
            {!user ? (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>

                <Link
                  href="/auth/signup"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              // If Logged in: Show Sign Out button on the right
              <button
                onClick={() => supabase.auth.signOut()}
                className="hidden sm:inline-block px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                Sign Out
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-border pt-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Auth Logic */}
            {!user ? (
              <div className="grid grid-cols-2 gap-2 px-4 pt-2">
                <Link 
                  href="/auth/login" 
                  className="text-center py-2 text-sm font-medium border border-input rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/signup" 
                  className="text-center py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg"
                  onClick={() => setIsOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <button
                onClick={() => {
                  supabase.auth.signOut();
                  setIsOpen(false);
                }}
                className="w-full text-center py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg"
              >
                Log Out
              </button>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}