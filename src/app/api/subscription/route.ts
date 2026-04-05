import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import {
  createCustomer,
  createPaymentConsent,
  createSubscription,
  cancelSubscription,
  getAirwallexEnv,
} from "@/lib/airwallex";

// Airwallex Price IDs — create these in your Airwallex dashboard
// Products > Create Product > Add Prices for each plan
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

// POST: Create or change subscription
export async function POST(request: Request) {
  const { business_id, plan } = await request.json();

  if (!business_id || !plan) {
    return NextResponse.json({ error: "business_id and plan required" }, { status: 400 });
  }

  if (plan === "starter") {
    return NextResponse.json({ error: "Starter is the free plan" }, { status: 400 });
  }

  const priceId = PLAN_PRICES[plan];
  if (!priceId) {
    return NextResponse.json({ error: `No price configured for plan: ${plan}` }, { status: 400 });
  }

  const admin = getAdmin();

  // Get business
  const { data: business } = await admin
    .from("businesses")
    .select("id, name, email, airwallex_customer_id")
    .eq("id", business_id)
    .single();

  if (!business) {
    return NextResponse.json({ error: "Business not found" }, { status: 404 });
  }

  try {
    // Create Airwallex customer if not exists
    let customerId = business.airwallex_customer_id;
    if (!customerId) {
      const customer = await createCustomer({
        email: business.email || "",
        businessName: business.name,
        businessId: business.id,
      });
      customerId = customer.id;
      await admin
        .from("businesses")
        .update({ airwallex_customer_id: customerId })
        .eq("id", business.id);
    }

    // Create payment consent (client needs to verify this with card details)
    const consent = await createPaymentConsent({
      customerId,
      currency: "usd",
    });

    // Store pending state — subscription will be created after payment consent is verified
    await admin
      .from("businesses")
      .update({
        airwallex_payment_consent_id: consent.id,
        subscription_plan: plan,
      })
      .eq("id", business.id);

    return NextResponse.json({
      consent_id: consent.id,
      client_secret: consent.client_secret,
      customer_id: customerId,
      plan,
      price_id: priceId,
      env: getAirwallexEnv(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Subscription creation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: Cancel subscription
export async function DELETE(request: Request) {
  const { business_id } = await request.json();

  if (!business_id) {
    return NextResponse.json({ error: "business_id required" }, { status: 400 });
  }

  const admin = getAdmin();

  const { data: business } = await admin
    .from("businesses")
    .select("airwallex_subscription_id")
    .eq("id", business_id)
    .single();

  if (!business?.airwallex_subscription_id) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 });
  }

  try {
    await cancelSubscription(business.airwallex_subscription_id);

    await admin
      .from("businesses")
      .update({
        subscription_status: "cancelled",
      })
      .eq("id", business_id);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Cancellation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
