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
import { LogOut, LayoutDashboard, Settings } from "lucide-react"

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
        
        {/* Adjusted the width slightly for better flow on mobile and desktop */}
        <DropdownMenuContent align="start" className="w-60 mt-2 p-1.5 shadow-xl border-border/50 backdrop-blur-md">
          <DropdownMenuLabel className="font-normal px-2 py-3">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-bold leading-none text-foreground truncate">
                {user.user_metadata?.full_name || "Account"}
              </p>
              <p className="text-[11px] leading-none text-muted-foreground truncate italic">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator className="mx-1" />
          
          <DropdownMenuItem asChild className="cursor-pointer gap-2.5 py-2.5 rounded-md transition-colors focus:bg-accent focus:text-accent-foreground">
            <Link href="/admin">
              <LayoutDashboard size={16} className="text-muted-foreground" />
              Dashboard
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild className="cursor-pointer gap-2.5 py-2.5 rounded-md transition-colors focus:bg-accent focus:text-accent-foreground">
            <Link href="/settings">
              <Settings size={16} className="text-muted-foreground" />
              Settings
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator className="mx-1" />
          
          {/* FINAL FIX: Ensure ALL states use standard focus/accent colors */}
          <DropdownMenuItem 
            className="cursor-pointer gap-2.5 py-2.5 rounded-md text-foreground transition-colors
              focus:bg-accent focus:text-accent-foreground
              hover:bg-accent hover:text-accent-foreground
              data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground
              touch-none"
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