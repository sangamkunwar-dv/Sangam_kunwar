import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// 1. Initialize Supabase outside the handler if possible, or inside with a check
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey) 
  : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 2. Database Insert (Supabase)
    if (supabaseAdmin) {
      const { error: dbError } = await supabaseAdmin
        .from("messages")
        .insert([{ 
          name, 
          email, 
          subject, 
          message, 
          status: "unread", // Changed from pending to unread
          created_at: new Date().toISOString() 
        }])

      if (dbError) console.error("Supabase Error:", dbError.message)
    }

    // 3. Email Notification (Resend)
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
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
            html: `
              <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                <h2>New Message from ${name}</h2>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="background: #f9f9f9; padding: 10px; border-radius: 4px;">
                  ${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}
                </div>
              </div>
            `,
          }),
        })
      } catch (err) {
        console.error("Email failed but database was updated.")
      }
    }

    return NextResponse.json({ success: true, message: "Message processed" }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 })
  }
}

// 4. Fetching from Supabase instead of memory
export async function GET() {
  if (!supabaseAdmin) return NextResponse.json({ messages: [] })
  
  const { data, error } = await supabaseAdmin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ messages: data })
}

// 5. Deleting from Supabase instead of memory
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")

  if (!id || !supabaseAdmin) return NextResponse.json({ error: "Invalid Request" }, { status: 400 })

  const { error } = await supabaseAdmin.from("messages").delete().eq("id", id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}