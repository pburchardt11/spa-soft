"use server";

import { revalidatePath } from "next/cache";
import { getBusinessId, getAdminClient } from "./helpers";
import type { NotificationSettings } from "@/lib/types";

export async function getNotificationSettings(): Promise<NotificationSettings | null> {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return null;

  const { data } = await admin
    .from("notification_settings")
    .select("*")
    .eq("business_id", businessId)
    .single();

  return data;
}

export async function saveNotificationSettings(formData: FormData) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const settings = {
    business_id: businessId,
    email_enabled: formData.get("email_enabled") === "true",
    email_from_name: (formData.get("email_from_name") as string) || null,
    line_enabled: formData.get("line_enabled") === "true",
    line_channel_access_token: (formData.get("line_channel_access_token") as string) || null,
    line_channel_secret: (formData.get("line_channel_secret") as string) || null,
    whatsapp_enabled: formData.get("whatsapp_enabled") === "true",
    whatsapp_access_token: (formData.get("whatsapp_access_token") as string) || null,
    whatsapp_phone_number_id: (formData.get("whatsapp_phone_number_id") as string) || null,
    reminder_hours_before: parseInt(formData.get("reminder_hours_before") as string) || 2,
    updated_at: new Date().toISOString(),
  };

  const { error } = await admin
    .from("notification_settings")
    .upsert(settings, { onConflict: "business_id" });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function getNotificationLog(limit = 20) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return [];

  const { data } = await admin
    .from("notification_log")
    .select("*, clients(name)")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false })
    .limit(limit);

  return data || [];
}
