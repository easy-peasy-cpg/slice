-- Slice: Retail Sales Intelligence
-- Run this in the Supabase SQL editor to set up the required tables

-- SKUs (products you sell at retail)
create table if not exists skus (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  sku_code text,
  active boolean default true,
  created_at timestamptz default now()
);
alter table skus enable row level security;
create policy "users can manage their own skus"
  on skus for all using (auth.uid() = user_id);

-- Stores (retail doors)
create table if not exists stores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  retailer text,      -- e.g. 'Whole Foods', 'Sprouts', 'HEB'
  location text,      -- e.g. 'Austin, TX'
  active boolean default true,
  created_at timestamptz default now()
);
alter table stores enable row level security;
create policy "users can manage their own stores"
  on stores for all using (auth.uid() = user_id);

-- Weekly sales reports
create table if not exists sales_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  sku_id uuid references skus(id) on delete cascade not null,
  store_id uuid references stores(id) on delete cascade not null,
  week_start date not null,   -- ISO date of the Monday that starts the week
  units_sold numeric default 0,
  created_at timestamptz default now(),
  unique (user_id, sku_id, store_id, week_start)
);
alter table sales_reports enable row level security;
create policy "users can manage their own sales reports"
  on sales_reports for all using (auth.uid() = user_id);
