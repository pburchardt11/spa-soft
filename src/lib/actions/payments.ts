"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

export async function getPayments() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payments")
    .select("*, client:clients(name), booking:bookings(*, service:services(name))")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function getPaymentStats() {
  const supabase = await createClient();

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: monthPayments } = await supabase
    .from("payments")
    .select("amount, status")
    .gte("created_at", startOfMonth);

  const completed = (monthPayments || []).filter((p) => p.status === "completed");
  const pending = (monthPayments || []).filter((p) => p.status === "pending");

  const revenue = completed.reduce((s, p) => s + Number(p.amount), 0);
  const outstanding = pending.reduce((s, p) => s + Number(p.amount), 0);

  return {
    revenue,
    transactions: completed.length,
    avgTransaction: completed.length > 0 ? revenue / completed.length : 0,
    outstanding,
    pendingCount: pending.length,
  };
}

export async function createPaymentIntent(bookingId: string) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*, service:services(price, name), client:clients(name, email)")
    .eq("id", bookingId)
    .single();

  if (!booking || !booking.service) {
    return { error: "Booking not found" };
  }

  const paymentIntent = await getStripe().paymentIntents.create({
    amount: Math.round(booking.service.price * 100),
    currency: "usd",
    metadata: {
      booking_id: bookingId,
      client_name: booking.client?.name || "",
      service_name: booking.service.name,
    },
  });

  return { clientSecret: paymentIntent.client_secret };
}

export async function recordCashPayment(bookingId: string, amount: number) {
  const supabase = await createClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("business_id, client_id")
    .eq("id", bookingId)
    .single();

  if (!booking) return { error: "Booking not found" };

  const { error } = await supabase.from("payments").insert({
    business_id: booking.business_id,
    booking_id: bookingId,
    client_id: booking.client_id,
    amount,
    method: "cash",
    status: "completed",
  });

  if (error) return { error: error.message };
  return { success: true };
}
