"use client"

import { useEffect, useState } from "react"

export default function CookieBanner() {
  // Use 'null' to indicate we haven't checked localStorage yet (prevents flickering)
  const [consentStatus, setConsentStatus] = useState(null)

  useEffect(() => {
    // Check for existing preference in cookies or localStorage
    const savedConsent = document.cookie.match(/cookie_preference=([^;]+)/);
    if (savedConsent) {
      setConsentStatus(savedConsent[1]);
    } else {
      setConsentStatus("unselected");
    }
  }, [])

  const handleConsent = async (choice) => {
    // 1. Save Choice (30 days)
    document.cookie = `cookie_preference=${choice}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    setConsentStatus(choice);

    // 2. Analysis Logic
    try {
      const analytics = await import("@vercel/analytics")
      
      // Always log the interaction for your internal "Analysis"
      // This tells you: "How many people are clicking Reject vs Accept?"
      if (typeof analytics.track === "function") {
        analytics.track("cookie_interaction", {
          selection: choice, // 'accepted' or 'rejected'
          timestamp: new Date().toISOString(),
        })
      }

      // 3. Conditional Injection
      if (choice === "accepted" && typeof analytics.inject === "function") {
        analytics.inject()
        console.log("Full analytics injected.");
      } else {
        console.log("Non-essential cookies rejected. Analytics not injected.");
      }
    } catch (error) {
      console.warn("Analytics module failed to load:", error);
    }
  }

  // Don't render if they already chose or while we are checking (null)
  if (consentStatus === null || consentStatus === "accepted" || consentStatus === "rejected") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-gray-900 text-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-3 z-50 animate-fadeIn border border-gray-700">
      <div className="flex flex-col gap-1">
        <span className="text-sm md:text-base font-semibold">Cookie Settings</span>
        <span className="text-xs md:text-sm text-gray-400">
          We use cookies to analyze traffic. You can choose to accept all or only essential cookies.
        </span>
      </div>
      
      <div className="flex gap-2 w-full md:w-auto">
        <button
          onClick={() => handleConsent("rejected")}
          className="flex-1 md:flex-none border border-gray-600 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-md transition duration-300"
        >
          Reject All
        </button>
        <button
          onClick={() => handleConsent("accepted")}
          className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md shadow transition duration-300"
        >
          Accept All
        </button>
      </div>
    </div>
  )
}