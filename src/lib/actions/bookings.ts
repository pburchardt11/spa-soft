"use server";

import { revalidatePath } from "next/cache";
import { getBusinessId, getAdminClient } from "./helpers";
import { getCurrentBranchId } from "./branches";
import { notifyClient } from "@/lib/notifications";

export async function createBooking(formData: FormData) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  let clientId = formData.get("client_id") as string;

  // Handle new client creation
  if (clientId === "__new") {
    const newName = formData.get("new_client_name") as string;
    const newPhone = formData.get("new_client_phone") as string;

    if (!newName) return { error: "Client name is required" };

    const { data: newClient, error: clientError } = await admin
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
  const { data: service } = await admin
    .from("services")
    .select("duration")
    .eq("id", serviceId)
    .single();

  const startTime = formData.get("start_time") as string;
  if (!startTime || startTime.includes("undefined")) {
    return { error: "Please select a date and time" };
  }

  const endTime = new Date(
    new Date(startTime).getTime() + (service?.duration || 60) * 60000
  ).toISOString();

  const branchId = await getCurrentBranchId();

  const { data: booking, error } = await admin.from("bookings").insert({
    business_id: businessId,
    branch_id: branchId,
    client_id: clientId,
    staff_id: formData.get("staff_id") as string,
    service_id: serviceId,
    start_time: startTime,
    end_time: endTime,
    status: "confirmed",
    notes: (formData.get("notes") as string) || null,
  }).select("id").single();

  if (error) return { error: error.message };

  // Send booking confirmation notification (fire and forget)
  if (booking) {
    notifyClient("booking_confirmed", { bookingId: booking.id, businessId }).catch(() => {});
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateBookingStatus(id: string, status: string) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();

  const { error } = await admin
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };

  // Send notification based on status change
  if (businessId) {
    const eventMap: Record<string, string> = {
      confirmed: "booking_confirmed",
      cancelled: "booking_cancelled",
      completed: "booking_completed",
    };
    const event = eventMap[status];
    if (event) {
      notifyClient(event as any, { bookingId: id, businessId }).catch(() => {});
    }
  }

  revalidatePath("/dashboard/bookings");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function cancelBooking(id: string) {
  return updateBookingStatus(id, "cancelled");
}
