"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import AdminSidebar from "@/components/admin/sidebar"
import ProjectsManager from "@/components/admin/projects-manager"
import SkillsManager from "@/components/admin/skills-manager"
import EventsManager from "@/components/admin/events-manager"
import CollaboratorsManager from "@/components/admin/collaborators-manager"
import DashboardOverview from "@/components/admin/dashboard-overview"
import MessagesManager from "@/components/admin/messages-manager"
import AdminSettings from "@/components/admin/admin-settings"
import HeroSettings from "@/components/admin/hero-settings"
import BroadcastForm from "@/components/ui/broadcast-form" 
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { Menu } from "lucide-react" // Added for mobile toggle

type AdminTab =
  | "overview"
  | "hero"
  | "projects"
  | "skills"
  | "events"
  | "collaborators"
  | "messages"
  | "Broadcast"
  | "settings"

const ADMIN_EMAIL = "sangamkunwar48@gmail.com"

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMobileOpen, setIsMobileOpen] = useState(false) // State for responsive sidebar

  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        if (session) {
          if (session.user.email === ADMIN_EMAIL) {
            setUser(session.user)
          } else {
            toast({
              title: "Access Denied",
              description: "This area is strictly for Sangam Kunwar.",
              variant: "destructive",
            })
            router.push("/")
          }
        } else {
          router.push("/auth/login?redirect=/admin")
        }
      } catch (err) {
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
      <div className="min-h-screen flex flex-col items-center justify-center p-8 space-y-4 bg-background">
        <Skeleton className="h-12 w-12 rounded-full" />
        <Skeleton className="h-4 w-[250px]" />
      </div>
    )
  }

  if (!user || user.email !== ADMIN_EMAIL) return null

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Responsive Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile Header: Only visible on mobile/tablet */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="p-2 -ml-2 hover:bg-muted rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
          <span className="font-bold text-sm tracking-tight">Admin Panel</span>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {activeTab === "overview" && <DashboardOverview />}
            {activeTab === "hero" && <HeroSettings />}
            {activeTab === "projects" && <ProjectsManager />}
            {activeTab === "skills" && <SkillsManager />}
            {activeTab === "events" && <EventsManager />}
            {activeTab === "collaborators" && <CollaboratorsManager />}
            {activeTab === "messages" && <MessagesManager />}
            
            {activeTab === "Broadcast" && (
              <div className="max-w-4xl">
                <div className="mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Email Broadcast</h1>
                  <p className="text-muted-foreground mt-1 text-sm md:text-base">
                    Send an email announcement to all registered users.
                  </p>
                </div>
                <BroadcastForm />
              </div>
            )}

            {activeTab === "settings" && (
              <AdminSettings userEmail={user.email} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}