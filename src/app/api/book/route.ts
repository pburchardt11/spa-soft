import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { notifyClient } from "@/lib/notifications";

function getSupabase() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const businessId = searchParams.get("business_id");
  const branchId = searchParams.get("branch_id");

  if (!businessId) {
    return NextResponse.json({ error: "business_id required" }, { status: 400 });
  }

  const supabase = getSupabase();

  let staffQuery = supabase
    .from("staff")
    .select("id, name, color, branch_id")
    .eq("business_id", businessId)
    .eq("active", true)
    .in("role", ["therapist", "manager", "owner"])
    .order("name");
  if (branchId) staffQuery = staffQuery.eq("branch_id", branchId);

  const [{ data: services }, { data: staff }, { data: business }, { data: branches }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, description, duration, price, category")
      .eq("business_id", businessId)
      .eq("active", true)
      .order("category, name"),
    staffQuery,
    supabase
      .from("businesses")
      .select("name, timezone, currency, deposit_enabled, deposit_type, deposit_value")
      .eq("id", businessId)
      .single(),
    supabase
      .from("branches")
      .select("id, name, address, phone")
      .eq("business_id", businessId)
      .eq("active", true)
      .order("is_primary", { ascending: false })
      .order("name"),
  ]);

  return NextResponse.json({ services, staff, business, branches });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { business_id, branch_id, service_id, staff_id, start_time, client_name, client_email, client_phone } = body;

  if (!business_id || !service_id || !start_time || !client_name || !client_email) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabase();

  // Get service duration
  const { data: service } = await supabase
    .from("services")
    .select("duration")
    .eq("id", service_id)
    .single();

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const endTime = new Date(
    new Date(start_time).getTime() + service.duration * 60000
  ).toISOString();

  // Find or create client
  let { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("business_id", business_id)
    .eq("email", client_email)
    .single();

  if (!client) {
    const { data: newClient } = await supabase
      .from("clients")
      .insert({
        business_id,
        name: client_name,
        email: client_email,
        phone: client_phone || null,
        tags: ["Online"],
      })
      .select("id")
      .single();
    client = newClient;
  }

  // Determine branch — use provided branch_id or fall back to primary branch
  let effectiveBranchId: string | null = branch_id || null;
  if (!effectiveBranchId) {
    const { data: primary } = await supabase
      .from("branches")
      .select("id")
      .eq("business_id", business_id)
      .eq("is_primary", true)
      .eq("active", true)
      .single();
    effectiveBranchId = primary?.id || null;
  }

  // Create booking
  const { data: booking, error } = await supabase
    .from("bookings")
    .insert({
      business_id,
      branch_id: effectiveBranchId,
      client_id: client?.id,
      staff_id: staff_id || null,
      service_id,
      start_time,
      end_time: endTime,
      status: "pending",
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send notification for new online booking (fire and forget)
  if (booking?.id) {
    notifyClient("booking_confirmed", { bookingId: booking.id, businessId: business_id }).catch(() => {});

    // Auto-create email notification preference for online bookings
    if (client_email) {
      await supabase.from("notification_preferences").upsert(
        {
          business_id,
          client_id: client?.id,
          channel: "email",
          identifier: client_email,
          opted_in: true,
        },
        { onConflict: "business_id,client_id,channel" }
      );
    }

    // Auto-create WhatsApp preference if phone provided and opted in
    if (client_phone && body.whatsapp_opt_in) {
      await supabase.from("notification_preferences").upsert(
        {
          business_id,
          client_id: client?.id,
          channel: "whatsapp",
          identifier: client_phone.replace(/[^0-9+]/g, ""),
          opted_in: true,
        },
        { onConflict: "business_id,client_id,channel" }
      );
    }
  }

  return NextResponse.json({ booking_id: booking?.id, success: true });
}
