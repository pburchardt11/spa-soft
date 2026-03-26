import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const staffId = searchParams.get("staff_id");
  const date = searchParams.get("date");
  const businessId = searchParams.get("business_id");

  if (!date || !businessId) {
    return NextResponse.json({ bookings: [] });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  let query = supabase
    .from("bookings")
    .select("start_time, end_time, status, staff:staff(name)")
    .eq("business_id", businessId)
    .gte("start_time", `${date}T00:00:00`)
    .lt("start_time", `${date}T23:59:59`)
    .in("status", ["confirmed", "pending"]);

  if (staffId) {
    query = query.eq("staff_id", staffId);
  }

  const { data } = await query;

  return NextResponse.json({ bookings: data || [] });
}
