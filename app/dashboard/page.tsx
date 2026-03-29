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
    let channel: any;

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/auth/login")
          return
        }

        setUser(session.user)
        await fetchMessages(session.user.id)

        // ⚡ REALTIME LISTENER: Listen for the 'approved' status change
        channel = supabase
          .channel(`public:messages:sender_id=eq.${session.user.id}`)
          .on(
            'postgres_changes',
            { 
              event: '*', // Listen for any change (Update/Insert/Delete)
              schema: 'public', 
              table: 'messages',
            },
            (payload) => {
              console.log("Change received!", payload)
              fetchMessages(session.user.id) // Automatically refresh the UI
            }
          )
          .subscribe()

      } catch (err) {
        console.error("Auth init error:", err)
      } finally {
        setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push("/auth/login")
      }
    })

    return () => {
      subscription.unsubscribe()
      if (channel) supabase.removeChannel(channel)
    }
  }, [router, supabase, fetchMessages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !subject.trim()) {
      toast({ title: "Error", description: "All fields required", variant: "destructive" })
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

      toast({ title: "Success!", description: "Message sent! Waiting for approval." })
      setMessage("")
      setSubject("")
      // No need to manually fetch here if Realtime is working, but it doesn't hurt
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
        <p className="text-muted-foreground animate-pulse">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex justify-between items-center mb-8 border-b pb-6">
          <div>
            <h1 className="text-3xl font-bold">User Dashboard</h1>
            <p className="text-sm text-muted-foreground">User: {user?.email}</p>
          </div>
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Sign Out
          </Button>
        </header>

        <div className="grid gap-8 lg:grid-cols-12">
          {/* New Message Form */}
          <Card className="lg:col-span-7 p-6 border-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Send a Message
            </h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Input 
                placeholder="Subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                required 
              />
              <Textarea 
                placeholder="Write your message here..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                rows={6} 
                required 
              />
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          {/* Recent History */}
          <Card className="lg:col-span-5 p-6 bg-muted/20">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <History className="h-5 w-5" /> History
            </h2>
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 italic">No messages sent yet.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-lg bg-white border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-sm truncate max-w-[150px]">{msg.subject}</h3>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-black uppercase ${
                        msg.status === 'approved' 
                          ? 'bg-green-100 text-green-700 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
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