import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// GET
export async function GET() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("skills")
      .select("*")
      .order("level", { ascending: false })

    if (error) {
      console.error("Supabase GET error:", error)
      throw new Error(error.message)
    }

    return NextResponse.json(data ?? [])
  } catch (error: any) {
    console.error("Skills GET:", error)

    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      { status: 500 }
    )
  }
}

// POST
export async function POST(request: Request) {
  try {
    const supabase = createClient()

    const body = await request.json()

    // ✅ validation (VERY IMPORTANT)
    if (!body?.name || body?.level === undefined) {
      return NextResponse.json(
        { error: "Name and level are required" },
        { status: 400 }
      )
    }

    const newSkill = {
      name: body.name,
      level: Number(body.level),
      category: body.category || null,
    }

    const { data, error } = await supabase
      .from("skills")
      .insert([newSkill])
      .select()
      .single()

    if (error) {
      console.error("Supabase POST error:", error)
      throw new Error(error.message)
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("Skills POST:", error)

    return NextResponse.json(
      {
        error: error?.message || "Internal Server Error",
      },
      { status: 500 }
    )
  }
}