import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })

    const { name, email, subject, message } = body

    // 1. Log configs (Privately) to your Vercel Logs to verify they exist
    const adminEmail = process.env.ADMIN_EMAIL || "sangamkunwar48@gmail.com"
    const resendApiKey = process.env.RESEND_API_KEY
    // Since you verified the domain, use the professional email directly
    const fromEmail = "Sangam  Kunwar <info@sangamkunwar.com.np>"

    if (!resendApiKey) {
      console.error("[sangamkunwar] ERROR: RESEND_API_KEY is missing from Vercel Env Variables.")
      return NextResponse.json({ error: "Email configuration missing" }, { status: 500 })
    }

    // 2. Fetch call with better error capture
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: adminEmail,
        reply_to: email, // This allows you to reply directly to the sender
        subject: `Portfolio Inquiry: ${subject}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
            <h2 style="color: #2563eb;">New Message Received</h2>
            <p><strong>From:</strong> ${name} (${email})</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <div style="white-space: pre-wrap;">${message}</div>
          </div>
        `,
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      // THIS IS THE MOST IMPORTANT PART:
      // It logs the EXACT error from Resend (e.g., "Domain not verified" or "Invalid API Key")
      console.error("[sangamkunwar] Resend API Error Response:", result)
      return NextResponse.json({ error: result.message || "Resend failed" }, { status: response.status })
    }

    console.log("[sangamkunwar] Email sent successfully to:", adminEmail)
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error("[sangamkunwar] API Crash:", error.message)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}