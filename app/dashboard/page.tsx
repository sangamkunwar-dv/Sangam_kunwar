"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { LogOut } from "lucide-react"

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
      } else {
        setUser(session.user)
        fetchMessages(session.user.id)

        // ⚡ REALTIME LISTENER: Refresh list when Admin updates a message
        const channel = supabase
          .channel('db-changes')
          .on(
            'postgres_changes',
            { 
              event: 'UPDATE', 
              schema: 'public', 
              table: 'messages',
              filter: `sender_id=eq.${session.user.id}` 
            },
            () => {
              fetchMessages(session.user.id) // Refresh when status changes
            }
          )
          .subscribe()

        return () => {
          supabase.removeChannel(channel)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const fetchMessages = async (userId: string) => {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_id", userId)
      .order("created_at", { ascending: false })

    if (error) console.error("Fetch error:", error)
    setMessages(data || [])
  }

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

      // Email Notification
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.email,
          email: user.email,
          subject,
          message,
        }),
      }).catch(e => console.error("Email notify failed", e))

      toast({ title: "Sent!", description: "Message is now pending approval." })
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

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Dashboard</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-red-500 hover:text-red-600">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-6 shadow-lg border-primary/10">
            <h2 className="text-xl font-semibold mb-4">New Message</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <Input 
                placeholder="Subject" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                required 
              />
              <Textarea 
                placeholder="Type your message..." 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                rows={5} 
                required 
              />
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">History</h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <p className="text-sm text-center text-muted-foreground py-10">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="p-4 rounded-xl bg-secondary/30 border border-secondary">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm">{msg.subject}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold ${
                        msg.status === 'approved' ? 'bg-green-500/20 text-green-600' : 'bg-yellow-500/20 text-yellow-600'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{msg.message}</p>
                    <p className="text-[10px] mt-2 opacity-50">{new Date(msg.created_at).toLocaleDateString()}</p>
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