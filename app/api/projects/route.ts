import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// helper: format body safely
function formatProject(body: any) {
  return {
    title: body.title,
    description: body.description,
    image: body.image, 
    tags: Array.isArray(body.tags)
      ? body.tags
      : body.tags
      ? body.tags.split(",").map((t: string) => t.trim())
      : [],
    updated_at: new Date().toISOString(),
  }
}

export async function GET() {
  try {
    const supabase = await createClient() // Must be awaited

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Projects GET Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Ensure we are parsing JSON correctly
    const body = await request.json()
    const formattedBody = formatProject(body)

    const { data, error } = await supabase
      .from("projects")
      .insert([formattedBody])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("Projects POST Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ... Keep PUT and DELETE logic the same, just ensure 'await createClient()' is used.