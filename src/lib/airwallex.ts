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
