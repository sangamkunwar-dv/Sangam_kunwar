"use client"

import { LayoutDashboard, FileText, Calendar, Users, Mail, LogOut, Settings, ImageIcon } from "lucide-react"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: any) => void
  onLogout: () => void
}

export default function AdminSidebar({ activeTab, setActiveTab, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "hero", label: "Hero Section", icon: ImageIcon },
    { id: "projects", label: "Projects", icon: FileText },
    { id: "events", label: "Events", icon: Calendar },
    { id: "collaborators", label: "Collaborators", icon: Users },
    { id: "messages", label: "Messages", icon: Mail },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
        <p className="text-sm text-muted-foreground">Sangam Kunwar</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-secondary transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}
