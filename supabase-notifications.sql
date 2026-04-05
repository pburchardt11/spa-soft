-- Notification System Tables
-- Run this in your Supabase SQL editor

-- Notification preferences per client per business
create table notification_preferences (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  client_id uuid references clients(id) on delete cascade not null,
  channel text not null check (channel in ('email', 'line', 'whatsapp')),
  identifier text not null, -- email address, LINE userId, or phone number (E.164)
  opted_in boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(business_id, client_id, channel)
);

-- Notification log for tracking what was sent
create table notification_log (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  client_id uuid references clients(id) on delete set null,
  booking_id uuid references bookings(id) on delete set null,
  channel text not null check (channel in ('email', 'line', 'whatsapp')),
  event text not null check (event in ('booking_confirmed', 'booking_reminder', 'booking_cancelled', 'booking_completed', 'welcome')),
  status text not null default 'pending' check (status in ('pending', 'sent', 'failed')),
  error_message text,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- Business notification settings (LINE/WhatsApp credentials per business)
create table notification_settings (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null unique,
  -- Email
  email_enabled boolean default true,
  email_from_name text, -- e.g. "Serenity Spa"
  -- LINE
  line_enabled boolean default false,
  line_channel_access_token text,
  line_channel_secret text,
  -- WhatsApp
  whatsapp_enabled boolean default false,
  whatsapp_access_token text,
  whatsapp_phone_number_id text,
  -- Reminder settings
  reminder_hours_before integer default 2,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_notif_pref_business on notification_preferences(business_id);
create index idx_notif_pref_client on notification_preferences(client_id);
create index idx_notif_log_business on notification_log(business_id);
create index idx_notif_log_booking on notification_log(booking_id);
create index idx_notif_log_status on notification_log(status, created_at);

-- RLS
alter table notification_preferences enable row level security;
alter table notification_log enable row level security;
alter table notification_settings enable row level security;

create policy "select_own_business" on notification_preferences
  for all using (business_id = get_my_business_id());

create policy "select_own_business" on notification_log
  for all using (business_id = get_my_business_id());

create policy "select_own_business" on notification_settings
  for all using (business_id = get_my_business_id());
