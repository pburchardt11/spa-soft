-- Subscription fields for businesses
-- Run this in your Supabase SQL editor

alter table businesses add column if not exists airwallex_customer_id text;
alter table businesses add column if not exists airwallex_subscription_id text;
alter table businesses add column if not exists airwallex_payment_consent_id text;
alter table businesses add column if not exists subscription_status text default 'free' check (subscription_status in ('free', 'active', 'cancelled', 'past_due'));
alter table businesses add column if not exists subscription_plan text default 'starter' check (subscription_plan in ('starter', 'professional', 'enterprise'));
alter table businesses add column if not exists subscription_current_period_end timestamptz;
