import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// helper: format body safely
function formatProject(body: any) {
  return {
    ...body,
    tech_stack: Array.isArray(body.tech_stack)
      ? body.tech_stack
      : body.tech_stack
      ? body.tech_stack.split(",").map((t: string) => t.trim())
      : [],
    updated_at: new Date().toISOString(),
  }
}

// GET
export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error("Projects GET:", error)
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    )
  }
}

// POST
export async function POST(request: Request) {
  try {
    const supabase = createClient()
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
    console.error("Projects POST:", error)
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    )
  }
}

// PUT
export async function PUT(request: Request) {
  try {
    const supabase = createClient()
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
    console.error("Projects PUT:", error)
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    )
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) throw new Error("ID required")

    const { error } = await supabase
      .from("projects")
      .delete()
      .eq("id", id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Projects DELETE:", error)
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    )
  }
}