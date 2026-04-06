-- Staff commission tracking
-- Run this in your Supabase SQL editor

alter table staff add column if not exists commission_rate numeric(5,2) default 0 check (commission_rate >= 0 and commission_rate <= 100);

alter table services add column if not exists commission_rate numeric(5,2) check (commission_rate is null or (commission_rate >= 0 and commission_rate <= 100));
