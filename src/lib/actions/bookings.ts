"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBusinessId } from "./helpers";

export async function getBookings(date?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("bookings")
    .select("*, client:clients(*), staff:staff(*), service:services(*)")
    .order("start_time", { ascending: true });

  if (date) {
    query = query
      .gte("start_time", `${date}T00:00:00`)
      .lt("start_time", `${date}T23:59:59`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function createBooking(formData: FormData) {
  const supabase = await createClient();

  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  let clientId = formData.get("client_id") as string;

  // Handle new client creation
  if (clientId === "__new") {
    const newName = formData.get("new_client_name") as string;
    const newPhone = formData.get("new_client_phone") as string;

    if (!newName) return { error: "Client name is required" };

    const { data: newClient, error: clientError } = await supabase
      .from("clients")
      .insert({
        business_id: businessId,
        name: newName,
        phone: newPhone || null,
        tags: ["New"],
      })
      .select("id")
      .single();

    if (clientError) return { error: clientError.message };
    clientId = newClient.id;
  }

  const serviceId = formData.get("service_id") as string;
  const { data: service } = await supabase
    .from("services")
    .select("duration")
    .eq("id", serviceId)
    .single();

  const startTime = formData.get("start_time") as string;
  const endTime = new Date(
    new Date(startTime).getTime() + (service?.duration || 60) * 60000
  ).toISOString();

  const { error } = await supabase.from("bookings").insert({
    business_id: businessId,
    client_id: clientId,
    staff_id: formData.get("staff_id") as string,
    service_id: serviceId,
    start_time: startTime,
    end_time: endTime,
    status: "confirmed",
    notes: (formData.get("notes") as string) || null,
  });

  if (error) return { error: error.message };

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateBookingStatus(id: string, status: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function cancelBooking(id: string) {
  return updateBookingStatus(id, "cancelled");
}
