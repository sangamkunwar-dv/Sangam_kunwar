"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Moon, Sun } from "lucide-react"
import { useTheme } from "./theme-provider"
import { createClient } from "@/lib/supabase/client"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true) // Added loading state
  const { isDark, toggleTheme } = useTheme()
  const supabase = createClient()

  // Replace with your actual admin email
  const ADMIN_EMAIL = "sangamkunwar48@gmail.com" 
  const isAdmin = user?.email === ADMIN_EMAIL

  const navItems = [
    { label: "About", href: "#about" },
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Contact", href: "#contact" },
  ]

  useEffect(() => {
    const getSession = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }
    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Logic for the profile link
  const getProfileHref = () => {
    if (loading) return "#" // Prevent jumping while loading
    if (!user) return "/"
    return isAdmin ? "/admin" : "/dashboard"
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto max-w-6xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LEFT SIDE: Clickable Profile/Logo Section */}
          <Link 
            href={getProfileHref()} 
            className={`flex items-center gap-3 transition-all group ${loading ? 'opacity-50 cursor-wait' : 'hover:opacity-80'}`}
          >
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary shadow-sm bg-muted flex items-center justify-center group-hover:scale-105 transition-transform">
              {user?.user_metadata?.avatar_url ? (
                <Image
                  src={user.user_metadata.avatar_url}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              ) : (
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
                {user ? (user.user_metadata?.full_name || (isAdmin ? "Admin" : "User")) : "Sangam Kunwar"}
              </span>
              {user && !loading && (
                <span className="hidden sm:inline text-[10px] text-primary font-bold tracking-tighter animate-pulse">
                  GO TO {isAdmin ? "ADMIN" : "DASHBOARD"} →
                </span>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
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

            {!user && !loading ? (
              <>
                <Link
                  href="/auth/login"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="hidden sm:inline-block px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-all shadow-md"
                >
                  Sign Up
                </Link>
              </>
            ) : user && (
              <button
                onClick={() => supabase.auth.signOut()}
                className="hidden sm:inline-block px-4 py-2 text-sm font-medium border border-border rounded-full hover:bg-secondary hover:text-secondary-foreground transition-colors"
              >
                Sign Out
              </button>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-2 pb-4 border-t border-border pt-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg"
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={() => {
                  supabase.auth.signOut()
                  setIsOpen(false)
                }}
                className="w-full text-center py-2 text-sm font-medium hover:bg-muted rounded-lg mt-2"
              >
                Log Out
              </button>
            ) : !loading && (
              <div className="grid grid-cols-2 gap-2 px-4 pt-2">
                <Link href="/auth/login" className="text-center py-2 text-sm border rounded-lg">Login</Link>
                <Link href="/auth/signup" className="text-center py-2 text-sm bg-primary text-white rounded-lg">Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  )
}