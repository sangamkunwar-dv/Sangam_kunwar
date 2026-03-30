import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const getSupabaseAdmin = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY 
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(request: NextRequest) {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validate fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    // 1. Database Insert into 'contact' table
    if (!supabaseAdmin) {
      throw new Error("Supabase Admin Client not initialized. Check ENV variables.")
    }

    const { error: dbError } = await supabaseAdmin
      .from("contact") // Pointing to your new table
      .insert([{ 
        name, 
        email, 
        subject, 
        message, 
        status: "new" 
      }])

    if (dbError) throw new Error(`Database Error: ${dbError.message}`)

    // 2. Email via Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: process.env.ADMIN_EMAIL || "sangamkunwar48@gmail.com",
          subject: `New Contact: ${subject}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #2563eb;">New Message from Portfolio</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
              <p style="white-space: pre-wrap;">${message}</p>
            </div>
          `,
        }),
      })

      if (!emailRes.ok) {
        console.error("Resend Email failed to send, but data was saved to DB.")
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contact API Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}