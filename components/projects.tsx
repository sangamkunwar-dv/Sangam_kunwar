"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

export default function Projects() {
  const [dbProjects, setDbProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getProjects() {
      try {
        const res = await fetch("/api/projects", { cache: 'no-store' })
        const data = await res.json()
        setDbProjects(data)
      } catch (error) {
        console.error("Failed to load projects", error)
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
          {/* Now mapping over data FROM THE DATABASE */}
          {dbProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden group cursor-pointer">
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-xl group-hover:text-primary">
                      {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <ArrowUpRight className="text-primary" size={20} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}