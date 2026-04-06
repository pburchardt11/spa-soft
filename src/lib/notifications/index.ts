import { createServerClient } from "@supabase/ssr";
import type { NotificationEvent, NotificationSettings } from "@/lib/types";
import { sendEmail } from "./email";
import { sendLineMessage } from "./line";
import { sendWhatsAppMessage } from "./whatsapp";

function getAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

type BookingContext = {
  bookingId: string;
  businessId: string;
};

type BookingDetails = {
  clientName: string;
  serviceName: string;
  staffName: string;
  date: string;
  time: string;
  businessName: string;
  reviewLink?: string;
};

async function getBookingDetails(
  bookingId: string,
  businessId: string
): Promise<BookingDetails | null> {
  const admin = getAdmin();

  const { data: booking } = await admin
    .from("bookings")
    .select(
      "start_time, clients(name), services(name), staff(name), businesses:business_id(name, timezone)"
    )
    .eq("id", bookingId)
    .single();

  if (!booking) return null;

  const tz = (booking.businesses as any)?.timezone || "Asia/Bangkok";
  const start = new Date(booking.start_time);
  const date = start.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
  const time = start.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.spa-soft.com";

  return {
    clientName: (booking.clients as any)?.name || "Guest",
    serviceName: (booking.services as any)?.name || "Appointment",
    staffName: (booking.staff as any)?.name || "Staff",
    date,
    time,
    businessName: (booking.businesses as any)?.name || "Our Spa",
    reviewLink: `${baseUrl}/review/${bookingId}`,
  };
}

async function getSettings(businessId: string): Promise<NotificationSettings | null> {
  const admin = getAdmin();
  const { data } = await admin
    .from("notification_settings")
    .select("*")
    .eq("business_id", businessId)
    .single();
  return data;
}

async function logNotification(
  businessId: string,
  clientId: string | null,
  bookingId: string | null,
  channel: string,
  event: NotificationEvent,
  status: "sent" | "failed",
  errorMessage?: string
) {
  const admin = getAdmin();
  await admin.from("notification_log").insert({
    business_id: businessId,
    client_id: clientId,
    booking_id: bookingId,
    channel,
    event,
    status,
    error_message: errorMessage || null,
    sent_at: status === "sent" ? new Date().toISOString() : null,
  });
}

/**
 * Send notifications to a client for a booking event.
 * Checks their preferences and sends via all opted-in channels.
 */
export async function notifyClient(
  event: NotificationEvent,
  context: BookingContext
): Promise<void> {
  const { bookingId, businessId } = context;
  const admin = getAdmin();

  // Get booking details
  const details = await getBookingDetails(bookingId, businessId);
  if (!details) return;

  // Get client from booking
  const { data: booking } = await admin
    .from("bookings")
    .select("client_id")
    .eq("id", bookingId)
    .single();
  if (!booking?.client_id) return;

  const clientId = booking.client_id;

  // Get notification settings for business
  const settings = await getSettings(businessId);

  // Get client preferences
  const { data: preferences } = await admin
    .from("notification_preferences")
    .select("*")
    .eq("client_id", clientId)
    .eq("business_id", businessId)
    .eq("opted_in", true);

  // Also get the client directly for email fallback
  const { data: client } = await admin
    .from("clients")
    .select("email, phone")
    .eq("id", clientId)
    .single();

  // Email: send if enabled (default on) and client has email
  const emailPref = preferences?.find((p) => p.channel === "email");
  const emailAddress = emailPref?.identifier || client?.email;
  if (emailAddress && (settings?.email_enabled !== false)) {
    const result = await sendEmail(emailAddress, event, details, settings?.email_from_name || undefined);
    await logNotification(businessId, clientId, bookingId, "email", event, result.success ? "sent" : "failed", result.error);
  }

  // LINE: send if enabled and client has LINE preference
  const linePref = preferences?.find((p) => p.channel === "line");
  if (linePref && settings?.line_enabled && settings.line_channel_access_token) {
    const result = await sendLineMessage(
      linePref.identifier,
      settings.line_channel_access_token,
      event,
      details
    );
    await logNotification(businessId, clientId, bookingId, "line", event, result.success ? "sent" : "failed", result.error);
  }

  // WhatsApp: send if enabled and client has WhatsApp preference
  const whatsappPref = preferences?.find((p) => p.channel === "whatsapp");
  if (whatsappPref && settings?.whatsapp_enabled && settings.whatsapp_access_token && settings.whatsapp_phone_number_id) {
    const result = await sendWhatsAppMessage(
      whatsappPref.identifier,
      settings.whatsapp_access_token,
      settings.whatsapp_phone_number_id,
      event,
      details
    );
    await logNotification(businessId, clientId, bookingId, "whatsapp", event, result.success ? "sent" : "failed", result.error);
  }
}
