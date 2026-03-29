"use client"

import { useState } from "react"
import { Plus, Edit2, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  id: string
  title: string
  description: string
  techStack: string[]
  links: { label: string; url: string }[]
}

const initialProjects: Project[] = [
  {
    id: "1",
    title: "Portfolio Website",
    description: "Modern portfolio showcasing projects and collaborations",
    techStack: ["Next.js", "React", "Tailwind CSS"],
    links: [{ label: "Live", url: "#" }],
  },
  {
    id: "2",
    title: "E-commerce Platform",
    description: "Full-stack e-commerce solution with payment integration",
    techStack: ["Node.js", "MongoDB", "React"],
    links: [{ label: "GitHub", url: "#" }],
  },
]

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(initialProjects)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({
    title: "",
    description: "",
    techStack: [],
    links: [],
  })
  const [techInput, setTechInput] = useState("")
  const [linkLabel, setLinkLabel] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const handleAddProject = () => {
    if (!formData.title?.trim() || !formData.description?.trim()) {
      alert("Title and description are required")
      return
    }

    if (editingId) {
      setProjects(projects.map((p) => (p.id === editingId ? ({ ...formData, id: editingId } as Project) : p)))
      setEditingId(null)
    } else {
      setProjects([...projects, { ...formData, id: Date.now().toString() } as Project])
    }
    resetForm()
  }

  const resetForm = () => {
    setFormData({ title: "", description: "", techStack: [], links: [] })
    setTechInput("")
    setLinkLabel("")
    setLinkUrl("")
    setShowForm(false)
  }

  const handleEdit = (project: Project) => {
    setFormData(project)
    setEditingId(project.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id))
    }
  }

  const addTech = () => {
    if (techInput.trim()) {
      setFormData({
        ...formData,
        techStack: [...(formData.techStack || []), techInput.trim()],
      })
      setTechInput("")
    }
  }

  const removeTech = (tech: string) => {
    setFormData({
      ...formData,
      techStack: (formData.techStack || []).filter((t) => t !== tech),
    })
  }

  const addLink = () => {
    if (linkLabel.trim() && linkUrl.trim()) {
      setFormData({
        ...formData,
        links: [...(formData.links || []), { label: linkLabel.trim(), url: linkUrl.trim() }],
      })
      setLinkLabel("")
      setLinkUrl("")
    }
  }

  const removeLink = (index: number) => {
    setFormData({
      ...formData,
      links: (formData.links || []).filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">Manage your portfolio projects</p>
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
          Add Project
        </button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Project" : "Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Project title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Project description"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Tech Stack</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTech()}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                  placeholder="Add technology (press Enter)"
                />
                <button
                  onClick={addTech}
                  className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:opacity-90"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(formData.techStack || []).map((tech) => (
                  <div key={tech} className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-full">
                    <span className="text-sm">{tech}</span>
                    <button onClick={() => removeTech(tech)} className="text-xs hover:text-destructive">
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Links</label>
              <div className="space-y-2 mb-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={linkLabel}
                    onChange={(e) => setLinkLabel(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                    placeholder="Link label (e.g., Live, GitHub)"
                  />
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                    placeholder="URL"
                  />
                  <button
                    onClick={addLink}
                    className="px-4 py-2 bg-secondary text-foreground rounded-lg hover:opacity-90"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {(formData.links || []).map((link, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-muted/50 p-2 rounded">
                    <span className="text-sm">
                      {link.label}:{" "}
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                        {link.url}
                      </a>
                    </span>
                    <button onClick={() => removeLink(idx)} className="text-xs text-destructive hover:font-bold">
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddProject}
                className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                {editingId ? "Update" : "Add"} Project
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
        {projects.map((project) => (
          <Card key={project.id}>
            <CardContent className="pt-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{project.title}</h3>
                  <p className="text-muted-foreground mt-1">{project.description}</p>
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-secondary text-foreground text-xs rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  {project.links && project.links.length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline"
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-2 hover:bg-secondary rounded-lg transition-colors"
                  >
                    <Edit2 size={18} className="text-foreground" />
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
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
