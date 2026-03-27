"use client"

import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uhunxhnvvadynrfbsowp.supabase.co"
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVodW54aG52dmFkeW5yZmJzb3dwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA4MjQ4MzksImV4cCI6MjA3NjQwMDgzOX0._-PUTbuGWF43nTZYOotl3zCem9S_vLVJe2lg0mRtx1E"

  if (!url || !key) {
    console.error("[v0] Supabase URL or Key is missing")
  } else {
    console.log("[v0] Initializing Supabase client with URL:", url)
  }

  return createBrowserClient(url, key)
}
