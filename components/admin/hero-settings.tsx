"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface HeroSettings {
  id?: string
  title: string
  subtitle: string
  description: string
  photo_url: string
  logo_url: string
}

export default function HeroSettings() {
  const [heroContent, setHeroContent] = useState<HeroSettings>({
    title: "I'm Sangam Kunwar",
    subtitle: "Full-Stack Developer & Designer",
    description: "I'm passionate about building beautiful, functional web applications.",
    photo_url:
      "/images/sangamkunwar-photo.jpg",
    logo_url: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  useEffect(() => {
    fetchHeroSettings()
  }, [])

  const fetchHeroSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/hero-settings")
      if (!response.ok) throw new Error("Failed to fetch hero settings")
      const data = await response.json()
      if (data && data.id) {
        setHeroContent(data)
      }
    } catch (error) {
      console.error("[v0] Error fetching hero settings:", error)
      showMessage("Failed to load hero settings", "error")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(""), 3000)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/hero-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: heroContent.title,
          subtitle: heroContent.subtitle,
          description: heroContent.description,
          photo_url: heroContent.photo_url,
          logo_url: heroContent.logo_url,
        }),
      })

      if (!response.ok) throw new Error("Failed to save hero settings")
      const data = await response.json()
      setHeroContent(data)
      showMessage("Hero content updated successfully!", "success")
    } catch (error) {
      console.error("[v0] Error saving hero settings:", error)
      showMessage("Error updating hero content", "error")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Hero Section Settings</h1>
        <p className="text-muted-foreground mt-2">Customize your portfolio hero section</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Hero Content</CardTitle>
          <CardDescription>Update your hero section content</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input
              value={heroContent.title}
              onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
              placeholder="Your title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Subtitle</label>
            <Input
              value={heroContent.subtitle}
              onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
              placeholder="Your subtitle"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea
              value={heroContent.description}
              onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
              placeholder="Your description"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Photo URL</label>
            <Input
              value={heroContent.photo_url}
              onChange={(e) => setHeroContent({ ...heroContent, photo_url: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Logo URL</label>
            <Input
              value={heroContent.logo_url}
              onChange={(e) => setHeroContent({ ...heroContent, logo_url: e.target.value })}
              placeholder="https://..."
            />
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

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
