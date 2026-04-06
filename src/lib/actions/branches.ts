"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { getBusinessId, getAdminClient } from "./helpers";
import type { Branch } from "@/lib/types";

export async function listBranches(): Promise<Branch[]> {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return [];

  const { data } = await admin
    .from("branches")
    .select("*")
    .eq("business_id", businessId)
    .eq("active", true)
    .order("is_primary", { ascending: false })
    .order("name");

  return data || [];
}

export async function createBranch(formData: FormData) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const name = formData.get("name") as string;
  if (!name) return { error: "Branch name is required" };

  // Check if this is the first branch (auto-make primary)
  const { count } = await admin
    .from("branches")
    .select("id", { count: "exact", head: true })
    .eq("business_id", businessId);

  const { error } = await admin.from("branches").insert({
    business_id: businessId,
    name,
    address: (formData.get("address") as string) || null,
    phone: (formData.get("phone") as string) || null,
    email: (formData.get("email") as string) || null,
    timezone: (formData.get("timezone") as string) || null,
    is_primary: count === 0,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/branches");
  return { success: true };
}

export async function updateBranch(id: string, formData: FormData) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const { error } = await admin
    .from("branches")
    .update({
      name: formData.get("name") as string,
      address: (formData.get("address") as string) || null,
      phone: (formData.get("phone") as string) || null,
      email: (formData.get("email") as string) || null,
      timezone: (formData.get("timezone") as string) || null,
    })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/branches");
  return { success: true };
}

export async function deleteBranch(id: string) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  // Don't allow deleting the primary branch
  const { data: branch } = await admin
    .from("branches")
    .select("is_primary")
    .eq("id", id)
    .single();

  if (branch?.is_primary) {
    return { error: "Cannot delete primary branch" };
  }

  // Soft-delete (set inactive)
  const { error } = await admin
    .from("branches")
    .update({ active: false })
    .eq("id", id)
    .eq("business_id", businessId);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/branches");
  return { success: true };
}

export async function setCurrentBranch(branchId: string) {
  const cookieStore = await cookies();
  cookieStore.set("current_branch_id", branchId, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/dashboard");
}

export async function getCurrentBranchId(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookieBranch = cookieStore.get("current_branch_id")?.value;
  if (cookieBranch) return cookieBranch;

  // Default to primary branch
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return null;

  const { data } = await admin
    .from("branches")
    .select("id")
    .eq("business_id", businessId)
    .eq("is_primary", true)
    .eq("active", true)
    .single();

  return data?.id || null;
}
