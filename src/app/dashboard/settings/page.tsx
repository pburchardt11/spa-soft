import { createClient } from "@/lib/supabase/server";
import SettingsClient from "./settings-client";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let business = null;
  if (user) {
    const { data: staffRow } = await supabase
      .from("staff")
      .select("business_id")
      .eq("auth_user_id", user.id)
      .single();

    if (staffRow) {
      const { data } = await supabase
        .from("businesses")
        .select("*")
        .eq("id", staffRow.business_id)
        .single();
      business = data;
    }
  }

  return <SettingsClient business={business} />;
}
