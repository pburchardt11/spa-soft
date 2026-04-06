"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBusinessId } from "./helpers";

export async function getServices() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("category, name");
  if (error) throw error;
  return data;
}

export async function createServiceAction(formData: FormData) {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const commissionRate = formData.get("commission_rate") as string;
  const { error } = await supabase.from("services").insert({
    business_id: businessId,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    duration: parseInt(formData.get("duration") as string),
    price: parseFloat(formData.get("price") as string),
    category: (formData.get("category") as string) || null,
    commission_rate: commissionRate ? parseFloat(commissionRate) : null,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function updateServiceAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const commissionRate = formData.get("commission_rate") as string;
  const { error } = await supabase
    .from("services")
    .update({
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      duration: parseInt(formData.get("duration") as string),
      price: parseFloat(formData.get("price") as string),
      category: (formData.get("category") as string) || null,
      commission_rate: commissionRate ? parseFloat(commissionRate) : null,
      active: formData.get("active") === "true",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/services");
  return { success: true };
}

export async function deleteServiceAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/services");
  return { success: true };
}
