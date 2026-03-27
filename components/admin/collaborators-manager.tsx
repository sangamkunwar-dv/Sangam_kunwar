"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2, Github, Linkedin, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Collaborator {
  id: string
  name: string
  role: string
  bio?: string
  socialLinks?: { platform: string; url: string }[]
}

const initialCollaborators: Collaborator[] = [
  {
    id: "1",
    name: "Alex Johnson",
    role: "Full Stack Developer",
    bio: "Passionate about building scalable web applications",
    socialLinks: [
      { platform: "github", url: "#" },
      { platform: "linkedin", url: "#" },
    ],
  },
  {
    id: "2",
    name: "Sarah Chen",
    role: "UI/UX Designer",
    bio: "Creating beautiful and intuitive user experiences",
    socialLinks: [{ platform: "linkedin", url: "#" }],
  },
]

export default function CollaboratorsManager() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>(initialCollaborators)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Collaborator>>({
    name: "",
    role: "",
    bio: "",
    socialLinks: [],
  })
  const [socialPlatform, setSocialPlatform] = useState("github")
  const [socialUrl, setSocialUrl] = useState("")

  const handleAddCollaborator = () => {
    if (!formData.name?.trim() || !formData.role?.trim()) {
      alert("Name and role are required")
      return
    }

    if (editingId) {
      setCollaborators(
        collaborators.map((c) => (c.id === editingId ? ({ ...formData, id: editingId } as Collaborator) : c)),
      )
      setEditingId(null)
    } else {
      setCollaborators([...collaborators, { ...formData, id: Date.now().toString() } as Collaborator])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ name: "", role: "", bio: "", socialLinks: [] })
    setSocialPlatform("github")
    setSocialUrl("")
    setShowForm(false)
  }

  const handleEdit = (collaborator: Collaborator) => {
    setFormData(collaborator)
    setEditingId(collaborator.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this collaborator?")) {
      setCollaborators(collaborators.filter((c) => c.id !== id))
    }
  }

  const addSocialLink = () => {
    if (socialUrl.trim()) {
      setFormData({
        ...formData,
        socialLinks: [...(formData.socialLinks || []), { platform: socialPlatform, url: socialUrl.trim() }],
      })
      setSocialUrl("")
    }
  }

  const removeSocialLink = (platform: string) => {
    setFormData({
      ...formData,
      socialLinks: (formData.socialLinks || []).filter((link) => link.platform !== platform),
    })
  }

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "github":
        return <Github size={16} />
      case "linkedin":
        return <Linkedin size={16} />
      case "email":
        return <Mail size={16} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Collaborators</h1>
          <p className="text-muted-foreground">Manage your team and collaborators</p>
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
          Add Collaborator
        </button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Collaborator" : "Add New Collaborator"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="Full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Role</label>
                <input
                  type="text"
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="Job title or role"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
              <textarea
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Short bio or description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Social Links</label>
              <div className="flex gap-2 mb-2">
                <select
                  value={socialPlatform}
                  onChange={(e) => setSocialPlatform(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="email">Email</option>
                </select>
                <input
                  type="url"
                  value={socialUrl}
                  onChange={(e) => setSocialUrl(e.target.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="URL"
                />
                <button
                  onClick={addSocialLink}
                  className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:opacity-90"
                >
                  Add
                </button>
              </div>
              <div className="space-y-1">
                {(formData.socialLinks || []).map((link) => (
                  <div key={link.platform} className="flex justify-between items-center bg-muted/50 p-2 rounded">
                    <span className="text-sm flex items-center gap-2">
                      {getSocialIcon(link.platform)}
                      {link.platform}: {link.url}
                    </span>
                    <button
                      onClick={() => removeSocialLink(link.platform)}
                      className="text-xs text-destructive hover:font-bold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddCollaborator}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                {editingId ? "Update" : "Add"} Collaborator
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {collaborators.map((collaborator) => (
          <Card key={collaborator.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{collaborator.name}</h3>
                  <p className="text-sm text-primary font-medium">{collaborator.role}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(collaborator)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit2 size={18} className="text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(collaborator.id)}
                    className="p-2 hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} className="text-destructive" />
                  </button>
                </div>
              </div>
              {collaborator.bio && <p className="text-sm text-muted-foreground mb-3">{collaborator.bio}</p>}
              {collaborator.socialLinks && collaborator.socialLinks.length > 0 && (
                <div className="flex gap-2">
                  {collaborator.socialLinks.map((link) => (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-secondary rounded-lg transition-colors text-foreground"
                    >
                      {getSocialIcon(link.platform)}
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
