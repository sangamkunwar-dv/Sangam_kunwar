"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

// Accept initialData as a prop
export default function Hero({ initialData }: { initialData: any }) {
  // Use the passed data, or fall back to defaults if the DB is empty
  const data = initialData;

  return (
    <section id="about" className="relative overflow-hidden py-20 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 relative">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-primary uppercase">
                {data?.welcome_text || "Welcome to my portfolio"}
              </p>
              <h1 className="text-4xl sm:text-6xl font-bold">
                {data?.name || "I'm Sangam Kunwar"}
              </h1>
              <p className="text-xl text-primary font-semibold">
                {data?.role || "Full-Stack Developer"}
              </p>
            </div>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {data?.description || "I'm passionate about building beautiful, functional web applications."}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t">
              <div>
                <p className="text-2xl font-bold text-primary">{data?.projects_count || "15+"}</p>
                <p className="text-xs text-muted-foreground">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-primary">{data?.experience_years || "2+"}</p>
                <p className="text-xs text-muted-foreground">Years</p>
              </div>
            </div>
          </div>

          <div className="relative h-96 rounded-2xl overflow-hidden border">
            <Image
              src={data?.image_url || "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sangamkunwar-photo-GXq7pe8eUe2K2gZjVFHR0dsmMu91d4.jpg"}
              alt="Sangam Kunwar"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}