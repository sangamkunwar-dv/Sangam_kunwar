"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HeroSettings() {
  const [heroContent, setHeroContent] = useState({
    title: "I'm Sangam Kunwar",
    subtitle: "Full-Stack Developer & Designer",
    description: "I'm passionate about building beautiful, functional web applications.",
    photo_url:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sangamkunwar-photo-GXq7pe8eUe2K2gZjVFHR0dsmMu91d4.jpg",
    logo_url: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("hero_content")
    if (saved) {
      setHeroContent(JSON.parse(saved))
    }
  }, [])

  const handleSave = async () => {
    setLoading(true)
    try {
      localStorage.setItem("hero_content", JSON.stringify(heroContent))
      setMessage("Hero content updated successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (error) {
      setMessage("Error updating hero content")
    } finally {
      setLoading(false)
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
              className={`p-3 rounded-lg text-sm ${message.includes("Error") ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-600"}`}
            >
              {message}
            </div>
          )}

          <Button onClick={handleSave} disabled={loading} className="w-full">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
