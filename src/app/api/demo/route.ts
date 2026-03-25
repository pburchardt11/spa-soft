import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();

  // Sign in as the demo user using the regular client (sets cookies)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // ignore
          }
        },
      },
    }
  );

  const demoEmail = "demo@spa-soft.com";
  const demoPassword = "demo-SpaSoft-2026!";

  // Try to sign in
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  });

  if (!signInError) {
    return NextResponse.json({ success: true });
  }

  // Demo account doesn't exist yet — create it with admin client
  const admin = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Create demo auth user
  const { data: authData, error: authError } =
    await admin.auth.admin.createUser({
      email: demoEmail,
      password: demoPassword,
      email_confirm: true,
      user_metadata: { full_name: "Demo User", business_name: "Serenity Spa & Wellness" },
    });

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 500 });
  }

  // Create business
  const { data: biz } = await admin
    .from("businesses")
    .insert({
      name: "Serenity Spa & Wellness",
      email: demoEmail,
      phone: "(555) 100-2000",
      address: "123 Wellness Avenue, Suite 100, New York, NY 10001",
      timezone: "America/New_York",
      currency: "USD",
      plan: "professional",
    })
    .select()
    .single();

  if (!biz) {
    return NextResponse.json({ error: "Failed to create business" }, { status: 500 });
  }

  const bid = biz.id;

  // Owner staff
  await admin.from("staff").insert({
    business_id: bid,
    auth_user_id: authData.user.id,
    name: "Demo User",
    email: demoEmail,
    role: "owner",
  });

  // Staff members
  const staffData = [
    { name: "Emma Watson", email: "emma@serenity.com", phone: "(555) 101-0001", role: "therapist", color: "#7c3aed" },
    { name: "Olivia Kim", email: "olivia@serenity.com", phone: "(555) 101-0002", role: "therapist", color: "#2563eb" },
    { name: "Sophie Laurent", email: "sophie@serenity.com", phone: "(555) 101-0003", role: "therapist", color: "#059669" },
    { name: "James Rodriguez", email: "james@serenity.com", phone: "(555) 101-0004", role: "therapist", color: "#d97706" },
    { name: "Maya Patel", email: "maya@serenity.com", phone: "(555) 101-0005", role: "therapist", color: "#dc2626" },
    { name: "Lisa Chen", email: "lisa@serenity.com", phone: "(555) 101-0006", role: "manager", color: "#ec4899" },
    { name: "Rachel Adams", email: "rachel@serenity.com", phone: "(555) 101-0007", role: "receptionist", color: "#6366f1" },
  ];

  const { data: staffRows } = await admin
    .from("staff")
    .insert(staffData.map((s) => ({ business_id: bid, ...s })))
    .select("id, name");

  const staffIds = (staffRows || []).map((s) => s.id);

  // Services
  const servicesData = [
    { name: "Swedish Massage", description: "Classic relaxation massage with long flowing strokes", duration: 60, price: 110, category: "Massage" },
    { name: "Deep Tissue Massage", description: "Targets chronic muscle tension and knots", duration: 60, price: 130, category: "Massage" },
    { name: "Hot Stone Therapy", description: "Heated basalt stones placed on key points", duration: 90, price: 160, category: "Massage" },
    { name: "Couples Massage", description: "Side-by-side massage for two", duration: 90, price: 240, category: "Massage" },
    { name: "Sports Massage", description: "For athletes — deep work on problem areas", duration: 60, price: 120, category: "Massage" },
    { name: "Prenatal Massage", description: "Gentle massage designed for expectant mothers", duration: 60, price: 115, category: "Massage" },
    { name: "Classic Facial", description: "Deep cleanse, exfoliation, and hydration", duration: 45, price: 85, category: "Facial" },
    { name: "Anti-Aging Facial", description: "Collagen-boosting treatment with retinol", duration: 60, price: 140, category: "Facial" },
    { name: "Hydrating Facial", description: "Intense moisture boost with hyaluronic acid", duration: 50, price: 95, category: "Facial" },
    { name: "Aromatherapy", description: "Essential oils combined with massage techniques", duration: 60, price: 100, category: "Wellness" },
    { name: "Body Wrap", description: "Detoxifying seaweed or mud body wrap", duration: 75, price: 135, category: "Wellness" },
    { name: "Salt Scrub Exfoliation", description: "Full body exfoliation with sea salts", duration: 45, price: 80, category: "Wellness" },
    { name: "Reflexology", description: "Pressure point therapy on feet and hands", duration: 45, price: 75, category: "Wellness" },
    { name: "Manicure", description: "Classic manicure with polish", duration: 30, price: 40, category: "Nails" },
    { name: "Pedicure", description: "Classic pedicure with polish", duration: 45, price: 55, category: "Nails" },
    { name: "Gel Manicure", description: "Long-lasting gel polish manicure", duration: 45, price: 60, category: "Nails" },
  ];

  const { data: svcRows } = await admin
    .from("services")
    .insert(servicesData.map((s) => ({ business_id: bid, ...s })))
    .select("id, name, duration, price");

  const svcIds = (svcRows || []).map((s) => s.id);

  // Clients (25 clients)
  const clientNames = [
    "Sarah Johnson", "Michael Chen", "Jessica Davis", "Robert Miller", "Emily Wilson",
    "David Brown", "Anna Lee", "James Wilson", "Lisa Anderson", "Thomas Garcia",
    "Jennifer Taylor", "Christopher Moore", "Amanda White", "Daniel Martinez", "Rachel Green",
    "Kevin Harris", "Nicole Clark", "Brandon Lewis", "Samantha Hall", "Patrick Young",
    "Victoria King", "Andrew Wright", "Megan Scott", "Tyler Hill", "Lauren Baker",
  ];

  const clientsData = clientNames.map((name, i) => ({
    business_id: bid,
    name,
    email: `${name.toLowerCase().replace(" ", ".")}@email.com`,
    phone: `(555) ${200 + i}-${String(1000 + i).slice(-4)}`,
    tags: i < 5 ? ["VIP", "Regular"] : i < 15 ? ["Regular"] : i < 20 ? ["New"] : ["Regular", "Loyalty"],
  }));

  const { data: clientRows } = await admin
    .from("clients")
    .insert(clientsData)
    .select("id");

  const clientIds = (clientRows || []).map((c) => c.id);

  // Bookings — generate 50+ bookings across the past week and next week
  const bookings = [];
  const statuses = ["confirmed", "completed", "completed", "completed", "pending"];

  for (let dayOffset = -7; dayOffset <= 7; dayOffset++) {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const dateStr = date.toISOString().split("T")[0];

    // 4-8 bookings per day
    const count = 4 + Math.floor(Math.abs(dayOffset) < 3 ? 8 : 5);
    for (let j = 0; j < count; j++) {
      const hour = 9 + j;
      if (hour > 17) break;
      const svcIdx = (dayOffset + 7 + j) % svcIds.length;
      const svc = svcRows?.[svcIdx];
      const duration = svc?.duration || 60;

      bookings.push({
        business_id: bid,
        client_id: clientIds[(dayOffset + 7 + j) % clientIds.length],
        staff_id: staffIds[j % staffIds.length],
        service_id: svcIds[svcIdx],
        start_time: `${dateStr}T${String(hour).padStart(2, "0")}:00:00`,
        end_time: new Date(new Date(`${dateStr}T${String(hour).padStart(2, "0")}:00:00`).getTime() + duration * 60000).toISOString(),
        status: dayOffset < 0 ? "completed" : dayOffset === 0 ? statuses[j % statuses.length] : "confirmed",
      });
    }
  }

  const { data: bookingRows } = await admin
    .from("bookings")
    .insert(bookings)
    .select("id, client_id, service_id, status");

  // Payments for completed bookings
  const payments = (bookingRows || [])
    .filter((b) => b.status === "completed")
    .map((b) => {
      const svc = svcRows?.find((s) => s.id === b.service_id);
      return {
        business_id: bid,
        booking_id: b.id,
        client_id: b.client_id,
        amount: svc?.price || 100,
        method: ["card", "card", "card", "apple_pay", "cash"][Math.floor(Math.random() * 5)] as "card" | "apple_pay" | "cash",
        status: "completed" as const,
      };
    });

  await admin.from("payments").insert(payments);

  // Now sign in as demo user
  await supabase.auth.signInWithPassword({
    email: demoEmail,
    password: demoPassword,
  });

  return NextResponse.json({ success: true });
}
