import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.booking_id;

    if (bookingId) {
      const { data: booking } = await supabase
        .from("bookings")
        .select("business_id, client_id")
        .eq("id", bookingId)
        .single();

      if (booking) {
        await supabase.from("payments").insert({
          business_id: booking.business_id,
          booking_id: bookingId,
          client_id: booking.client_id,
          amount: paymentIntent.amount / 100,
          method: "card",
          status: "completed",
          stripe_payment_intent_id: paymentIntent.id,
        });

        await supabase
          .from("bookings")
          .update({ status: "confirmed" })
          .eq("id", bookingId);
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const paymentIntent = event.data.object;
    const bookingId = paymentIntent.metadata.booking_id;

    if (bookingId) {
      const { data: booking } = await supabase
        .from("bookings")
        .select("business_id, client_id")
        .eq("id", bookingId)
        .single();

      if (booking) {
        await supabase.from("payments").insert({
          business_id: booking.business_id,
          booking_id: bookingId,
          client_id: booking.client_id,
          amount: paymentIntent.amount / 100,
          method: "card",
          status: "failed",
          stripe_payment_intent_id: paymentIntent.id,
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
