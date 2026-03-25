"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBusinessId } from "./helpers";

export async function getStaff() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("staff")
    .select("*")
    .order("name");
  if (error) throw error;
  return data;
}

export async function createStaffAction(formData: FormData) {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const { error } = await supabase.from("staff").insert({
    business_id: businessId,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    role: formData.get("role") as string || "therapist",
    color: formData.get("color") as string || "#7c3aed",
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/staff");
  return { success: true };
}

export async function updateStaffAction(id: string, formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("staff")
    .update({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: (formData.get("phone") as string) || null,
      role: formData.get("role") as string,
      active: formData.get("active") === "true",
    })
    .eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/dashboard/staff");
  return { success: true };
}

export async function deleteStaffAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/staff");
  return { success: true };
}
