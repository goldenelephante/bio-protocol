import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("quiz_completed")
      .eq("id", user.id)
      .single();

    redirect(profile?.quiz_completed ? "/dashboard" : "/quiz");
  }

  // Logged-out users see the landing page
  redirect("/landing");
}
