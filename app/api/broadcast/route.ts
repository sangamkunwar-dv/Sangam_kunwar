import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { title, content, url } = await request.json()
    
    // Use Service Role Key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // 1. Fetch all emails from our profiles table
    const { data: users, error: dbError } = await supabase
      .from("profiles")
      .select("email")

    if (dbError) throw new Error(dbError.message)

    // 2. Filter valid emails
    const emailList = users?.map(u => u.email).filter(Boolean) || []

    if (emailList.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 404 })
    }

    // 3. Send via Resend Batch
    const resendApiKey = process.env.RESEND_API_KEY
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailList.map(toEmail => ({
        from: "Sangam Portfolio <info@sangamkunwar.com.np>",
        to: toEmail,
        subject: `Update: ${title}`,
        html: `
          <div style="font-family: sans-serif; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <h2 style="color: #2563eb;">${title}</h2>
            <p>${content}</p>
            <a href="${url}" style="background: #2563eb; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none;">View Update</a>
          </div>
        `
      })))
    })

    return NextResponse.json({ success: true, count: emailList.length })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}