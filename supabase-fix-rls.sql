-- Fix RLS policies to use separate SELECT/INSERT/UPDATE/DELETE policies
-- The "for all" policy type can cause issues with inserts

-- Drop existing generic policies
drop policy if exists "select_own_business" on clients;
drop policy if exists "select_own_business" on services;
drop policy if exists "select_own_business" on bookings;
drop policy if exists "select_own_business" on payments;
drop policy if exists "select_own_business" on businesses;

-- Clients: separate policies
create policy "clients_select" on clients
  for select using (business_id = get_my_business_id());

create policy "clients_insert" on clients
  for insert with check (business_id = get_my_business_id());

create policy "clients_update" on clients
  for update using (business_id = get_my_business_id());

create policy "clients_delete" on clients
  for delete using (business_id = get_my_business_id());

-- Services: separate policies
create policy "services_select" on services
  for select using (business_id = get_my_business_id());

create policy "services_insert" on services
  for insert with check (business_id = get_my_business_id());

create policy "services_update" on services
  for update using (business_id = get_my_business_id());

create policy "services_delete" on services
  for delete using (business_id = get_my_business_id());

-- Bookings: separate policies
create policy "bookings_select" on bookings
  for select using (business_id = get_my_business_id());

create policy "bookings_insert" on bookings
  for insert with check (business_id = get_my_business_id());

create policy "bookings_update" on bookings
  for update using (business_id = get_my_business_id());

create policy "bookings_delete" on bookings
  for delete using (business_id = get_my_business_id());

-- Payments: separate policies
create policy "payments_select" on payments
  for select using (business_id = get_my_business_id());

create policy "payments_insert" on payments
  for insert with check (business_id = get_my_business_id());

create policy "payments_update" on payments
  for update using (business_id = get_my_business_id());

create policy "payments_delete" on payments
  for delete using (business_id = get_my_business_id());

-- Businesses: separate policies
create policy "businesses_select" on businesses
  for select using (id = get_my_business_id());

create policy "businesses_update" on businesses
  for update using (id = get_my_business_id());
