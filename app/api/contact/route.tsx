import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const resendKey = process.env.RESEND_API_KEY // Ensure this is in Vercel
    
    // 1. Check all configurations
    if (!url || !supabaseKey || !resendKey) {
      console.error("Missing configuration:", { url: !!url, supabase: !!supabaseKey, resend: !!resendKey })
      return NextResponse.json({ error: "Server configuration missing" }, { status: 500 })
    }

    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const supabase = createClient(url, supabaseKey)

    // 2. Insert into 'contact' table
    const { error: dbError } = await supabase
      .from("contact")
      .insert([{ name, email, subject, message, status: "new" }])

    if (dbError) throw new Error(`Database Error: ${dbError.message}`)

    // 3. Send Email via Resend
    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: "sangamkunwar48@gmail.com",
        subject: `New Portfolio Message: ${subject}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #333;">New Message from ${name}</h2>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="white-space: pre-wrap; color: #555;">${message}</p>
          </div>
        `,
      }),
    })

    if (!emailRes.ok) {
      const emailError = await emailRes.json()
      console.error("Resend Error:", emailError)
      // We don't "throw" here because the data is already in the DB, 
      // but we log it for you to see.
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Contact API Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}