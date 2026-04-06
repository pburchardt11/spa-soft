import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { notifyClient } from "@/lib/notifications";

function getAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

// Window around the target reminder time (minutes).
// Cron runs every 15 minutes, so a 15-min window catches every booking exactly once.
const WINDOW_MINUTES = 15;

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdmin();
  const now = Date.now();

  // Fetch all confirmed bookings starting in the next 25 hours.
  // We'll filter down to those within the reminder window per business.
  const upperBound = new Date(now + 25 * 60 * 60 * 1000).toISOString();
  const lowerBound = new Date(now - 5 * 60 * 1000).toISOString(); // include small past buffer

  const { data: bookings, error } = await admin
    .from("bookings")
    .select("id, business_id, start_time, status")
    .eq("status", "confirmed")
    .gte("start_time", lowerBound)
    .lt("start_time", upperBound);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!bookings || bookings.length === 0) {
    return NextResponse.json({ checked: 0, sent: 0 });
  }

  // Group bookings by business to fetch settings once per business
  const businessIds = Array.from(new Set(bookings.map((b) => b.business_id)));

  const { data: settingsList } = await admin
    .from("notification_settings")
    .select("business_id, reminder_hours_before")
    .in("business_id", businessIds);

  const settingsByBiz = new Map<string, number>();
  (settingsList || []).forEach((s) => {
    settingsByBiz.set(s.business_id, s.reminder_hours_before || 2);
  });

  // Fetch notification log entries for these bookings to avoid duplicates
  const bookingIds = bookings.map((b) => b.id);
  const { data: sentReminders } = await admin
    .from("notification_log")
    .select("booking_id")
    .in("booking_id", bookingIds)
    .eq("event", "booking_reminder")
    .eq("status", "sent");

  const alreadySent = new Set((sentReminders || []).map((r) => r.booking_id));

  let sent = 0;
  const errors: string[] = [];

  for (const booking of bookings) {
    if (alreadySent.has(booking.id)) continue;

    const hoursBefore = settingsByBiz.get(booking.business_id) ?? 2;
    const bookingStart = new Date(booking.start_time).getTime();
    const targetReminderTime = bookingStart - hoursBefore * 60 * 60 * 1000;
    const diffMs = Math.abs(now - targetReminderTime);

    // Only send if we're within the window
    if (diffMs > WINDOW_MINUTES * 60 * 1000) continue;

    try {
      await notifyClient("booking_reminder", {
        bookingId: booking.id,
        businessId: booking.business_id,
      });
      sent++;
    } catch (err) {
      errors.push(`${booking.id}: ${err instanceof Error ? err.message : "unknown"}`);
    }
  }

  return NextResponse.json({
    checked: bookings.length,
    sent,
    errors: errors.length > 0 ? errors : undefined,
  });
}
