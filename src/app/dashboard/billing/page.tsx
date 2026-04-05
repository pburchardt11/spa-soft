import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/actions/helpers";
import BillingClient from "./billing-client";

export default async function BillingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let business = null;
  if (user) {
    const admin = await getAdminClient();
    const { data: staffRow } = await admin
      .from("staff")
      .select("business_id")
      .eq("auth_user_id", user.id)
      .single();

    if (staffRow) {
      const { data } = await admin
        .from("businesses")
        .select("id, name, email, plan, subscription_plan, subscription_status, airwallex_subscription_id, subscription_current_period_end")
        .eq("id", staffRow.business_id)
        .single();
      business = data;
    }
  }

  return <BillingClient business={business} />;
}
