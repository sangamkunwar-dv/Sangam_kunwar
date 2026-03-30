"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { LogOut, LayoutDashboard, Settings } from "lucide-react" // Added icons for a nicer look

export default function UserProfile() {
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

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

  if (!user) {
    return (
      <Link href="/auth/login" className="text-sm font-medium hover:text-primary transition-colors">
        Login
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none group">
          <Avatar className="h-9 w-9 border-2 border-primary/10 group-hover:border-primary/50 transition-all duration-300">
            <AvatarImage src={user.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
              {user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="start" className="w-64 mt-2 p-2 shadow-xl border-border/50 backdrop-blur-md">
          <DropdownMenuLabel className="font-normal px-2 py-3">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none text-foreground">
                {user.user_metadata?.full_name || "Account"}
              </p>
              <p className="text-xs leading-none text-muted-foreground truncate italic">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="mx-1" />
          
          <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2.5">
            <Link href="/admin">
              <LayoutDashboard size={16} className="text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="cursor-pointer gap-2 py-2.5">
            <Link href="/settings">
              <Settings size={16} className="text-muted-foreground" />
              Settings
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="mx-1" />
          
          {/* FIXED: Removed text-destructive (Red color) */}
          <DropdownMenuItem 
            className="cursor-pointer gap-2 py-2.5 text-foreground focus:bg-accent focus:text-accent-foreground"
            onClick={() => supabase.auth.signOut()}
          >
            <LogOut size={16} className="text-muted-foreground" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}