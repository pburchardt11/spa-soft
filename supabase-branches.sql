-- Multi-branch support
-- Run this in your Supabase SQL editor

-- Branches table
create table branches (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  address text,
  phone text,
  email text,
  timezone text,
  is_primary boolean default false,
  active boolean default true,
  created_at timestamptz default now()
);

create index idx_branches_business on branches(business_id);

-- RLS
alter table branches enable row level security;
create policy "branches_select" on branches for select using (business_id = get_my_business_id());
create policy "branches_insert" on branches for insert with check (business_id = get_my_business_id());
create policy "branches_update" on branches for update using (business_id = get_my_business_id());
create policy "branches_delete" on branches for delete using (business_id = get_my_business_id());

-- Add branch_id to existing tables
alter table staff add column if not exists branch_id uuid references branches(id) on delete set null;
alter table bookings add column if not exists branch_id uuid references branches(id) on delete set null;
alter table business_hours add column if not exists branch_id uuid references branches(id) on delete cascade;

create index if not exists idx_staff_branch on staff(branch_id);
create index if not exists idx_bookings_branch on bookings(branch_id);
create index if not exists idx_business_hours_branch on business_hours(branch_id);

-- Migration: create a default "Main" branch for every existing business
-- and assign existing staff/bookings/business_hours to it
do $$
declare
  biz record;
  new_branch_id uuid;
begin
  for biz in select id, name, address, phone, email, timezone from businesses loop
    -- Create primary branch for this business
    insert into branches (business_id, name, address, phone, email, timezone, is_primary)
    values (biz.id, coalesce(biz.name, 'Main Location'), biz.address, biz.phone, biz.email, biz.timezone, true)
    returning id into new_branch_id;

    -- Backfill branch_id on existing records
    update staff set branch_id = new_branch_id where business_id = biz.id and branch_id is null;
    update bookings set branch_id = new_branch_id where business_id = biz.id and branch_id is null;
    update business_hours set branch_id = new_branch_id where business_id = biz.id and branch_id is null;
  end loop;
end $$;
