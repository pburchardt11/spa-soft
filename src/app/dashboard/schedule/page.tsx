import { getAdminClient, getBusinessId } from "@/lib/actions/helpers";
import { getCurrentBranchId } from "@/lib/actions/branches";
import { createClient } from "@/lib/supabase/server";
import ScheduleClient from "./schedule-client";

export default async function SchedulePage() {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  const branchId = await getCurrentBranchId();
  const admin = await getAdminClient();

  if (!businessId) return <div className="p-8">No business found.</div>;

  let hoursQuery = supabase
    .from("business_hours")
    .select("*")
    .order("day_of_week");
  if (branchId) hoursQuery = hoursQuery.eq("branch_id", branchId);
  const { data: hours } = await hoursQuery;

  const { data: shifts } = await supabase
    .from("shifts")
    .select("*")
    .order("start_time");

  let staffQuery = admin
    .from("staff")
    .select("id, name, color, role")
    .eq("business_id", businessId)
    .eq("active", true)
    .order("name");
  if (branchId) staffQuery = staffQuery.eq("branch_id", branchId);
  const { data: staffList } = await staffQuery;

  const { data: schedules } = await admin
    .from("staff_schedules")
    .select("id, staff_id, day_of_week, shift_id")
    .eq("business_id", businessId);

  const { data: absences } = await admin
    .from("staff_absences")
    .select("*")
    .eq("business_id", businessId)
    .order("date");

  return (
    <ScheduleClient
      initialHours={hours || []}
      initialShifts={shifts || []}
      staffList={staffList || []}
      initialSchedules={schedules || []}
      initialAbsences={absences || []}
    />
  );
}
