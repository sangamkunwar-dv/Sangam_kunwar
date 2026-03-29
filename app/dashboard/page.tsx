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
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/auth/login")
      } else {
        setUser(session.user)
        fetchMessages(session.user.id)
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const fetchMessages = async (userId: string) => {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("sender_id", userId)
      .order("created_at", { ascending: false })

    setMessages(data || [])
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !subject.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setSending(true)

    try {
      console.log("[v0] Sending message to database and email")
      
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

      // Also send email notification to admin
      try {
        const response = await fetch('/api/send-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.email,
            email: user.email,
            subject,
            message,
          }),
        })
        
        if (response.ok) {
          console.log("[v0] Email notification sent to admin")
        }
      } catch (emailError) {
        console.error("[v0] Email notification failed:", emailError)
        // Don't fail the message submission if email fails
      }

      toast({
        title: "Message Sent!",
        description: "Your message has been sent successfully",
      })
      setMessage("")
      setSubject("")
      fetchMessages(user.id)
    } catch (err: any) {
      console.error("[v0] Message send error:", err)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
            <LogOut size={18} />
            Logout
          </Button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Send Message Form */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-bold mb-6">Send Message to Sangam</h2>
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Subject</label>
                <Input
                  placeholder="What is this about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Message</label>
                <Textarea
                  placeholder="Your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" disabled={sending} className="w-full">
                {sending ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </Card>

          {/* Message History */}
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Your Messages</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <p className="text-sm text-muted-foreground">No messages sent yet</p>
              ) : (
                messages.map((msg) => (
                  <div key={msg.id} className="p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">{msg.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Status: <span className="capitalize">{msg.status}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{new Date(msg.created_at).toLocaleDateString()}</p>
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
