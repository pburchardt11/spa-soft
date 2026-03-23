"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData) {
  const supabase = await createClient();

  const businessName = formData.get("businessName") as string;
  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, business_name: businessName },
    },
  });

  if (authError) {
    return { error: authError.message };
  }

  if (authData.user) {
    // Create business
    const { data: business, error: bizError } = await supabase
      .from("businesses")
      .insert({ name: businessName, email })
      .select()
      .single();

    if (bizError) {
      return { error: bizError.message };
    }

    // Create staff record for owner
    await supabase.from("staff").insert({
      business_id: business.id,
      auth_user_id: authData.user.id,
      name: fullName,
      email,
      role: "owner",
    });

    // Seed demo data
    await supabase.rpc("seed_demo_data", { p_business_id: business.id });
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
