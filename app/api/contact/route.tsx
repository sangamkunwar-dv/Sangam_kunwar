import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Store messages in memory (for demo - use database in production)
let messages: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Store message with consistent timestamp field
    const newMessage = {
      id: Date.now().toString(),
      name,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      read: false,
    }

    messages.push(newMessage)

    // Initialize Supabase client inside the handler to avoid build crashes
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (supabaseUrl && supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
      const { error: dbError } = await supabaseAdmin
        .from("messages")
        .insert([{ name, email, subject, message, status: "pending" }])

      if (dbError) {
        console.error("[v0] Supabase insert error:", dbError)
      }
    } else {
      console.warn("[v0] Supabase credentials missing. Skipping database insert.")
    }

    const adminEmail = process.env.ADMIN_EMAIL || "sangamkunwar48@gmail.com"
    const resendApiKey = process.env.RESEND_API_KEY
    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    if (resendApiKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: adminEmail,
            subject: `New Contact: ${subject}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">New Contact Form Submission</h2>
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <h3 style="color: #333;">Message:</h3>
                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
                  ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </div>
                
                <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                <p style="color: #999; font-size: 12px;">
                  Submitted at: ${new Date().toLocaleString()}
                </p>
              </div>
            `,
          }),
        })

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] Resend error:", errorText)
        } else {
          console.log("[v0] Email sent successfully to", adminEmail)
        }
      } catch (emailError) {
        console.error("[v0] Email sending failed:", emailError)
        // Don't fail the request if email fails
      }
    } else {
      console.warn("[v0] RESEND_API_KEY not configured. Email not sent.")
    }

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully",
        id: newMessage.id,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Contact API error:", error)
    return NextResponse.json({ error: "Failed to process message" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ messages })
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Message ID required" }, { status: 400 })
    }

    messages = messages.filter((msg) => msg.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 })
  }
}
