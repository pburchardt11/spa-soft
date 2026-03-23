"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function getClients() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error) throw error;
  return data;
}

export async function getClientWithStats() {
  const supabase = await createClient();

  const { data: clients, error } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  if (error) throw error;

  // Get booking counts and payment totals per client
  const enriched = await Promise.all(
    (clients || []).map(async (client) => {
      const { count: visits } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("client_id", client.id)
        .in("status", ["confirmed", "completed"]);

      const { data: lastBooking } = await supabase
        .from("bookings")
        .select("start_time")
        .eq("client_id", client.id)
        .order("start_time", { ascending: false })
        .limit(1)
        .single();

      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("client_id", client.id)
        .eq("status", "completed");

      const totalSpent = (payments || []).reduce(
        (sum, p) => sum + Number(p.amount),
        0
      );

      return {
        ...client,
        visits: visits || 0,
        lastVisit: lastBooking?.start_time || null,
        totalSpent,
      };
    })
  );

  return enriched;
}

export async function createClientAction(formData: FormData) {
  const supabase = await createClient();

  const { data: staffRow } = await supabase
    .from("staff")
    .select("business_id")
    .eq("auth_user_id", (await supabase.auth.getUser()).data.user?.id)
    .single();

  if (!staffRow) return { error: "No business found" };

  const tags = (formData.get("tags") as string)
    ?.split(",")
    .map((t) => t.trim())
    .filter(Boolean) || [];

  const { error } = await supabase.from("clients").insert({
    business_id: staffRow.business_id,
    name: formData.get("name") as string,
    email: (formData.get("email") as string) || null,
    phone: (formData.get("phone") as string) || null,
    notes: (formData.get("notes") as string) || null,
    tags,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/clients");
  return { success: true };
}
