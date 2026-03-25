"use server";

import { createClient } from "@/lib/supabase/server";
import { createServerClient } from "@supabase/ssr";

export async function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  return createServerClient(url, key, {
    cookies: { getAll: () => [], setAll: () => {} },
  });
}

export async function getBusinessId() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Use admin client to bypass RLS circular dependency on staff table
  const admin = await getAdminClient();
  const { data: staffRow } = await admin
    .from("staff")
    .select("business_id")
    .eq("auth_user_id", user.id)
    .single();

  return staffRow?.business_id || null;
}
