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
// --- IMPORT YOUR NEW BROADCAST COMPONENT ---
import BroadcastForm from "@/components/ui/broadcast-form" 
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"

type AdminTab =
  | "overview"
  | "hero"
  | "projects"
  | "skills"
  | "events"
  | "collaborators"
  | "messages"
  | "Broadcast" // Note: This matches your type
  | "settings"

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
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          if (session.user.email === ADMIN_EMAIL) {
            setUser(session.user)
          } else {
            toast({
              title: "Access Denied",
              description: "This area is strictly for the administrator.",
              variant: "destructive",
            })
            window.location.href = "/"
          }
        } else {
          window.location.href = "/auth/login?redirect=/admin"
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
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {activeTab === "overview" && <DashboardOverview />}
          {activeTab === "hero" && <HeroSettings />}
          {activeTab === "projects" && <ProjectsManager />}
          {activeTab === "skills" && <SkillsManager />}
          {activeTab === "events" && <EventsManager />}
          {activeTab === "collaborators" && <CollaboratorsManager />}
          {activeTab === "messages" && <MessagesManager />}
          
          {/* --- ADD THE BROADCAST TAB CONTENT HERE --- */}
          {activeTab === "Broadcast" && (
            <div className="max-w-4xl mx-auto">
              <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Email Broadcast</h1>
                <p className="text-muted-foreground mt-1">
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
  )
}