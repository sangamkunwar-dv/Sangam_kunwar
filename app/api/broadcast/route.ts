import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const { title, content, url } = await request.json()
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const resendApiKey = process.env.RESEND_API_KEY

    if (!supabaseUrl || !supabaseServiceKey || !resendApiKey) {
      return NextResponse.json({ error: "Server configuration missing" }, { status: 500 })
    }

    // 1. Initialize Supabase Admin
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // 2. Fetch all user emails from 'profiles' table
    const { data: profiles, error: dbError } = await supabase
      .from("profiles")
      .select("email")

    if (dbError) throw new Error(`Database Error: ${dbError.message}`)
    
    const emailList = profiles?.map(p => p.email).filter(Boolean) || []

    if (emailList.length === 0) {
      return NextResponse.json({ error: "No users found in database" }, { status: 404 })
    }

    // 3. Send Batch via Resend
    // Resend Batch limit is 100 per call. If you have >100 users, 
    // you would need a loop, but for now, this works for 100.
    const resendResponse = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        emailList.map(targetEmail => ({
          from: "Sangam Kunwar <info@sangamkunwar.com.np>",
          to: targetEmail,
          subject: `New Update: ${title}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 12px;">
              <h2 style="color: #2563eb;">${title}</h2>
              <p style="color: #333; line-height: 1.5;">${content}</p>
              <div style="margin-top: 25px;">
                <a href="${url}" style="background-color: #2563eb; color: white; padding: 12px 20px; border-radius: 6px; text-decoration: none; font-weight: bold;">Check it out</a>
              </div>
              <footer style="margin-top: 30px; font-size: 11px; color: #999;">
                Sent from sangamkunwar.com.np Portfolio.
              </footer>
            </div>
          `,
        }))
      ),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json()
      console.error("Resend Batch Error:", errorData)
      throw new Error("Failed to send emails via Resend")
    }

    return NextResponse.json({ success: true, sentTo: emailList.length })

  } catch (error: any) {
    console.error("Broadcast API Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}