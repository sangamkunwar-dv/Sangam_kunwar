"use client"

import { useState } from "react"
import { toast } from "sonner"

export default function BroadcastForm() {
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
        toast.success(`Success! Sent to ${result.sentTo} users.`)
        ;(e.target as HTMLFormElement).reset()
      } else {
        throw new Error(result.error || "Failed to send")
      }
    } catch (err: any) {
      toast.error(err.message || "Broadcast failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
      <form onSubmit={handleBroadcast} className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Campaign Title
          </label>
          <input
            name="title"
            type="text"
            placeholder="e.g., New Project: AI Portfolio"
            className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Email Message
          </label>
          <textarea
            name="content"
            placeholder="Write your update details here..."
            className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent h-40 outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
            Action Link
          </label>
          <input
            name="url"
            type="url"
            placeholder="https://sangamkunwar.com.np/projects/..."
            className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? "Sending Broadcast..." : "Send to All Users"}
        </button>
      </form>
    </div>
  )
}