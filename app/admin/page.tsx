"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AdminSidebar from "@/components/admin/sidebar"
import ProjectsManager from "@/components/admin/projects-manager"
import EventsManager from "@/components/admin/events-manager"
import CollaboratorsManager from "@/components/admin/collaborators-manager"
import DashboardOverview from "@/components/admin/dashboard-overview"
import MessagesManager from "@/components/admin/messages-manager"
import AdminSettings from "@/components/admin/admin-settings"
import HeroSettings from "@/components/admin/hero-settings"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

type AdminTab = "overview" | "hero" | "projects" | "events" | "collaborators" | "messages" | "settings"

const ADMIN_EMAIL = "sangamkunwar48@gmail.com"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("[v0] Checking admin authentication...")
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          console.log("[v0] Session found:", session.user.email)
          if (session.user.email === ADMIN_EMAIL) {
            console.log("[v0] Admin access granted")
            setUser(session.user)
          } else {
            console.warn("[v0] Unauthorized access attempt by:", session.user.email)
            toast({
              title: "Access Denied",
              description: "This area is strictly for the administrator.",
              variant: "destructive",
            })
            window.location.href = "/"
          }
        } else {
          console.log("[v0] No session found, redirecting to login")
          window.location.href = "/auth/login?redirect=/admin"
        }
      } catch (err) {
        console.error("[v0] Admin auth check failed:", err)
        router.push("/auth/login")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase, toast])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "hero" && <HeroSettings />}
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "events" && <EventsManager />}
          {activeTab === "collaborators" && <CollaboratorsManager />}
          {activeTab === "messages" && <MessagesManager />}
          {activeTab === "settings" && <AdminSettings userEmail={user.email} />}
        </div>
      </main>
    </div>
  )
}
