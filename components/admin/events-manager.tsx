"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  date: string
  description: string
  type: "upcoming" | "past"
  location?: string
}

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Web Development Workshop",
    date: "2025-11-15",
    description: "Learn modern web development with Next.js and React",
    type: "upcoming",
    location: "Online",
  },
  {
    id: "2",
    title: "Tech Talk: Future of AI",
    date: "2025-10-20",
    description: "Discussion on AI trends and opportunities",
    type: "past",
    location: "Tech Hub",
  },
]

export default function EventsManager() {
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    date: "",
    description: "",
    type: "upcoming",
    location: "",
  })

  const handleAddEvent = () => {
    if (!formData.title?.trim() || !formData.date) {
      alert("Title and date are required")
      return
    }

    if (editingId) {
      setEvents(events.map((e) => (e.id === editingId ? ({ ...formData, id: editingId } as Event) : e)))
      setEditingId(null)
    } else {
      setEvents([...events, { ...formData, id: Date.now().toString() } as Event])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ title: "", date: "", description: "", type: "upcoming", location: "" })
    setShowForm(false)
  }

  const handleEdit = (event: Event) => {
    setFormData(event)
    setEditingId(event.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this event?")) {
      setEvents(events.filter((e) => e.id !== id))
    }
  }

  const upcomingEvents = events.filter((e) => e.type === "upcoming")
  const pastEvents = events.filter((e) => e.type === "past")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground">Manage your events and activities</p>
        </div>
        <button
          onClick={() => {
            if (showForm) {
              resetForm()
            } else {
              setShowForm(true)
            }
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
        >
          <Plus size={20} />
          Add Event
        </button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Event" : "Add New Event"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Event title"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                <input
                  type="date"
                  value={formData.date || ""}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Type</label>
                <select
                  value={formData.type || "upcoming"}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as "upcoming" | "past" })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Event location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Event description"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleAddEvent}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                {editingId ? "Update" : "Add"} Event
              </button>
              <button
                onClick={resetForm}
                className="flex-1 bg-secondary text-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Cancel
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {upcomingEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Events</h2>
          <div className="grid gap-4">
            {upcomingEvents.map((event) => (
              <Card key={event.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-primary" />
                        <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
                      {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                      <p className="text-foreground mt-2">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {pastEvents.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">Past Events</h2>
          <div className="grid gap-4">
            {pastEvents.map((event) => (
              <Card key={event.id} className="opacity-75">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Calendar size={18} className="text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{new Date(event.date).toLocaleDateString()}</p>
                      {event.location && <p className="text-sm text-muted-foreground">{event.location}</p>}
                      <p className="text-foreground mt-2">{event.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                      >
                        <Edit2 size={18} className="text-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} className="text-destructive" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
