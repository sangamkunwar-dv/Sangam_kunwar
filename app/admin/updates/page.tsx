"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function AdminBroadcastPage() {
  const [loading, setLoading] = useState(false)

  async function handleBroadcast(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload = {
      title: formData.get("title"),
      content: formData.get("content"),
      url: formData.get("url"),
    }

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const result = await res.json()

      if (res.ok) {
        toast.success(`Broadcast sent successfully to ${result.sentTo || 'all'} users!`)
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error(result.error || "Failed to send broadcast")
      }
    } catch (err: any) {
      console.error("Broadcast Error:", err)
      toast.error(err.message || "Broadcast failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white dark:bg-zinc-950 rounded-xl border border-zinc-200 dark:border-zinc-800 mt-10 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Email Broadcast Center</h1>
        <p className="text-zinc-500 text-sm">This will send an email to every registered user in your database.</p>
      </div>

      <form onSubmit={handleBroadcast} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Update Title</label>
          <input 
            name="title" 
            placeholder="e.g., New Blog Post: Mastering Next.js" 
            className="p-2.5 border rounded-lg bg-transparent border-zinc-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Email Content</label>
          <textarea 
            name="content" 
            placeholder="Write your message here..." 
            className="p-2.5 border rounded-lg bg-transparent border-zinc-300 dark:border-zinc-700 h-40 outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">Action Link (URL)</label>
          <input 
            name="url" 
            type="url"
            placeholder="https://sangamkunwar.com.np/blog/nextjs" 
            className="p-2.5 border rounded-lg bg-transparent border-zinc-300 dark:border-zinc-700 outline-none focus:ring-2 focus:ring-blue-500" 
            required 
          />
        </div>

        <button 
          disabled={loading} 
          className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-2"
        >
          {loading ? "Sending Emails..." : "Blast Email to Everyone"}
        </button>
      </form>
    </div>
  )
}