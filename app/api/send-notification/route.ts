import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    const adminEmail = process.env.ADMIN_EMAIL || "sangamkunwar48@gmail.com"
    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    if (!resendApiKey) {
      console.warn("[v0] RESEND_API_KEY not configured. Notification not sent.")
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 })
    }

    console.log("[v0] Sending dashboard message notification to:", adminEmail)

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

    if (!response.ok) {
      const error = await response.text()
      console.error("[v0] Resend notification error:", error)
      return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Notification API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
