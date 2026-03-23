-- SpaSoft Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Businesses (multi-tenant)
create table businesses (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text,
  address text,
  timezone text default 'America/New_York',
  currency text default 'USD',
  stripe_customer_id text,
  stripe_subscription_id text,
  plan text default 'starter',
  created_at timestamptz default now()
);

-- Users/Staff
create table staff (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  auth_user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  role text default 'therapist' check (role in ('owner', 'manager', 'therapist', 'receptionist')),
  color text default '#7c3aed',
  active boolean default true,
  created_at timestamptz default now()
);

-- Services offered
create table services (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  description text,
  duration integer not null, -- minutes
  price numeric(10,2) not null,
  category text,
  active boolean default true,
  created_at timestamptz default now()
);

-- Clients
create table clients (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  email text,
  phone text,
  notes text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

-- Bookings
create table bookings (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  staff_id uuid references staff(id) on delete set null,
  service_id uuid references services(id) on delete set null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes text,
  created_at timestamptz default now()
);

-- Payments
create table payments (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  booking_id uuid references bookings(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  amount numeric(10,2) not null,
  currency text default 'USD',
  method text check (method in ('card', 'cash', 'apple_pay', 'google_pay', 'other')),
  status text default 'pending' check (status in ('pending', 'completed', 'refunded', 'failed')),
  stripe_payment_intent_id text,
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_staff_business on staff(business_id);
create index idx_services_business on services(business_id);
create index idx_clients_business on clients(business_id);
create index idx_bookings_business on bookings(business_id);
create index idx_bookings_start_time on bookings(start_time);
create index idx_bookings_staff on bookings(staff_id);
create index idx_bookings_client on bookings(client_id);
create index idx_payments_business on payments(business_id);
create index idx_payments_booking on payments(booking_id);

-- Row Level Security
alter table businesses enable row level security;
alter table staff enable row level security;
alter table services enable row level security;
alter table clients enable row level security;
alter table bookings enable row level security;
alter table payments enable row level security;

-- RLS Policies: users can only access their own business data
create policy "staff_select_own_business" on staff
  for select using (
    business_id in (
      select business_id from staff where auth_user_id = auth.uid()
    )
  );

create policy "staff_insert_own_business" on staff
  for insert with check (
    business_id in (
      select business_id from staff where auth_user_id = auth.uid()
    )
  );

create policy "staff_update_own_business" on staff
  for update using (
    business_id in (
      select business_id from staff where auth_user_id = auth.uid()
    )
  );

-- Helper function to get current user's business_id
create or replace function get_my_business_id()
returns uuid as $$
  select business_id from staff where auth_user_id = auth.uid() limit 1;
$$ language sql security definer;

-- Generic policies for other tables
create policy "select_own_business" on services
  for all using (business_id = get_my_business_id());

create policy "select_own_business" on clients
  for all using (business_id = get_my_business_id());

create policy "select_own_business" on bookings
  for all using (business_id = get_my_business_id());

create policy "select_own_business" on payments
  for all using (business_id = get_my_business_id());

create policy "select_own_business" on businesses
  for all using (id = get_my_business_id());

-- Seed data function (call after first user signup)
create or replace function seed_demo_data(p_business_id uuid)
returns void as $$
declare
  staff_emma uuid;
  staff_olivia uuid;
  staff_sophie uuid;
  staff_james uuid;
  svc_deep uuid;
  svc_hot uuid;
  svc_swedish uuid;
  svc_facial uuid;
  svc_aroma uuid;
  svc_couples uuid;
  svc_wrap uuid;
  client_ids uuid[];
begin
  -- Staff
  insert into staff (business_id, name, email, role, color) values
    (p_business_id, 'Emma W.', 'emma@spa.com', 'therapist', '#7c3aed') returning id into staff_emma;
  insert into staff (business_id, name, email, role, color) values
    (p_business_id, 'Olivia K.', 'olivia@spa.com', 'therapist', '#2563eb') returning id into staff_olivia;
  insert into staff (business_id, name, email, role, color) values
    (p_business_id, 'Sophie L.', 'sophie@spa.com', 'therapist', '#059669') returning id into staff_sophie;
  insert into staff (business_id, name, email, role, color) values
    (p_business_id, 'James R.', 'james@spa.com', 'therapist', '#d97706') returning id into staff_james;

  -- Services
  insert into services (business_id, name, duration, price, category) values
    (p_business_id, 'Deep Tissue Massage', 60, 120.00, 'Massage') returning id into svc_deep;
  insert into services (business_id, name, duration, price, category) values
    (p_business_id, 'Hot Stone Therapy', 90, 150.00, 'Massage') returning id into svc_hot;
  insert into services (business_id, name, duration, price, category) values
    (p_business_id, 'Swedish Massage', 60, 110.00, 'Massage') returning id into svc_swedish;
  insert into services (business_id, name, duration, price, category) values
    (p_business_id, 'Facial Treatment', 45, 85.00, 'Facial') returning id into svc_facial;
  insert into services (business_id, name, duration, price, category) values
    (p_business_id, 'Aromatherapy', 60, 95.00, 'Wellness') returning id into svc_aroma;
  insert into services (business_id, name, duration, price, category) values
    (p_business_id, 'Couples Massage', 90, 220.00, 'Massage') returning id into svc_couples;
  insert into services (business_id, name, duration, price, category) values
    (p_business_id, 'Body Wrap', 75, 130.00, 'Wellness') returning id into svc_wrap;

  -- Clients
  insert into clients (business_id, name, email, phone, tags) values
    (p_business_id, 'Sarah Johnson', 'sarah@email.com', '(555) 123-4567', '{VIP,Regular}'),
    (p_business_id, 'Michael Chen', 'michael@email.com', '(555) 234-5678', '{Regular}'),
    (p_business_id, 'Jessica Davis', 'jessica@email.com', '(555) 345-6789', '{Regular}'),
    (p_business_id, 'Robert Miller', 'robert@email.com', '(555) 456-7890', '{New}'),
    (p_business_id, 'Emily Wilson', 'emily@email.com', '(555) 567-8901', '{VIP,Regular}'),
    (p_business_id, 'David Brown', 'david@email.com', '(555) 678-9012', '{New}'),
    (p_business_id, 'Anna Lee', 'anna@email.com', '(555) 789-0123', '{Regular}'),
    (p_business_id, 'James Wilson', 'james.w@email.com', '(555) 890-1234', '{VIP,Loyalty}'),
    (p_business_id, 'Lisa Anderson', 'lisa@email.com', '(555) 901-2345', '{New}'),
    (p_business_id, 'Thomas Garcia', 'thomas@email.com', '(555) 012-3456', '{Regular,Loyalty}');

  -- Get client IDs for bookings
  select array_agg(id) into client_ids from clients where business_id = p_business_id;

  -- Sample bookings for today
  insert into bookings (business_id, client_id, staff_id, service_id, start_time, end_time, status) values
    (p_business_id, client_ids[1], staff_emma, svc_deep, now()::date + interval '9 hours', now()::date + interval '10 hours', 'confirmed'),
    (p_business_id, client_ids[2], staff_olivia, svc_hot, now()::date + interval '10 hours 30 minutes', now()::date + interval '12 hours', 'confirmed'),
    (p_business_id, client_ids[3], staff_sophie, svc_facial, now()::date + interval '11 hours', now()::date + interval '11 hours 45 minutes', 'pending'),
    (p_business_id, client_ids[4], staff_emma, svc_swedish, now()::date + interval '13 hours', now()::date + interval '14 hours', 'confirmed'),
    (p_business_id, client_ids[5], staff_olivia, svc_aroma, now()::date + interval '14 hours 30 minutes', now()::date + interval '15 hours 30 minutes', 'confirmed'),
    (p_business_id, client_ids[6], staff_james, svc_couples, now()::date + interval '15 hours', now()::date + interval '16 hours 30 minutes', 'pending'),
    (p_business_id, client_ids[7], staff_sophie, svc_wrap, now()::date + interval '16 hours', now()::date + interval '17 hours 15 minutes', 'confirmed');

  -- Sample payments
  insert into payments (business_id, booking_id, client_id, amount, method, status) values
    (p_business_id, (select id from bookings where business_id = p_business_id limit 1 offset 0), client_ids[1], 120.00, 'card', 'completed'),
    (p_business_id, (select id from bookings where business_id = p_business_id limit 1 offset 1), client_ids[2], 150.00, 'card', 'completed'),
    (p_business_id, (select id from bookings where business_id = p_business_id limit 1 offset 4), client_ids[5], 95.00, 'apple_pay', 'completed'),
    (p_business_id, (select id from bookings where business_id = p_business_id limit 1 offset 3), client_ids[4], 110.00, 'card', 'pending');
end;
$$ language plpgsql security definer;
