"use client"

import { useEffect, useState } from "react"

export default function CookieBanner() {
  const [consentStatus, setConsentStatus] = useState(null)

  useEffect(() => {
    const savedConsent = document.cookie.match(/cookie_preference=([^;]+)/);
    if (savedConsent) {
      setConsentStatus(savedConsent[1]);
    } else {
      setConsentStatus("unselected");
    }
  }, [])

  const handleConsent = async (choice) => {
    document.cookie = `cookie_preference=${choice}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
    setConsentStatus(choice);

    // Analysis Hack for Vercel Hobby Plan
    const url = new URL(window.location.href);
    url.searchParams.set('consent', choice);
    window.history.pushState({}, '', url);

    if (choice === "accepted") {
      try {
        const { inject } = await import("@vercel/analytics");
        inject();
      } catch (e) { console.warn("Analytics blocked"); }
    }
  }

  if (consentStatus === null || consentStatus === "accepted" || consentStatus === "rejected") {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-[100] animate-in fade-in slide-in-from-bottom-10 duration-700">
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gray-950/80 backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 h-48 w-48 bg-blue-500/10 blur-[100px]" />
        
        <div className="relative z-10 flex-1">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <span>🍪</span> Cookie Preferences
          </h3>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">
            We use cookies to analyze site traffic and improve your experience. 
            Choose <span className="text-white italic">"Accept All"</span> to help us grow, or <span className="text-white italic">"Reject"</span> to keep things essential.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => handleConsent("rejected")}
            className="flex-1 md:flex-none text-gray-400 hover:text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all hover:bg-white/5 active:scale-95"
          >
            Reject All
          </button>
          <button
            onClick={() => handleConsent("accepted")}
            className="flex-1 md:flex-none bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-bold py-2.5 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  )
}