"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { LogOut, Send, MessageSquare, History } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")
  const [sending, setSending] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  // Wrapped in useCallback to prevent re-creation on every render
  const fetchMessages = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Fetch error:", error.message)
    } else {
      setMessages(data || [])
    }
  }, [supabase])

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/auth/login")
          return
        }

        setUser(session.user)
        await fetchMessages(session.user.id)

        // ⚡ REALTIME LISTENER
        const channel = supabase
          .channel(`user-messages-${session.user.id}`)
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'messages',
              filter: `sender_id=eq.${session.user.id}` 
            },
            () => {
              fetchMessages(session.user.id)
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      } catch (err) {
        console.error("Auth init error:", err)
      } finally {
        // This ensures "Loading..." disappears even if there's an error
        setLoading(false)
      }
    }

    initAuth()

    // Listen for sign-out events from other tabs
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push("/auth/login")
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase, fetchMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !subject.trim()) {
      toast({ title: "Error", description: "Please fill in all fields", variant: "destructive" })
      return
    }

    setSending(true)
    try {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          sender_email: user.email,
          subject,
          message,
          status: "pending",
        },
      ])

      if (error) throw error

      // Email Notification (Optional/Background)
      fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.email,
          email: user.email,
          subject,
          message,
        }),
      }).catch(() => null)

      toast({ title: "Success!", description: "Message sent and pending approval." })
      setMessage("")
      setSubject("")
      fetchMessages(user.id)
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground animate-pulse">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Logged in as <span className="text-primary font-medium">{user?.email}</span></p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="group border-red-200 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* Form Section */}
          <Card className="lg:col-span-7 p-6 border-primary/5 shadow-xl shadow-primary/5">
            <div className="flex items-center gap-2 mb-6">
              <MessageSquare className="text-primary h-5 w-5" />
              <h2 className="text-2xl font-bold">New Message</h2>
            </div>
            <form onSubmit={handleSendMessage} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input 
                  placeholder="e.g. Project Inquiry" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)} 
                  className="bg-muted/30 focus-visible:ring-primary"
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Message Details</label>
                <Textarea 
                  placeholder="Describe your request..." 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  rows={6} 
                  className="bg-muted/30 focus-visible:ring-primary resize-none"
                  required 
                />
              </div>
              <Button type="submit" className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20" disabled={sending}>
                {sending ? "Processing..." : <><Send className="mr-2 h-5 w-5" /> Send to Sangam</>}
              </Button>
            </form>
          </Card>

          {/* History Section */}
          <Card className="lg:col-span-5 p-6 border-primary/5 shadow-xl shadow-primary/5 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <History className="text-primary h-5 w-5" />
              <h2 className="text-xl font-bold">Recent History</h2>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {messages.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-2xl border-2 border-dashed">
                  <p className="text-muted-foreground">No messages sent yet.</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="group p-4 rounded-xl bg-card border hover:border-primary/30 transition-all duration-300">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-sm truncate">{msg.subject}</h3>
                      <div className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-widest font-black ${
                        msg.status === 'approved' 
                          ? 'bg-green-500/10 text-green-500 border border-green-500/20' 
                          : 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                      }`}>
                        {msg.status}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 italic">"{msg.message}"</p>
                    <div className="mt-3 flex items-center justify-between opacity-40 text-[9px]">
                       <span>ID: ...{msg.id.slice(-6)}</span>
                       <span>{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}