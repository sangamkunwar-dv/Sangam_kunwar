"use client" 

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Hero() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // 1. Fetch the data from your API
  useEffect(() => {
    async function fetchHero() {
      try {
        const res = await fetch("/api/herosection", { cache: 'no-store' })
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Failed to load hero data", err)
      } finally {
        setLoading(false)
      }
    }
    fetchHero()
  }, [])

  // Show a simple skeleton or nothing while loading to prevent "flicker"
  if (loading) return <div className="py-20 h-[500px]" />

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 relative">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary uppercase tracking-wider">
                {data?.welcome_text || "Welcome to my portfolio"}
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance leading-tight">
                {data?.name || "I'm Sangam Kunwar"}
              </h1>
              <p className="text-xl text-primary font-semibold">
                {data?.role || "Full-Stack Developer & Designer"}
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
              {data?.description || "I'm passionate about building beautiful, functional web applications..."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button size="lg" className="gap-2 hover:shadow-lg transition-all duration-300">
                View My Work
                <ArrowRight size={18} />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="hover:shadow-lg transition-all duration-300 bg-transparent"
              >
                Get in Touch
              </Button>
            </div>

            {/* Stats - Now Dynamic */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
              <div className="group">
                <p className="text-2xl sm:text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {data?.projects_count || "15+"}
                </p>
                <p className="text-sm text-muted-foreground">Projects Completed</p>
              </div>
              <div className="group">
                <p className="text-2xl sm:text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {data?.experience_years || "2+"}
                </p>
                <p className="text-sm text-muted-foreground">Years Experience</p>
              </div>
              <div className="group">
                <p className="text-2xl sm:text-3xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                  {data?.clients_count || "10+"}
                </p>
                <p className="text-sm text-muted-foreground">Happy Clients</p>
              </div>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative h-96 sm:h-full min-h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 border border-border flex items-center justify-center group hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-right-4 duration-700 delay-200">
            <Image
              src={data?.image_url || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sangamkunwar-photo-GXq7pe8eUe2K2gZjVFHR0dsmMu91d4.jpg"}
              alt="Sangam Kunwar"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}