"use client"

import { useEffect, useState } from "react"

export default function InstallButton() {
  const [prompt, setPrompt] = useState<any>(null)

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault()
      setPrompt(e)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const installApp = async () => {
    if (!prompt) return
    prompt.prompt()
  }

  if (!prompt) return null

  return (
    <button
      onClick={installApp}
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        padding: "12px 20px",
        background: "#7b3fe4",
        color: "white",
        borderRadius: "10px",
        border: "none",
        cursor: "pointer",
      }}
    >
      Install App
    </button>
  )
}