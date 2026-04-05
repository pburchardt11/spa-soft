-- Deposit settings for businesses
-- Run this in your Supabase SQL editor

-- Add deposit columns to businesses table
alter table businesses add column if not exists deposit_enabled boolean default false;
alter table businesses add column if not exists deposit_type text default 'percentage' check (deposit_type in ('percentage', 'fixed'));
alter table businesses add column if not exists deposit_value numeric(10,2) default 30; -- 30% or fixed amount

-- Add Airwallex payment intent ID to bookings
alter table bookings add column if not exists deposit_amount numeric(10,2);
alter table bookings add column if not exists airwallex_payment_intent_id text;

-- Update payments table to support Airwallex
alter table payments drop constraint if exists payments_method_check;
alter table payments add constraint payments_method_check
  check (method in ('card', 'cash', 'apple_pay', 'google_pay', 'promptpay', 'airwallex', 'other'));
