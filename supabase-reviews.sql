-- Reviews table
-- Run this in your Supabase SQL editor

create table reviews (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete set null,
  booking_id uuid references bookings(id) on delete set null unique,
  client_id uuid references clients(id) on delete set null,
  staff_id uuid references staff(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  status text default 'approved' check (status in ('pending', 'approved', 'hidden')),
  created_at timestamptz default now()
);

create index idx_reviews_business on reviews(business_id);
create index idx_reviews_branch on reviews(branch_id);
create index idx_reviews_staff on reviews(staff_id);
create index idx_reviews_booking on reviews(booking_id);
create index idx_reviews_rating on reviews(rating);
create index idx_reviews_created on reviews(created_at desc);

-- RLS
alter table reviews enable row level security;

create policy "reviews_select" on reviews for select using (business_id = get_my_business_id());
create policy "reviews_update" on reviews for update using (business_id = get_my_business_id());
create policy "reviews_delete" on reviews for delete using (business_id = get_my_business_id());
-- Note: inserts happen via admin client (service role) from the public review form

-- Update notification_log event check to include review_request
alter table notification_log drop constraint if exists notification_log_event_check;
alter table notification_log add constraint notification_log_event_check
  check (event in ('booking_confirmed', 'booking_reminder', 'booking_cancelled', 'booking_completed', 'welcome', 'review_request'));
