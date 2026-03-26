-- Fix infinite recursion in staff RLS policies
-- Replace self-referencing policies with ones using get_my_business_id() (SECURITY DEFINER)

drop policy if exists "staff_select_own_business" on staff;
drop policy if exists "staff_insert_own_business" on staff;
drop policy if exists "staff_update_own_business" on staff;

create policy "staff_select" on staff
  for select using (business_id = get_my_business_id());

create policy "staff_insert" on staff
  for insert with check (business_id = get_my_business_id());

create policy "staff_update" on staff
  for update using (business_id = get_my_business_id());

create policy "staff_delete" on staff
  for delete using (business_id = get_my_business_id());
