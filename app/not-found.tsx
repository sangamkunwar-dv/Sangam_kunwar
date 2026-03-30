"use client"

import Link from "next/link"
import Image from "next/image"
// --- IMPORT YOUR ACTUAL NAVBAR COMPONENT ---
import Navbar from "@/components/header" 
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* 2. THE 404 CONTENT SECTION */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* RIGHT SIDE: Professional Illustration */}
          <div className="relative w-full flex justify-center order-1 md:order-2">
            {/* Soft glow behind the image */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[100px] -z-10 animate-pulse" />
            
            <Image 
              src="/404-scene.svg" 
              alt="404 Illustration"
              width={600}
              height={450}
              className="w-full max-w-lg h-auto drop-shadow-2xl select-none transition-transform duration-500 hover:scale-105"
              priority 
            />
          </div>

          {/* LEFT SIDE: Text & Perfect Button */}
          <div className="text-center md:text-left space-y-8 order-2 md:order-1">
            <div className="space-y-4">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-mono font-bold text-xs uppercase tracking-widest border border-primary/20">
                Error 404
              </div>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                Oops! You're <br className="hidden sm:inline"/> Out of Bounds.
              </h1>
            </div>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-md mx-auto md:mx-0 leading-relaxed">
              The page you are looking for has vanished into the digital void. Don't worry, we can get you back to safety.
            </p>

            {/* THE "PERFECT" BUTTONS */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button asChild size="lg" className="rounded-full px-8 py-7 text-lg font-semibold shadow-2xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 bg-primary text-primary-foreground gap-2">
                <Link href="/">
                  <Home size={20} />
                  Return Home
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 py-7 text-lg font-semibold border-2 hover:bg-secondary transition-all duration-300 gap-2"
                onClick={() => window.history.back()}
              >
                <ArrowLeft size={20} />
                Go Back
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER - Subtle copyright */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border/40">
        <p>&copy; {new Date().getFullYear()} Sangam Kunwar. All rights reserved.</p>
      </footer>
    </div>
  )
}