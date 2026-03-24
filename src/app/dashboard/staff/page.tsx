import { createClient } from "@/lib/supabase/server";
import StaffClient from "./staff-client";

export default async function StaffPage() {
  const supabase = await createClient();

  const { data: staff } = await supabase
    .from("staff")
    .select("*")
    .order("name");

  return <StaffClient initialStaff={staff || []} />;
}
