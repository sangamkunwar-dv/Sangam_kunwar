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
  Globe,
  X // Added X to close mobile menu
} from "lucide-react"
import Link from "next/link"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: any) => void
  onLogout: () => void
  isMobileOpen: boolean // Added to track mobile state
  setIsMobileOpen: (open: boolean) => void // Added to toggle mobile state
}

export default function AdminSidebar({ 
  activeTab, 
  setActiveTab, 
  onLogout, 
  isMobileOpen, 
  setIsMobileOpen 
}: AdminSidebarProps) {
  
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

  // Helper to close sidebar when a link is clicked on mobile
  const handleTabChange = (id: string) => {
    setActiveTab(id);
    setIsMobileOpen(false);
  }

  return (
    <>
      {/* 1. Mobile Overlay (Blur/Dark background) */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 2. Sidebar Container */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col h-full transition-transform duration-300 ease-in-out
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 md:static md:flex
      `}>
        
        {/* Top Section */}
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground leading-none">Admin Panel</h2>
              <p className="text-xs text-muted-foreground mt-1">Sangam Kunwar</p>
            </div>
            {/* Close button for mobile only */}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1 hover:bg-secondary rounded-md"
            >
              <X size={20} />
            </button>
          </div>

          <Link 
            href="/" 
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-md transition-all border border-border w-full justify-center shadow-sm"
          >
            <Globe size={14} />
            View Website
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  activeTab === item.id 
                    ? "bg-primary text-primary-foreground shadow-md" 
                    : "text-foreground hover:bg-secondary"
                }`}
              >
                <Icon size={18} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-border">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-muted transition-colors text-sm"
          >
            <LogOut size={18} className="text-muted-foreground" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}