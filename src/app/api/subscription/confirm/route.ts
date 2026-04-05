import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createSubscription } from "@/lib/airwallex";

const PLAN_PRICES: Record<string, string> = {
  professional: process.env.AIRWALLEX_PRICE_PROFESSIONAL || "",
  enterprise: process.env.AIRWALLEX_PRICE_ENTERPRISE || "",
};

function getAdmin() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );
}

export async function POST(request: Request) {
  const { business_id, consent_id } = await request.json();

  if (!business_id || !consent_id) {
    return NextResponse.json({ error: "business_id and consent_id required" }, { status: 400 });
  }

  const admin = getAdmin();

  const { data: business } = await admin
    .from("businesses")
    .select("airwallex_customer_id, subscription_plan")
    .eq("id", business_id)
    .single();

  if (!business?.airwallex_customer_id) {
    return NextResponse.json({ error: "No customer found" }, { status: 400 });
  }

  const priceId = PLAN_PRICES[business.subscription_plan || "professional"];
  if (!priceId) {
    return NextResponse.json({ error: "No price configured" }, { status: 400 });
  }

  try {
    const subscription = await createSubscription({
      customerId: business.airwallex_customer_id,
      priceId,
      paymentConsentId: consent_id,
    });

    await admin
      .from("businesses")
      .update({
        airwallex_subscription_id: subscription.id,
        subscription_status: "active",
      })
      .eq("id", business_id);

    return NextResponse.json({ success: true, subscription_id: subscription.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Subscription activation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
