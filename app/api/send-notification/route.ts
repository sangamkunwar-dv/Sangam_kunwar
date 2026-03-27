// app/api/send-notification/route.ts
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Parse the request body
    const body = await request.json()
    const { name, email, subject, message } = body

    // 2️⃣ Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Missing required fields (name, email, subject, message)" },
        { status: 400 }
      )
    }

    // 3️⃣ Environment variables
    const adminEmail = process.env.ADMIN_EMAIL || "sangamkunwar48@gmail.com"
    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    if (!resendApiKey) {
      console.error("[sangamkunwar] RESEND_API_KEY not set in environment")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    console.log("[sangamkunwar] Sending dashboard message to:", adminEmail)

    // 4️⃣ Send email via Resend
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        subject: `Dashboard Message: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #333;">New Dashboard Message</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <div style="white-space: pre-wrap; color: #555;">${message}</div>
          </div>
        `,
      }),
    })

    // 5️⃣ Check Resend response
    if (!response.ok) {
      const errorText = await response.text()
      console.error("[sangamkunwar] Resend API error:", errorText)
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
    }

    // ✅ Success
    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error("[sangamkunwar] Notification API unexpected error:", err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}