"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getBusinessId, getAdminClient } from "./helpers";

// ─── Business Hours ───

export async function getBusinessHours() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("business_hours")
    .select("*")
    .order("day_of_week");
  return data || [];
}

export async function saveBusinessHours(hours: { day_of_week: number; is_open: boolean; open_time: string; close_time: string }[]) {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  // Delete existing and re-insert
  await supabase.from("business_hours").delete().eq("business_id", businessId);
  const { error } = await supabase.from("business_hours").insert(
    hours.map((h) => ({ business_id: businessId, ...h }))
  );

  if (error) return { error: error.message };
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

// ─── Shifts ───

export async function getShifts() {
  const supabase = await createClient();
  const { data } = await supabase.from("shifts").select("*").order("start_time");
  return data || [];
}

export async function createShift(formData: FormData) {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const { error } = await supabase.from("shifts").insert({
    business_id: businessId,
    name: formData.get("name") as string,
    start_time: formData.get("start_time") as string,
    end_time: formData.get("end_time") as string,
    color: (formData.get("color") as string) || "#7c3aed",
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

export async function deleteShift(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("shifts").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

// ─── Staff Schedules ───

export async function getStaffSchedules() {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return [];

  const { data } = await admin
    .from("staff_schedules")
    .select("*, staff:staff(id, name, color), shift:shifts(id, name, start_time, end_time, color)")
    .eq("business_id", businessId);
  return data || [];
}

export async function setStaffShift(staffId: string, dayOfWeek: number, shiftId: string | null) {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  // Remove existing assignment for this staff+day
  await supabase
    .from("staff_schedules")
    .delete()
    .eq("staff_id", staffId)
    .eq("day_of_week", dayOfWeek);

  // Insert new if shiftId provided
  if (shiftId) {
    const { error } = await supabase.from("staff_schedules").insert({
      business_id: businessId,
      staff_id: staffId,
      day_of_week: dayOfWeek,
      shift_id: shiftId,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/dashboard/schedule");
  return { success: true };
}

// ─── Absences ───

export async function getStaffAbsences(month?: string) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return [];

  let query = admin
    .from("staff_absences")
    .select("*, staff:staff(id, name)")
    .eq("business_id", businessId)
    .order("date");

  if (month) {
    const start = `${month}-01`;
    const end = `${month}-31`;
    query = query.gte("date", start).lte("date", end);
  }

  const { data } = await query;
  return data || [];
}

export async function addAbsence(staffId: string, date: string, type: string, notes?: string) {
  const supabase = await createClient();
  const businessId = await getBusinessId();
  if (!businessId) return { error: "No business found" };

  const { error } = await supabase.from("staff_absences").insert({
    business_id: businessId,
    staff_id: staffId,
    date,
    type,
    notes: notes || null,
  });

  if (error) return { error: error.message };
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

export async function removeAbsence(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("staff_absences").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/dashboard/schedule");
  return { success: true };
}

// ─── Reports ───

export async function getMonthlyReport(month: string) {
  const admin = await getAdminClient();
  const businessId = await getBusinessId();
  if (!businessId) return [];

  // Get all active staff
  const { data: staffList } = await admin
    .from("staff")
    .select("id, name")
    .eq("business_id", businessId)
    .eq("active", true)
    .in("role", ["therapist", "manager", "owner"])
    .order("name");

  // Get absences for the month
  const { data: absences } = await admin
    .from("staff_absences")
    .select("staff_id, type")
    .eq("business_id", businessId)
    .gte("date", `${month}-01`)
    .lte("date", `${month}-31`);

  // Get staff schedules
  const { data: schedules } = await admin
    .from("staff_schedules")
    .select("staff_id, day_of_week")
    .eq("business_id", businessId);

  // Calculate working days in month
  const [year, mon] = month.split("-").map(Number);
  const daysInMonth = new Date(year, mon, 0).getDate();

  return (staffList || []).map((staff) => {
    const staffScheduleDays = new Set(
      (schedules || [])
        .filter((s) => s.staff_id === staff.id)
        .map((s) => s.day_of_week)
    );

    // Count scheduled work days in this month
    let scheduledDays = 0;
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, mon - 1, d).getDay();
      if (staffScheduleDays.has(dow)) scheduledDays++;
    }

    const staffAbsences = (absences || []).filter((a) => a.staff_id === staff.id);
    const leave = staffAbsences.filter((a) => a.type === "leave").length;
    const sick = staffAbsences.filter((a) => a.type === "sick").length;
    const absent = staffAbsences.filter((a) => a.type === "absent").length;
    const worked = scheduledDays - leave - sick - absent;

    return {
      id: staff.id,
      name: staff.name,
      scheduledDays,
      worked: Math.max(0, worked),
      leave,
      sick,
      absent,
    };
  });
}
