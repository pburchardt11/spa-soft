import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { notifyClient } from "@/lib/notifications";
import crypto from "crypto";

function getAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

function verifyWebhook(body: string, timestamp: string, signature: string): boolean {
  const secret = process.env.AIRWALLEX_WEBHOOK_SECRET;
  if (!secret) return false;
  const payload = `${timestamp}${body}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function POST(request: Request) {
  const body = await request.text();
  const timestamp = request.headers.get("x-timestamp") || "";
  const signature = request.headers.get("x-signature") || "";

  // Verify webhook signature if secret is configured
  if (process.env.AIRWALLEX_WEBHOOK_SECRET) {
    if (!verifyWebhook(body, timestamp, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  }

  const event = JSON.parse(body);
  const admin = getAdmin();

  if (event.name === "payment_intent.succeeded") {
    const intentId = event.data?.object?.id;
    const paymentMethod = event.data?.object?.latest_payment_attempt?.payment_method?.type || "airwallex";

    if (intentId) {
      // Find the booking by Airwallex payment intent ID
      const { data: booking } = await admin
        .from("bookings")
        .select("id, business_id, client_id, deposit_amount")
        .eq("airwallex_payment_intent_id", intentId)
        .single();

      if (booking) {
        // Record the payment
        await admin.from("payments").insert({
          business_id: booking.business_id,
          booking_id: booking.id,
          client_id: booking.client_id,
          amount: booking.deposit_amount || (event.data.object.amount / 100),
          currency: event.data.object.currency?.toUpperCase() || "THB",
          method: paymentMethod === "promptpay" ? "promptpay" : "card",
          status: "completed",
        });

        // Confirm the booking
        await admin
          .from("bookings")
          .update({ status: "confirmed" })
          .eq("id", booking.id);

        // Send confirmation notification
        notifyClient("booking_confirmed", {
          bookingId: booking.id,
          businessId: booking.business_id,
        }).catch(() => {});
      }
    }
  }

  if (event.name === "payment_intent.payment_failed") {
    const intentId = event.data?.object?.id;

    if (intentId) {
      const { data: booking } = await admin
        .from("bookings")
        .select("id, business_id, client_id, deposit_amount")
        .eq("airwallex_payment_intent_id", intentId)
        .single();

      if (booking) {
        await admin.from("payments").insert({
          business_id: booking.business_id,
          booking_id: booking.id,
          client_id: booking.client_id,
          amount: booking.deposit_amount || 0,
          method: "airwallex",
          status: "failed",
        });
      }
    }
  }

  return NextResponse.json({ received: true });
}
