import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: NextRequest) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!url || !key) {
      return NextResponse.json({ error: "Server configuration missing" }, { status: 500 })
    }

    const supabase = createClient(url, key)
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Insert into 'contact' table
    const { error: dbError } = await supabase
      .from("contact")
      .insert([{ name, email, subject, message, status: "new" }])

    if (dbError) throw new Error(dbError.message)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("API Error:", error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}