"use server";

import { revalidatePath } from "next/cache";
import { getBusinessId, getAdminClient } from "./helpers";

export async function createStaffAction(formData: FormData) {
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const admin = await getAdminClient();
  const { error } = await admin.from("staff").insert({
    business_id: businessId,
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || null,
    role: (formData.get("role") as string) || "therapist",
    color: (formData.get("color") as string) || "#7c3aed",
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/staff");
  return { success: true };
}

export async function updateStaffAction(id: string, formData: FormData) {
  const admin = await getAdminClient();

  const { error } = await admin
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
  const admin = await getAdminClient();
  const { error } = await admin.from("staff").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/staff");
  return { success: true };
}
