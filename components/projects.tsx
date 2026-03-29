import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce solution with real-time inventory management and payment processing.",
    tags: ["Next.js", "TypeScript", "Stripe", "PostgreSQL"],
    image: "/ecommerce-dashboard.png",
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Collaborative task management tool with real-time updates and team collaboration features.",
    tags: ["React", "Firebase", "Tailwind CSS", "WebSocket"],
    image: "/task-management-app.png",
  },
  {
    id: 3,
    title: "Analytics Dashboard",
    description: "Data visualization dashboard with interactive charts and real-time analytics.",
    tags: ["Next.js", "Recharts", "Supabase", "TypeScript"],
    image: "/analytics-dashboard-charts.png",
  },
  {
    id: 4,
    title: "Social Media App",
    description: "Social networking platform with user profiles, messaging, and content sharing.",
    tags: ["React Native", "Node.js", "MongoDB", "Socket.io"],
    image: "/social-media-app-interface.png",
  },
]

export default function Projects() {
  return (
    <section id="projects" className="py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Featured Work</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Recent Projects</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Here are some of my recent projects showcasing my skills and experience in web development.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 group cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative h-48 overflow-hidden bg-muted">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <CardTitle className="text-xl group-hover:text-primary transition-colors duration-300">
                      {project.title}
                    </CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </div>
                  <ArrowUpRight
                    className="text-primary mt-1 flex-shrink-0 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
                    size={20}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="hover:bg-primary/20 transition-colors duration-300">
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
