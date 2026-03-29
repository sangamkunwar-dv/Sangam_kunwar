import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// ⚡ Ensure this matches your frontend fields (tags and image)
function formatProject(body: any) {
  return {
    title: body.title,
    description: body.description,
    image: body.image, // Ensure this matches your DB column
    // Convert string tags to array if needed
    tags: Array.isArray(body.tags)
      ? body.tags
      : body.tags
      ? body.tags.split(",").map((t: string) => t.trim())
      : [],
    updated_at: new Date().toISOString(),
  }
}

// GET
export async function GET() {
  try {
    const supabase = await createClient() // Added await

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

// POST
export async function POST(request: Request) {
  try {
    const supabase = await createClient() // Added await
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

// PUT
export async function PUT(request: Request) {
  try {
    const supabase = await createClient() // Added await
    const body = await request.json()

    if (!body.id) throw new Error("ID required")
    const formattedBody = formatProject(body)

    const { data, error } = await supabase
      .from("projects")
      .update(formattedBody)
      .eq("id", body.id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("Projects PUT Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient() // Added await
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) throw new Error("ID required")

    // 🔥 FIXED: removed the extra 'a' from 'supabasea'
    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Projects DELETE Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}