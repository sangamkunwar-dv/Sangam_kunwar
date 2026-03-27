"use client"

import { useState, useEffect } from "react"
import { Plus, Edit2, Trash2, Loader } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Skill {
  id: string
  category: string
  items: string[]
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<Partial<Skill>>({
    category: "",
    items: [],
  })
  const [itemInput, setItemInput] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/skills")
      if (!response.ok) throw new Error("Failed to fetch skills")
      const data = await response.json()
      setSkills(data)
    } catch (error) {
      console.error("[v0] Error fetching skills:", error)
      showMessage("Failed to load skills", "error")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleAddSkill = async () => {
    if (!formData.category?.trim() || !formData.items?.length) {
      showMessage("Category and at least one skill are required", "error")
      return
    }

    setSaving(true)
    try {
      const url = editingId ? `/api/skills/${editingId}` : "/api/skills"
      const method = editingId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to save skill")

      showMessage(editingId ? "Skill updated successfully!" : "Skill added successfully!", "success")
      await fetchSkills()
      resetForm()
    } catch (error) {
      console.error("[v0] Error saving skill:", error)
      showMessage("Failed to save skill", "error")
    } finally {
      setSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      category: "",
      items: [],
    })
    setItemInput("")
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (skill: Skill) => {
    setFormData(skill)
    setEditingId(skill.id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill category?")) return

    try {
      const response = await fetch(`/api/skills/${id}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete skill")
      showMessage("Skill deleted successfully!", "success")
      await fetchSkills()
    } catch (error) {
      console.error("[v0] Error deleting skill:", error)
      showMessage("Failed to delete skill", "error")
    }
  }

  const addItem = () => {
    if (itemInput.trim() && !formData.items?.includes(itemInput.trim())) {
      setFormData({
        ...formData,
        items: [...(formData.items || []), itemInput.trim()],
      })
      setItemInput("")
    }
  }

  const removeItem = (item: string) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter((i) => i !== item),
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skills</h1>
          <p className="text-muted-foreground">Manage your technical skills by category</p>
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
          Add Skill Category
        </button>
      </div>

      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            messageType === "success"
              ? "bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400"
              : "bg-destructive/10 border border-destructive/20 text-destructive"
          }`}
        >
          {message}
        </div>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Skill Category" : "Add New Skill Category"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Category Name</label>
              <input
                type="text"
                value={formData.category || ""}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="e.g., Frontend, Backend, Tools"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={itemInput}
                  onChange={(e) => setItemInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addItem()}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="Add skill (press Enter)"
                />
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:opacity-90"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.items || []).map((item) => (
                  <div key={item} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
                    <span className="text-sm">{item}</span>
                    <button onClick={() => removeItem(item)} className="text-xs hover:text-destructive">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddSkill}
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? "Saving..." : editingId ? "Update" : "Add"} Category
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

      <div className="grid gap-4">
        {skills.map((skill) => (
          <Card key={skill.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{skill.category}</h3>
                  {skill.items && skill.items.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {skill.items.map((item) => (
                        <span key={item} className="px-2 py-1 bg-secondary text-foreground text-xs rounded">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit2 size={18} className="text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id)}
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
  )
}
