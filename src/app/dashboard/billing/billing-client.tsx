"use client";

import { useState } from "react";
import { Check, CreditCard, Loader2, AlertCircle } from "lucide-react";

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: 0,
    desc: "For solo practitioners",
    items: [
      "Up to 50 bookings/mo",
      "1 staff member",
      "Basic analytics",
      "Email support",
    ],
  },
  {
    id: "professional",
    name: "Professional",
    price: 49,
    desc: "For growing spas",
    items: [
      "Unlimited bookings",
      "Up to 10 staff",
      "Full CRM & analytics",
      "Payment processing",
      "LINE & WhatsApp notifications",
      "Priority support",
    ],
    featured: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 149,
    desc: "For multi-location spas",
    items: [
      "Everything in Professional",
      "Unlimited staff",
      "Multi-location support",
      "Custom integrations",
      "Dedicated account manager",
    ],
  },
];

type Business = {
  id: string;
  name: string;
  email: string;
  subscription_plan: string;
  subscription_status: string;
  airwallex_subscription_id: string | null;
  subscription_current_period_end: string | null;
};

export default function BillingClient({ business }: { business: Business | null }) {
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const currentPlan = business?.subscription_plan || "starter";
  const isActive = business?.subscription_status === "active";

  async function handleSubscribe(planId: string) {
    if (!business || planId === "starter") return;
    setLoading(true);
    setError(null);

    try {
      // Step 1: Create payment consent
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: business.id, plan: planId }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
        setLoading(false);
        return;
      }

      // Step 2: Load Airwallex to verify the payment consent (save card)
      const { createElement, init } = await import("@airwallex/components-sdk");
      await init({
        env: data.env,
        origin: window.location.origin,
      });

      const element = await createElement("dropIn", {
        customer_id: data.customer_id,
        payment_consent: data.consent_id,
        client_secret: data.client_secret,
        currency: "usd",
        mode: "recurring",
        methods: ["card"],
      });

      element?.mount("airwallex-subscribe");
      setLoading(false);

      // Listen for success
      const handleSuccess = async () => {
        setLoading(true);
        // Step 3: Confirm subscription
        const confirmRes = await fetch("/api/subscription/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            business_id: business.id,
            consent_id: data.consent_id,
          }),
        });
        const confirmData = await confirmRes.json();

        if (confirmData.error) {
          setError(confirmData.error);
        } else {
          setSuccess(`Successfully subscribed to ${planId.charAt(0).toUpperCase() + planId.slice(1)}!`);
          setTimeout(() => window.location.reload(), 2000);
        }
        setLoading(false);
        window.removeEventListener("onSuccess", handleSuccess);
      };
      window.addEventListener("onSuccess", handleSuccess);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!business || !confirm("Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.")) return;
    setCancelling(true);
    setError(null);

    try {
      const res = await fetch("/api/subscription", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business_id: business.id }),
      });
      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess("Subscription cancelled. You'll retain access until the end of your billing period.");
        setTimeout(() => window.location.reload(), 2000);
      }
    } catch (err) {
      setError("Failed to cancel subscription");
    }
    setCancelling(false);
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Billing & Plan</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your subscription and billing
        </p>
      </div>

      {/* Current plan banner */}
      {isActive && (
        <div className="bg-violet-50 border border-violet-200 rounded-xl p-5 mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current plan</p>
            <p className="text-xl font-bold text-violet-700 capitalize">{currentPlan}</p>
            {business?.subscription_current_period_end && (
              <p className="text-xs text-gray-500 mt-1">
                Next billing date: {new Date(business.subscription_current_period_end).toLocaleDateString()}
              </p>
            )}
          </div>
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="text-sm text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
          >
            {cancelling ? "Cancelling..." : "Cancel subscription"}
          </button>
        </div>
      )}

      {business?.subscription_status === "cancelled" && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <p className="text-sm text-amber-800">
            Your subscription has been cancelled. Select a plan below to resubscribe.
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 text-sm text-red-700 bg-red-50 rounded-lg flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-3 text-sm text-green-700 bg-green-50 rounded-lg flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {plans.map((plan) => {
          const isCurrent = currentPlan === plan.id && isActive;
          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 flex flex-col ${
                plan.featured
                  ? "border-violet-600 ring-2 ring-violet-600"
                  : "border-gray-200"
              } ${isCurrent ? "bg-violet-50" : "bg-white"}`}
            >
              <h3 className="font-semibold text-lg">{plan.name}</h3>
              <p className="text-sm text-gray-500">{plan.desc}</p>
              <p className="mt-4 text-4xl font-bold">
                {plan.price === 0 ? "Free" : `$${plan.price}`}
                {plan.price > 0 && (
                  <span className="text-base font-normal text-gray-500">/mo</span>
                )}
              </p>
              <ul className="mt-6 space-y-2 flex-1">
                {plan.items.map((item) => (
                  <li key={item} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-violet-600 mt-0.5">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              {isCurrent ? (
                <div className="mt-6 text-center py-2.5 rounded-lg font-medium text-sm bg-violet-100 text-violet-700">
                  Current plan
                </div>
              ) : plan.id === "starter" && !isActive ? (
                <div className="mt-6 text-center py-2.5 rounded-lg font-medium text-sm bg-gray-100 text-gray-500">
                  Free plan (active)
                </div>
              ) : plan.id === "starter" ? (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="mt-6 block text-center py-2.5 rounded-lg font-medium text-sm border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Downgrade
                </button>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={loading}
                  className={`mt-6 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition disabled:opacity-50 ${
                    plan.featured
                      ? "bg-violet-600 text-white hover:bg-violet-700"
                      : "border border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <CreditCard className="h-4 w-4" />
                  )}
                  {isCurrent ? "Current" : isActive ? "Switch plan" : "Subscribe"}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Airwallex payment mount point */}
      <div id="airwallex-subscribe" />

      <p className="text-xs text-gray-400 text-center">
        Payments processed securely by Airwallex. Cancel anytime.
      </p>
    </div>
  );
}
