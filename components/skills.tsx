import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const skillCategories = [
  {
    category: "Frontend",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "Svelte"],
  },
  {
    category: "Backend",
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Firebase", "GraphQL"],
  },
  {
    category: "Tools & Platforms",
    skills: ["Git", "Docker", "AWS", "Vercel", "GitHub", "Figma"],
  },
  {
    category: "Soft Skills",
    skills: ["Problem Solving", "Communication", "Team Leadership", "Project Management", "Mentoring"],
  },
]

export default function Skills() {
  return (
    <section id="skills" className="py-20 sm:py-32 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Expertise</p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-balance">Skills & Technologies</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {skillCategories.map((category, index) => (
            <Card
              key={category.category}
              className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <CardTitle className="text-primary">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium hover:bg-primary/20 hover:scale-105 transition-all duration-300 cursor-default"
                    >
                      {skill}
                    </span>
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
