import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Always server-side
export const dynamic = "force-dynamic";

// GET Hero
export async function GET() {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .limit(1)
      .maybeSingle(); // returns null if no row

    if (error) throw error;

    // If no row exists, return default values
    const defaultData = {
      title: "I'm Sangam Kunwar",
      subtitle: "Full-Stack Developer & Designer",
      description: "I'm passionate about building beautiful, functional web applications.",
      photo_url: "/sangamkunwarphoto.png",
      logo_url: "",
    };

    return NextResponse.json(data || defaultData);
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

    // Only include the allowed fields
    const heroData = {
      title: body.title || "",
      subtitle: body.subtitle || "",
      description: body.description || "",
      photo_url: body.photo_url || "/images/sangamkunwar-photo.jpg",
      logo_url: body.logo_url || "",
      updated_at: new Date().toISOString(),
    };

    // Check if a row already exists
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
        .update(heroData)
        .eq("id", existing.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return NextResponse.json(data);
    } else {
      // INSERT new row
      const { data, error } = await supabase
        .from("hero_settings")
        .insert([heroData])
        .select()
        .maybeSingle();

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