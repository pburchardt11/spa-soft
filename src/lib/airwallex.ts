const BASE_URL = process.env.AIRWALLEX_ENV === "demo"
  ? "https://api-demo.airwallex.com"
  : "https://api.airwallex.com";

let cachedToken: { token: string; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  // Reuse token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60000) {
    return cachedToken.token;
  }

  const res = await fetch(`${BASE_URL}/api/v1/authentication/login`, {
    method: "POST",
    headers: {
      "x-client-id": process.env.AIRWALLEX_CLIENT_ID!,
      "x-api-key": process.env.AIRWALLEX_API_KEY!,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airwallex auth failed: ${err}`);
  }

  const data = await res.json();
  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + (data.expires_at ? new Date(data.expires_at).getTime() - Date.now() : 25 * 60 * 1000),
  };
  return data.token;
}

export async function createPaymentIntent(params: {
  amount: number;
  currency: string;
  bookingId: string;
  merchantOrderId?: string;
}): Promise<{ id: string; client_secret: string }> {
  const token = await getAccessToken();

  const res = await fetch(`${BASE_URL}/api/v1/pa/payment_intents/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: params.amount,
      currency: params.currency.toLowerCase(),
      merchant_order_id: params.merchantOrderId || `booking_${params.bookingId}`,
      request_id: crypto.randomUUID(),
      metadata: {
        booking_id: params.bookingId,
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airwallex create intent failed: ${err}`);
  }

  return res.json();
}

export function getAirwallexEnv(): "demo" | "prod" {
  return process.env.AIRWALLEX_ENV === "demo" ? "demo" : "prod";
}

// --- Subscription helpers ---

async function airwallexFetch(path: string, options: RequestInit = {}) {
  const token = await getAccessToken();
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Airwallex ${path} failed: ${err}`);
  }
  return res.json();
}

export async function createCustomer(params: {
  email: string;
  businessName: string;
  businessId: string;
}): Promise<{ id: string }> {
  return airwallexFetch("/api/v1/pa/customers/create", {
    method: "POST",
    body: JSON.stringify({
      email: params.email,
      business_name: params.businessName,
      merchant_customer_id: params.businessId,
      request_id: crypto.randomUUID(),
    }),
  });
}

export async function createPaymentConsent(params: {
  customerId: string;
  currency: string;
}): Promise<{ id: string; client_secret: string }> {
  return airwallexFetch("/api/v1/pa/payment_consents/create", {
    method: "POST",
    body: JSON.stringify({
      customer_id: params.customerId,
      currency: params.currency.toLowerCase(),
      merchant_trigger_reason: "scheduled",
      request_id: crypto.randomUUID(),
      next_triggered_by: "merchant",
      requires_payment_method: true,
    }),
  });
}

export async function createSubscription(params: {
  customerId: string;
  priceId: string;
  paymentConsentId: string;
}): Promise<{ id: string; status: string }> {
  return airwallexFetch("/api/v1/pa/subscriptions/create", {
    method: "POST",
    body: JSON.stringify({
      customer_id: params.customerId,
      items: [{ price_id: params.priceId, quantity: 1 }],
      payment_consent_id: params.paymentConsentId,
      request_id: crypto.randomUUID(),
    }),
  });
}

export async function cancelSubscription(subscriptionId: string): Promise<void> {
  await airwallexFetch(`/api/v1/pa/subscriptions/${subscriptionId}/cancel`, {
    method: "POST",
    body: JSON.stringify({ request_id: crypto.randomUUID() }),
  });
}

export async function getSubscription(subscriptionId: string): Promise<any> {
  return airwallexFetch(`/api/v1/pa/subscriptions/${subscriptionId}`, {
    method: "GET",
  });
}
