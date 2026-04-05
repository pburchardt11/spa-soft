-- Fix RLS for schedule tables (shifts, staff_schedules, business_hours, staff_absences)
-- These tables were missing RLS, flagged by Supabase Security Advisor on 30 Mar 2026
-- Run this in the Supabase SQL Editor

-- Enable RLS
ALTER TABLE public.shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_hours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_absences ENABLE ROW LEVEL SECURITY;

-- Shifts
CREATE POLICY "shifts_select" ON public.shifts FOR SELECT USING (business_id = get_my_business_id());
CREATE POLICY "shifts_insert" ON public.shifts FOR INSERT WITH CHECK (business_id = get_my_business_id());
CREATE POLICY "shifts_update" ON public.shifts FOR UPDATE USING (business_id = get_my_business_id());
CREATE POLICY "shifts_delete" ON public.shifts FOR DELETE USING (business_id = get_my_business_id());

-- Staff schedules
CREATE POLICY "staff_schedules_select" ON public.staff_schedules FOR SELECT USING (business_id = get_my_business_id());
CREATE POLICY "staff_schedules_insert" ON public.staff_schedules FOR INSERT WITH CHECK (business_id = get_my_business_id());
CREATE POLICY "staff_schedules_update" ON public.staff_schedules FOR UPDATE USING (business_id = get_my_business_id());
CREATE POLICY "staff_schedules_delete" ON public.staff_schedules FOR DELETE USING (business_id = get_my_business_id());

-- Business hours
CREATE POLICY "business_hours_select" ON public.business_hours FOR SELECT USING (business_id = get_my_business_id());
CREATE POLICY "business_hours_insert" ON public.business_hours FOR INSERT WITH CHECK (business_id = get_my_business_id());
CREATE POLICY "business_hours_update" ON public.business_hours FOR UPDATE USING (business_id = get_my_business_id());
CREATE POLICY "business_hours_delete" ON public.business_hours FOR DELETE USING (business_id = get_my_business_id());

-- Staff absences
CREATE POLICY "staff_absences_select" ON public.staff_absences FOR SELECT USING (business_id = get_my_business_id());
CREATE POLICY "staff_absences_insert" ON public.staff_absences FOR INSERT WITH CHECK (business_id = get_my_business_id());
CREATE POLICY "staff_absences_update" ON public.staff_absences FOR UPDATE USING (business_id = get_my_business_id());
CREATE POLICY "staff_absences_delete" ON public.staff_absences FOR DELETE USING (business_id = get_my_business_id());
