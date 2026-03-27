import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server"; // your server client

export const GET = async () => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("hero_settings")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json(data || {});
  } catch (err: any) {
    console.error("Error fetching hero settings:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const supabase = createClient();
    const body = await req.json();
    const { title, subtitle, description, photo_url, logo_url } = body;

    const { data, error } = await supabase
      .from("hero_settings")
      .update({ title, subtitle, description, photo_url, logo_url })
      .eq("id", 1)
      .select()
      .maybeSingle();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("Error saving hero settings:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
};