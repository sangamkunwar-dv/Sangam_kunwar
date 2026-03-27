"use client"

import { useEffect, useState } from "react"

export default function CookieBanner() {
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    // Check if cookie already exists
    if (document.cookie.includes("cookiesAccepted=true")) {
      setAccepted(true)
    }
  }, [])

  const acceptCookies = async () => {
    // ✅ Set cookie for 30 days
    document.cookie =
      "cookiesAccepted=true; path=/; max-age=" + 60 * 60 * 24 * 30

    setAccepted(true)

    // ✅ Dynamically import analytics safely (prevents build error)
    try {
      const analytics = await import("@vercel/analytics")

      // Use inject if available (v1.6.1 exports inject)
      if (typeof analytics.inject === "function") {
        analytics.inject()
      }

      // If future version supports event
      if (typeof analytics.event === "function") {
        analytics.event("cookie_accepted", {
          category: "engagement",
          label: "User accepted cookies",
        })
      }
    } catch (error) {
      console.warn("Analytics not available:", error)
    }
  }

  if (accepted) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 bg-gray-900 text-white rounded-lg shadow-lg p-4 md:p-6 flex flex-col md:flex-row justify-between items-center gap-3 z-50 animate-fadeIn">
      <span className="text-sm md:text-base">
        We use cookies to improve your experience on our website. By clicking
        "Accept", you consent to our use of cookies.
      </span>
      <button
        onClick={acceptCookies}
        className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md shadow transition duration-300"
      >
        Accept
      </button>
    </div>
  )
}
