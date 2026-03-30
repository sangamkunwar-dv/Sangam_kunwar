"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home, Menu } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* 1. THE NAVBAR - Added for consistency */}
      <nav className="w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tighter hover:opacity-80 transition-opacity">
            SANGAM<span className="text-primary">.</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-primary transition-colors">Projects</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          </div>

          <Button variant="outline" size="sm" className="md:hidden">
            <Menu size={18} />
          </Button>
        </div>
      </nav>

      {/* 2. THE 404 CONTENT SECTION */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* RIGHT SIDE: Professional Illustration */}
          <div className="relative w-full flex justify-center order-1 md:order-2">
            <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
            <Image 
              src="/404-scene.svg" 
              alt="404 Illustration"
              width={600}
              height={450}
              className="w-full max-w-lg h-auto drop-shadow-2xl select-none"
              priority 
            />
          </div>

          {/* LEFT SIDE: Text & Perfect Button */}
          <div className="text-center md:text-left space-y-8 order-2 md:order-1">
            <div className="space-y-2">
              <h2 className="text-primary font-mono font-bold tracking-widest text-sm uppercase">Error 404</h2>
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight text-foreground leading-[1.1]">
                Lost in <br className="hidden sm:inline"/> Cyberspace?
              </h1>
            </div>

            <p className="text-muted-foreground text-lg sm:text-xl max-w-md mx-auto md:mx-0 leading-relaxed">
              The page you are looking for has vanished into the digital void. Let's get you back on track.
            </p>

            {/* THE "PERFECT" BUTTON */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              <Button asChild size="lg" className="rounded-full px-8 py-7 text-lg font-semibold shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-r from-primary to-blue-600 gap-2">
                <Link href="/">
                  <Home size={20} />
                  Back to Home
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-7 text-lg font-semibold border-2 hover:bg-secondary transition-all duration-300 gap-2">
                <button onClick={() => window.history.back()}>
                  <ArrowLeft size={20} />
                  Previous Page
                </button>
              </Button>
            </div>
          </div>

        </div>
      </main>

      {/* FOOTER - Subtle copyright */}
      <footer className="py-6 text-center text-sm text-muted-foreground border-t border-border/40">
        &copy; {new Date().getFullYear()} Sangam Kunwar. All rights reserved.
      </footer>
    </div>
  )
}