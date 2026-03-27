"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Trash2, Mail, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  email: string
  subject: string
  message: string
  status: "pending" | "approved" | "rejected" | "unread" | "read"
  created_at: string
}

export default function MessagesManager() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase.from("messages").select("*").order("created_at", { ascending: false })

      if (error) {
        const response = await fetch("/api/contact")
        const result = await response.json()
        setMessages(result.messages || [])
      } else {
        setMessages(data || [])
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("messages").delete().eq("id", id)

      if (error) throw error

      setMessages(messages.filter((m) => m.id !== id))
      toast({
        title: "Success",
        description: "Message deleted",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase.from("messages").update({ status: "approved" }).eq("id", id)

      if (error) throw error

      setMessages(messages.map((m) => (m.id === id ? { ...m, status: "approved" } : m)))
      toast({
        title: "Success",
        description: "Message approved",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleReply = (email: string) => {
    window.location.href = `mailto:${email}`
  }

  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground">Manage visitor messages and inquiries</p>
      </div>

      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Mail size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground">No messages yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <Card key={msg.id}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-foreground">{msg.subject}</h3>
                        {msg.status === "approved" && <CheckCircle size={18} className="text-green-500" />}
                        {msg.status === "pending" && <Clock size={18} className="text-yellow-500" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">From: {msg.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(msg.created_at || Date.now()).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {msg.status === "pending" && (
                        <Button size="sm" onClick={() => handleApprove(msg.id)} className="gap-2">
                          <CheckCircle size={16} />
                          Approve
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReply(msg.email)}
                        className="bg-transparent"
                      >
                        Reply
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(msg.id)}>
                        <Trash2 size={18} className="text-destructive" />
                      </Button>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-foreground whitespace-pre-wrap">{msg.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
