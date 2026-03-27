import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ⚡ Tell Next.js this route is dynamic (always server-side)
export const dynamic = "force-dynamic";

// GET Hero
export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json(data || {});
  } catch (error: any) {
    console.error("Hero GET:", error);
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    );
  }
}

// UPDATE or INSERT Hero
export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    // Ensure updated_at exists
    body.updated_at = new Date().toISOString();

    // Fetch existing row
    const { data: existing, error: fetchError } = await supabase
      .from("hero_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing?.id) {
      // UPDATE existing row
      const { data, error } = await supabase
        .from("hero_settings")
        .update(body)
        .eq("id", existing.id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // INSERT new row
      const { data, error } = await supabase
        .from("hero_settings")
        .insert([body])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error: any) {
    console.error("Hero PUT:", error);
    return NextResponse.json(
      { error: error.message || String(error) },
      { status: 500 }
    );
  }
}