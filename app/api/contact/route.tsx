import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const resendKey = process.env.RESEND_API_KEY
    
    if (!url || !supabaseKey || !resendKey) {
      console.error("[Config Error] Environment variables are missing.")
      return NextResponse.json({ error: "Server configuration missing" }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const { name, email, subject, message } = body

    // 1. Save to Supabase (Contact Table)
    const supabase = createClient(url, supabaseKey)
    const { error: dbError } = await supabase
      .from("contact")
      .insert([{ name, email, subject, message, status: "new" }])

    if (dbError) {
      console.error("[DB Error]:", dbError.message)
      // We continue so the email might still send even if DB fails
    }

    // 2. Send Email from your OWN verified domain
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        // UPDATED: Now using your professional verified email
        from: `Portfolio <info@sangamkunwar.com.np>`, 
        to: "sangamkunwar48@gmail.com",
        reply_to: email, // This lets you click "Reply" in Gmail to email them back directly
        subject: `New Message: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #eee; border-radius: 12px; background-color: #fff;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px;">New Inquiry from Portfolio</h2>
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Subject:</strong> ${subject}</p>
            <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px; color: #374151; white-space: pre-wrap;">
              ${message}
            </div>
            <footer style="margin-top: 20px; font-size: 12px; color: #9ca3af; text-align: center;">
              Sent via sangamkunwar.com.np
            </footer>
          </div>
        `,
      }),
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.json()
      console.error("[Resend Error]:", emailError)
      return NextResponse.json({ error: "Email failed to send" }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("[API Crash]:", error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}