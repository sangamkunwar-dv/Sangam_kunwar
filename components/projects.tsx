"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

export default function Projects() {
  // Initialize as empty array
  const [dbProjects, setDbProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProjects() {
      try {
        const res = await fetch("/api/projects", { cache: 'no-store' })
        const data = await res.json()
        
        // 🔥 FIX: Ensure data is an array before setting state
        if (Array.isArray(data)) {
          setDbProjects(data)
        } else {
          console.error("API Error: Expected array but got:", data)
          setDbProjects([]) 
        }
      } catch (error) {
        console.error("Failed to load projects", error)
        setDbProjects([])
      } finally {
        setLoading(false)
      }
    }
    getProjects()
  }, [])

  if (loading) return <div className="py-20 text-center">Loading Projects...</div>

  return (
    <section id="projects" className="py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4">
        <div className="space-y-4 mb-12">
          <p className="text-sm font-semibold text-primary uppercase">Featured Work</p>
          <h2 className="text-3xl sm:text-5xl font-bold">Recent Projects</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Check length to show a fallback if no projects exist */}
          {dbProjects.length > 0 ? (
            dbProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden group cursor-pointer transition-all hover:border-primary/50">
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <ArrowUpRight className="text-primary group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" size={20} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {/* Safety check on tags array */}
                    {Array.isArray(project.tags) && project.tags.map((tag: string) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-2 text-center text-muted-foreground py-10">
              No projects found in the database.
            </div>
          )}
        </div>
      </div>
    </section>
  )
}