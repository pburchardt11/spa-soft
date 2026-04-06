-- Products and product sales (retail / inventory)
-- Run this in your Supabase SQL editor

create table products (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete cascade,
  name text not null,
  description text,
  sku text,
  category text,
  price numeric(10,2) not null,
  cost numeric(10,2),
  stock integer default 0,
  low_stock_threshold integer default 5,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table product_sales (
  id uuid primary key default uuid_generate_v4(),
  business_id uuid references businesses(id) on delete cascade not null,
  branch_id uuid references branches(id) on delete set null,
  product_id uuid references products(id) on delete set null,
  client_id uuid references clients(id) on delete set null,
  staff_id uuid references staff(id) on delete set null,
  booking_id uuid references bookings(id) on delete set null,
  quantity integer not null default 1,
  unit_price numeric(10,2) not null,
  total numeric(10,2) not null,
  payment_method text check (payment_method in ('card', 'cash', 'apple_pay', 'google_pay', 'promptpay', 'airwallex', 'other')),
  notes text,
  created_at timestamptz default now()
);

-- Indexes
create index idx_products_business on products(business_id);
create index idx_products_branch on products(branch_id);
create index idx_products_active on products(active);
create index idx_product_sales_business on product_sales(business_id);
create index idx_product_sales_branch on product_sales(branch_id);
create index idx_product_sales_product on product_sales(product_id);
create index idx_product_sales_client on product_sales(client_id);
create index idx_product_sales_created on product_sales(created_at desc);

-- RLS
alter table products enable row level security;
alter table product_sales enable row level security;

create policy "products_all" on products for all using (business_id = get_my_business_id());
create policy "product_sales_all" on product_sales for all using (business_id = get_my_business_id());
