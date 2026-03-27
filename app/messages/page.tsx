"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 text-center space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Send Me a Message</h1>
          <p className="text-muted-foreground mt-2">Connect with Sangam Kunwar</p>
        </div>

        <p className="text-muted-foreground">Create an account or login to send messages and stay connected.</p>

        <div className="space-y-3">
          <Link href="/auth/signup" className="block">
            <Button className="w-full gap-2">
              Create Account
              <ArrowRight size={18} />
            </Button>
          </Link>
          <Link href="/auth/login" className="block">
            <Button variant="outline" className="w-full bg-transparent">
              Already have an account? Login
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
