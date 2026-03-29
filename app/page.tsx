// app/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import Header from "@/components/header"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"
import ContactForm from "@/components/contact-form"
import Footer from "@/components/footer"
import { createClient } from "@/lib/supabase/server" // Ensure this path is correct for your project

async function getHeroData() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("hero_settings") // Double-check this table name in Supabase
      .select("*")
      .maybeSingle();

    if (error) {
      console.error("Supabase Fetch Error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Connection Error:", err);
    return null;
  }
}

export default async function Home() {
  // 1. Fetch the fresh data from Supabase on the server
  const heroData = await getHeroData();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header />
      
      {/* 2. Pass the fetched data into the Hero component */}
      <Hero initialData={heroData} />
      
      <Projects />
      <Skills />
      <ContactForm />
      <Footer />
    </main>
  )
}