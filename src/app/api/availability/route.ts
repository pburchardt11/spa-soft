import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get("staff_id");
  const date = searchParams.get("date");
  const businessId = searchParams.get("business_id");

  if (!date || !businessId) {
    return NextResponse.json({ bookings: [], unavailable: false });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Check existing bookings
  let bookingQuery = supabase
    .from("bookings")
    .select("start_time, end_time, status")
    .eq("business_id", businessId)
    .gte("start_time", `${date}T00:00:00`)
    .lt("start_time", `${date}T23:59:59`)
    .in("status", ["confirmed", "pending"]);

  if (staffId) {
    bookingQuery = bookingQuery.eq("staff_id", staffId);
  }

  const { data: bookings } = await bookingQuery;

  // Check if staff is absent on this date
  let staffAbsent = false;
  if (staffId) {
    const { data: absence } = await supabase
      .from("staff_absences")
      .select("id")
      .eq("staff_id", staffId)
      .eq("date", date)
      .single();
    staffAbsent = !!absence;
  }

  // Check if staff is scheduled to work this day
  let staffOffDay = false;
  if (staffId) {
    const dow = new Date(date + "T12:00:00").getDay();
    const { data: schedule } = await supabase
      .from("staff_schedules")
      .select("id")
      .eq("staff_id", staffId)
      .eq("day_of_week", dow)
      .single();

    // Check if any schedules exist for this staff at all
    const { count } = await supabase
      .from("staff_schedules")
      .select("*", { count: "exact", head: true })
      .eq("staff_id", staffId);

    // Only mark as off-day if the staff has schedules defined but not for this day
    if (count && count > 0 && !schedule) {
      staffOffDay = true;
    }
  }

  // Check business hours for this day
  let businessClosed = false;
  const dow = new Date(date + "T12:00:00").getDay();
  const { data: bizHours } = await supabase
    .from("business_hours")
    .select("is_open, open_time, close_time")
    .eq("business_id", businessId)
    .eq("day_of_week", dow)
    .single();

  if (bizHours && !bizHours.is_open) {
    businessClosed = true;
  }

  // Get staff shift hours for this day (to show available window)
  let shiftStart: string | null = null;
  let shiftEnd: string | null = null;
  if (staffId) {
    const { data: scheduleWithShift } = await supabase
      .from("staff_schedules")
      .select("shift:shifts(start_time, end_time)")
      .eq("staff_id", staffId)
      .eq("day_of_week", dow)
      .single();

    if (scheduleWithShift?.shift) {
      const shift = scheduleWithShift.shift as unknown as { start_time: string; end_time: string };
      shiftStart = shift.start_time?.slice(0, 5) || null;
      shiftEnd = shift.end_time?.slice(0, 5) || null;
    }
  }

  return NextResponse.json({
    bookings: bookings || [],
    staffAbsent,
    staffOffDay,
    businessClosed,
    shiftStart,
    shiftEnd,
    businessHours: bizHours ? { open: bizHours.open_time?.slice(0, 5), close: bizHours.close_time?.slice(0, 5) } : null,
  });
}
