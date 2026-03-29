import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Use helper to ensure client is always ready
const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY // Ensure this is in Vercel/Env
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // 1. Database Insert
    if (!supabaseAdmin) {
      console.error("Supabase Admin Client not initialized. Check ENV variables.")
    } else {
      const { error: dbError } = await supabaseAdmin
        .from("messages")
        .insert([{ name, email, subject, message, status: "unread" }])

      if (dbError) throw new Error(`Database Error: ${dbError.message}`)
    }

    // 2. Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: process.env.ADMIN_EMAIL || "sangamkunwar48@gmail.com",
          subject: `Portfolio Contact: ${subject}`,
          html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
        }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contact API Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}