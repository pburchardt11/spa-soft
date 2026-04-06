import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

// GET: fetch booking info for a review page
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("booking_id");

  if (!bookingId) {
    return NextResponse.json({ error: "booking_id required" }, { status: 400 });
  }

  const admin = getAdmin();

  const { data: booking } = await admin
    .from("bookings")
    .select(
      "id, start_time, businesses:business_id(name, timezone), services(name), staff(name)"
    )
    .eq("id", bookingId)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Check if already reviewed
  const { data: existingReview } = await admin
    .from("reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .maybeSingle();

  const tz = (booking.businesses as any)?.timezone || "Asia/Bangkok";
  const start = new Date(booking.start_time);
  const date = start.toLocaleDateString("en-US", { timeZone: tz, weekday: "short", month: "short", day: "numeric" });
  const time = start.toLocaleTimeString("en-US", { timeZone: tz, hour: "numeric", minute: "2-digit" });

  return NextResponse.json({
    service_name: (booking.services as any)?.name || "Appointment",
    staff_name: (booking.staff as any)?.name || "Staff",
    business_name: (booking.businesses as any)?.name || "Our Spa",
    date,
    time,
    already_reviewed: !!existingReview,
  });
}

// POST: submit a review
export async function POST(request: Request) {
  const body = await request.json();
  const { booking_id, rating, comment } = body;

  if (!booking_id || !rating) {
    return NextResponse.json({ error: "booking_id and rating required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const admin = getAdmin();

  // Fetch booking to get business/branch/client/staff IDs
  const { data: booking } = await admin
    .from("bookings")
    .select("business_id, branch_id, client_id, staff_id")
    .eq("id", booking_id)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Check if already reviewed
  const { data: existing } = await admin
    .from("reviews")
    .select("id")
    .eq("booking_id", booking_id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: "This booking has already been reviewed" }, { status: 409 });
  }

  const { error } = await admin.from("reviews").insert({
    business_id: booking.business_id,
    branch_id: booking.branch_id,
    booking_id,
    client_id: booking.client_id,
    staff_id: booking.staff_id,
    rating,
    comment: comment?.trim() || null,
    status: "approved",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
