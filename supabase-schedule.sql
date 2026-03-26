-- Spa Timings & Staff Schedule Schema

-- Business opening hours per day of week (0=Sunday, 6=Saturday)
create table business_hours (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  is_open boolean default true,
  open_time time not null default '09:00',
  close_time time not null default '18:00',
  unique(business_id, day_of_week)
);

-- Shift definitions
create table shifts (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  name text not null,
  start_time time not null,
  end_time time not null,
  color text default '#7c3aed',
  created_at timestamptz default now()
);

-- Staff default shift assignments per day of week
create table staff_schedules (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  staff_id uuid references staff(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week between 0 and 6),
  shift_id uuid references shifts(id) on delete cascade not null,
  unique(staff_id, day_of_week)
);

-- Staff absences (leave, sick, other)
create table staff_absences (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  staff_id uuid references staff(id) on delete cascade not null,
  date date not null,
  type text not null check (type in ('leave', 'sick', 'absent')),
  notes text,
  created_at timestamptz default now(),
  unique(staff_id, date)
);

-- Indexes
create index idx_business_hours_biz on business_hours(business_id);
create index idx_shifts_biz on shifts(business_id);
create index idx_staff_schedules_biz on staff_schedules(business_id);
create index idx_staff_schedules_staff on staff_schedules(staff_id);
create index idx_staff_absences_biz on staff_absences(business_id);
create index idx_staff_absences_staff on staff_absences(staff_id);
create index idx_staff_absences_date on staff_absences(date);

-- RLS
alter table business_hours enable row level security;
alter table shifts enable row level security;
alter table staff_schedules enable row level security;
alter table staff_absences enable row level security;

create policy "bh_select" on business_hours for select using (business_id = get_my_business_id());
create policy "bh_insert" on business_hours for insert with check (business_id = get_my_business_id());
create policy "bh_update" on business_hours for update using (business_id = get_my_business_id());
create policy "bh_delete" on business_hours for delete using (business_id = get_my_business_id());

create policy "shifts_select" on shifts for select using (business_id = get_my_business_id());
create policy "shifts_insert" on shifts for insert with check (business_id = get_my_business_id());
create policy "shifts_update" on shifts for update using (business_id = get_my_business_id());
create policy "shifts_delete" on shifts for delete using (business_id = get_my_business_id());

create policy "ss_select" on staff_schedules for select using (business_id = get_my_business_id());
create policy "ss_insert" on staff_schedules for insert with check (business_id = get_my_business_id());
create policy "ss_update" on staff_schedules for update using (business_id = get_my_business_id());
create policy "ss_delete" on staff_schedules for delete using (business_id = get_my_business_id());

create policy "sa_select" on staff_absences for select using (business_id = get_my_business_id());
create policy "sa_insert" on staff_absences for insert with check (business_id = get_my_business_id());
create policy "sa_update" on staff_absences for update using (business_id = get_my_business_id());
create policy "sa_delete" on staff_absences for delete using (business_id = get_my_business_id());
