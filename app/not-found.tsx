import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <main className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center bg-background px-6 py-12 md:py-24">
      {/* Container: Responsive Grid - matching reference layout */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* RIGHT SIDE: Illustration Section (Order 1 on mobile, Order 2 on desktop) */}
        <div className="relative w-full flex justify-center order-1 md:order-2">
          {/* Decorative gear shapes background (optional - for illustration style matching) */}
          <div className="absolute inset-0 opacity-10 flex items-center justify-center -z-10">
            <div className="w-96 h-96 rounded-full border-[20px] border-primary/20 border-dotted" />
            <div className="absolute top-10 left-10 w-24 h-24 rounded-full border-8 border-primary/20" />
          </div>
          
          {/* THE MAIN 404 ILLUSTRATION */}
          <Image 
            src="/404-scene.svg" // Make sure this file exists in /public
            alt="Page Not Found Illustration - People fixing 404 connection"
            width={700}
            height={500}
            className="w-full max-w-xl h-auto drop-shadow-sm select-none"
            priority // Load instantly
          />
        </div>

        {/* LEFT SIDE: Text Section (Order 2 on mobile, Order 1 on desktop) */}
        <div className="text-center md:text-left space-y-6 order-2 md:order-1">
          {/* Large Title - matching reference */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tighter text-foreground">
            Page <br className="hidden sm:inline"/> Not Found
          </h1>

          {/* Description Text - matching reference */}
          <p className="text-muted-foreground text-lg sm:text-xl max-w-md mx-auto md:mx-0 leading-relaxed">
            Oops! It seems the link is broken or the page has been moved. 
            Don't worry, we're working on connecting the dots. Try going back or starting fresh.
          </p>

          {/* Go Back Button - matching reference position and color */}
          <div className="pt-6">
            <Button asChild size="lg" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-10 py-7 text-lg rounded-full shadow-lg gap-2">
              <Link href="javascript:history.back()">
                <ArrowLeft size={18} />
                Go Back
              </Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}