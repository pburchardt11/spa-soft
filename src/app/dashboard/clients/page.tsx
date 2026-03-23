import { createClient } from "@/lib/supabase/server";
import ClientsClient from "./clients-client";

export default async function ClientsPage() {
  const supabase = await createClient();

  const { data: clients } = await supabase
    .from("clients")
    .select("*")
    .order("name");

  // Enrich with stats
  const enriched = await Promise.all(
    (clients || []).map(async (client) => {
      const { count: visits } = await supabase
        .from("bookings")
        .select("*", { count: "exact", head: true })
        .eq("client_id", client.id)
        .in("status", ["confirmed", "completed"]);

      const { data: lastBooking } = await supabase
        .from("bookings")
        .select("start_time")
        .eq("client_id", client.id)
        .order("start_time", { ascending: false })
        .limit(1)
        .single();

      const { data: payments } = await supabase
        .from("payments")
        .select("amount")
        .eq("client_id", client.id)
        .eq("status", "completed");

      const totalSpent = (payments || []).reduce(
        (sum, p) => sum + Number(p.amount),
        0
      );

      return {
        ...client,
        visits: visits || 0,
        lastVisit: lastBooking?.start_time || null,
        totalSpent,
      };
    })
  );

  return <ClientsClient initialClients={enriched} />;
}
