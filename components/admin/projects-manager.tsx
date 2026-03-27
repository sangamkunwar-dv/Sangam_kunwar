"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Loader } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  id: string
  title: string
  description: string
  tech_stack: string[]
  image_url?: string
  github_link?: string
  live_link?: string
}

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    tech_stack: [],
    image_url: "",
    github_link: "",
    live_link: "",
  })
  const [techInput, setTechInput] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/projects", { cache: "no-store" }) // force fetch fresh data
      if (!response.ok) {
        const err = await response.text()
        throw new Error(err || "Failed to fetch projects")
      }
      const data = await response.json()
      setProjects(data)
    } catch (error: any) {
      console.error("[v1] Error fetching projects:", error.message)
      showMessage("Failed to load projects", "error")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleAddProject = async () => {
    if (!formData.title?.trim() || !formData.description?.trim()) {
      showMessage("Title and description are required", "error")
      return
    }

    setSaving(true)
    try {
      const url = editingId ? `/api/projects/${editingId}` : "/api/projects"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const err = await response.text()
        throw new Error(err || "Failed to save project")
      }

      showMessage(editingId ? "Project updated!" : "Project added!", "success")
      await fetchProjects()
      resetForm()
    } catch (error: any) {
      console.error("[v1] Error saving project:", error.message)
      showMessage("Failed to save project", "error")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tech_stack: [],
      image_url: "",
      github_link: "",
      live_link: "",
    })
    setTechInput("")
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (project: Project) => {
    setFormData(project)
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return
    try {
      const response = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete project")
      showMessage("Project deleted!", "success")
      await fetchProjects()
    } catch (error: any) {
      console.error("[v1] Error deleting project:", error.message)
      showMessage("Failed to delete project", "error")
    }
  }

  const addTech = () => {
    if (techInput.trim() && !formData.tech_stack?.includes(techInput.trim())) {
      setFormData({
        ...formData,
        tech_stack: [...(formData.tech_stack || []), techInput.trim()],
      })
      setTechInput("")
    }
  }

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      tech_stack: (formData.tech_stack || []).filter((t) => t !== tech),
    })
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin" />
      </div>
    )

  return (
    <div className="space-y-6">
      {/* ... the rest of your form & project display remains the same ... */}
    </div>
  )
}