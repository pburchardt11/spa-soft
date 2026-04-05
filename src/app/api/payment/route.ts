import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createPaymentIntent, getAirwallexEnv } from "@/lib/airwallex";

function getAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(request: Request) {
  const { booking_id } = await request.json();

  if (!booking_id) {
    return NextResponse.json({ error: "booking_id required" }, { status: 400 });
  }

  const admin = getAdmin();

  // Get booking with service price and business deposit settings
  const { data: booking } = await admin
    .from("bookings")
    .select("id, business_id, service_id, services(price), businesses:business_id(currency, deposit_enabled, deposit_type, deposit_value)")
    .eq("id", booking_id)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const business = booking.businesses as any;
  const servicePrice = Number((booking.services as any)?.price || 0);

  if (!business?.deposit_enabled) {
    return NextResponse.json({ error: "Deposits not enabled" }, { status: 400 });
  }

  // Calculate deposit amount
  let depositAmount: number;
  if (business.deposit_type === "percentage") {
    depositAmount = Math.round(servicePrice * (business.deposit_value / 100) * 100) / 100;
  } else {
    depositAmount = Math.min(Number(business.deposit_value), servicePrice);
  }

  if (depositAmount <= 0) {
    return NextResponse.json({ error: "Invalid deposit amount" }, { status: 400 });
  }

  try {
    const intent = await createPaymentIntent({
      amount: depositAmount,
      currency: business.currency || "THB",
      bookingId: booking_id,
    });

    // Store the payment intent ID and deposit amount on the booking
    await admin
      .from("bookings")
      .update({
        airwallex_payment_intent_id: intent.id,
        deposit_amount: depositAmount,
      })
      .eq("id", booking_id);

    return NextResponse.json({
      intent_id: intent.id,
      client_secret: intent.client_secret,
      deposit_amount: depositAmount,
      currency: business.currency || "THB",
      env: getAirwallexEnv(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
