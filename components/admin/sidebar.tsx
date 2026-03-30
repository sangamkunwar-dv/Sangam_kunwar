"use client"

import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Users, 
  Mail, 
  LogOut, 
  Settings, 
  ImageIcon, 
  Send,
  Globe // Added Globe icon for View Website
} from "lucide-react"
import Link from "next/link" // Added Link for navigation

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
    { id: "Broadcast", label: "Broadcast", icon: Send }, 
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
      {/* Top Section: Admin Title & View Website */}
      <div className="p-6 border-b border-border space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Admin Panel</h2>
          <p className="text-sm text-muted-foreground font-medium">Sangam Kunwar</p>
        </div>

        {/* View Website Button */}
        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-all border border-border w-full justify-center shadow-sm"
        >
          <Globe size={14} />
          View Website
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Logout Section: Fixed to remove red color */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors"
        >
          <LogOut size={20} className="text-muted-foreground" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  )
}