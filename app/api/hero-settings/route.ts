import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    if (error) {
      console.error("GET ERROR:", error);
      throw error;
    }

    const defaultData = {
      id: 1,
      title: "I'm Sangam Kunwar",
      subtitle: "Full-Stack Developer & Designer",
      description:
        "I'm passionate about building beautiful, functional web applications.",
      photo_url: "/sangamkunwarphoto.png",
      logo_url: "",
    };

    return NextResponse.json(data ?? defaultData);
  } catch (error: any) {
    console.error("Hero GET ERROR:", error);
    return NextResponse.json(
      { error: error.message || "GET failed" },
      { status: 500 }
    );
  }
}

// UPDATE or INSERT Hero
export async function PUT(request: Request) {
  try {
    const supabase = createClient();
    const body = await request.json();

    console.log("BODY RECEIVED:", body);

    const heroData = {
      title: body.title ?? "",
      subtitle: body.subtitle ?? "",
      description: body.description ?? "",
      photo_url:
        body.photo_url ?? "/images/sangamkunwar-photo.jpg",
      logo_url: body.logo_url ?? "",
    };

    // 1️⃣ Check existing row
    const { data: existing, error: fetchError } = await supabase
      .from("hero_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("FETCH ERROR:", fetchError);
      throw fetchError;
    }

    // 2️⃣ UPDATE
    if (existing?.id) {
      const { data, error } = await supabase
        .from("hero_settings")
        .update(heroData)
        .eq("id", existing.id)
        .select();

      if (error) {
        console.error("UPDATE ERROR:", error);
        throw error;
      }

      return NextResponse.json({ success: true, data });
    }

    // 3️⃣ INSERT
    const { data, error } = await supabase
      .from("hero_settings")
      .insert([heroData])
      .select();

    if (error) {
      console.error("INSERT ERROR:", error);
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Hero PUT ERROR:", error);

    return NextResponse.json(
      {
        error: error.message || "PUT failed",
      },
      { status: 500 }
    );
  }
}