"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

interface AdminSettingsProps {
  userEmail?: string
}

export default function AdminSettings({ userEmail }: AdminSettingsProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [loading, setLoading] = useState(false)

  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in all password fields")
      setMessageType("error")
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match")
      setMessageType("error")
      return
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters")
      setMessageType("error")
      return
    }

    setLoading(true)
    try {
      localStorage.setItem("admin_password", newPassword)
      setMessage("Password updated successfully!")
      setMessageType("success")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => setMessage(""), 3000)
    } catch (error: any) {
      setMessage(error.message || "Error updating password")
      setMessageType("error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
        <p className="text-muted-foreground">Manage your admin account and email configuration</p>
      </div>

      <div className="grid gap-6">
        {/* Admin Account */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input
                type="email"
                value={userEmail || ""}
                disabled
                className="w-full px-4 py-2 rounded-lg border border-border bg-muted text-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-1">Your admin email</p>
            </div>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Confirm password"
              />
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  messageType === "success"
                    ? "bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400"
                    : "bg-destructive/10 border border-destructive/20 text-destructive"
                }`}
              >
                {message}
              </div>
            )}

            <button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </CardContent>
        </Card>

        {/* Email Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Email Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted/50 p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium text-foreground">Contact Form Recipient:</p>
              <p className="text-lg font-semibold text-primary">{userEmail || "sangamkunwae48@gmail.com"}</p>
              <p className="text-xs text-muted-foreground mt-2">
                All contact form submissions will be sent to this email address.
              </p>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
              <p className="text-sm text-blue-700 dark:text-blue-400">
                <strong>Note:</strong> Email notifications are configured to send via Resend. Make sure your Resend API
                key is set in environment variables.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Admin Panel Version</span>
              <span className="text-sm font-medium text-foreground">2.0.0</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Storage</span>
              <span className="text-sm font-medium text-foreground">Local</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm font-medium text-foreground">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-muted-foreground">Status</span>
              <span className="text-sm font-medium text-green-600">Active</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
