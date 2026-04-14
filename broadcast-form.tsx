"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Calendar, Clock } from "lucide-react"

export default function BroadcastForm() {
  const [loading, setLoading] = useState(false)
  const [scheduleType, setScheduleType] = useState<"immediate" | "scheduled">("immediate")
  const [scheduleDate, setScheduleDate] = useState("")
  const [scheduleTime, setScheduleTime] = useState("")

  async function handleBroadcast(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)  
    // Validate scheduled time if scheduling
    if (scheduleType === "scheduled") {
      if (!scheduleDate || !scheduleTime) {
        toast.error("Please select both date and time for scheduling")
        setLoading(false)
        return
      }
    }

    const payload = {
      title: formData.get("title"),
      content: formData.get("content"),
      url: formData.get("url"),
      scheduleType: scheduleType,
      scheduledAt: scheduleType === "scheduled" ? `${scheduleDate}T${scheduleTime}` : null,
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
        if (scheduleType === "immediate") {
          toast.success(`Success! Sent to ${result.sentTo} users.`)
        } else {
          toast.success(`Broadcast scheduled for ${scheduleDate} at ${scheduleTime}`)
        }
        ;(e.target as HTMLFormElement).reset()
        setScheduleDate("")
        setScheduleTime("")
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

        {/* Schedule Type Selection */}
        <div className="space-y-3 p-4 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
          <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 block">
            Send Type
          </label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendType"
                value="immediate"
                checked={scheduleType === "immediate"}
                onChange={() => setScheduleType("immediate")}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Send Immediately</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendType"
                value="scheduled"
                checked={scheduleType === "scheduled"}
                onChange={() => setScheduleType("scheduled")}
                className="w-4 h-4 accent-blue-600"
              />
              <span className="text-sm text-zinc-700 dark:text-zinc-300">Schedule for Later</span>
            </label>
          </div>
        </div>

        {/* Schedule Date and Time Inputs */}
        {scheduleType === "scheduled" && (
          <div className="space-y-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Calendar size={16} />
                  Schedule Date
                </label>
                <input
                  type="date"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required={scheduleType === "scheduled"}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                  <Clock size={16} />
                  Schedule Time
                </label>
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required={scheduleType === "scheduled"}
                />
              </div>
            </div>
            {scheduleDate && scheduleTime && (
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                📅 Scheduled for: {new Date(`{scheduleDate}T{scheduleTime}`).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100"
        >
          {loading ? (scheduleType === "scheduled" ? "Scheduling Broadcast..." : "Sending Broadcast...") : (scheduleType === "scheduled" ? "Schedule Broadcast" : "Send to All Users")}
        </button>
      </form>
    </div>
  )
}