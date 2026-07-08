-- Ma5zn ERP database schema for Supabase/PostgreSQL.
-- Run this file before database/seed.sql.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  constraint users_username_not_blank check (length(trim(username)) > 0),
  constraint users_password_hash_not_blank check (length(trim(password_hash)) > 0)
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  model_name text not null,
  category text not null,
  color text not null,
  material text,
  brand text,
  notes text,
  created_at timestamptz not null default now(),
  constraint products_model_name_not_blank check (length(trim(model_name)) > 0),
  constraint products_category_not_blank check (length(trim(category)) > 0),
  constraint products_color_not_blank check (length(trim(color)) > 0)
);

create table if not exists public.product_sizes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  quantity integer not null default 0,
  minimum_quantity integer not null default 0,
  created_at timestamptz not null default now(),
  constraint product_sizes_size_not_blank check (length(trim(size)) > 0),
  constraint product_sizes_quantity_not_negative check (quantity >= 0),
  constraint product_sizes_minimum_not_negative check (minimum_quantity >= 0),
  constraint product_sizes_product_size_unique unique (product_id, size)
);

create table if not exists public.packaging_items (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  quantity integer not null default 0,
  minimum_quantity integer not null default 0,
  created_at timestamptz not null default now(),
  constraint packaging_items_name_not_blank check (length(trim(name)) > 0),
  constraint packaging_items_quantity_not_negative check (quantity >= 0),
  constraint packaging_items_minimum_not_negative check (minimum_quantity >= 0)
);

create table if not exists public.inventory_transactions (
  id uuid primary key default gen_random_uuid(),
  item_type text not null,
  item_id uuid not null,
  product_size_id uuid references public.product_sizes(id) on delete set null,
  transaction_type text not null,
  quantity integer not null,
  balance_before integer not null,
  balance_after integer not null,
  supplier_or_receiver text,
  reason text,
  notes text,
  created_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  constraint inventory_transactions_item_type_valid check (item_type in ('shoe', 'packaging')),
  constraint inventory_transactions_type_valid check (transaction_type in ('IN', 'OUT')),
  constraint inventory_transactions_quantity_positive check (quantity > 0),
  constraint inventory_transactions_balance_before_not_negative check (balance_before >= 0),
  constraint inventory_transactions_balance_after_not_negative check (balance_after >= 0),
  constraint inventory_transactions_shoe_has_size check (
    (item_type = 'shoe' and product_size_id is not null)
    or (item_type = 'packaging' and product_size_id is null)
  ),
  constraint inventory_transactions_balance_math check (
    (transaction_type = 'IN' and balance_after = balance_before + quantity)
    or (transaction_type = 'OUT' and balance_after = balance_before - quantity)
  )
);

create index if not exists idx_products_model_name on public.products using btree (model_name);
create index if not exists idx_products_category on public.products using btree (category);
create index if not exists idx_products_brand on public.products using btree (brand);
create index if not exists idx_product_sizes_product_id on public.product_sizes using btree (product_id);
create index if not exists idx_product_sizes_size on public.product_sizes using btree (size);
create index if not exists idx_packaging_items_name on public.packaging_items using btree (name);
create index if not exists idx_inventory_transactions_created_at on public.inventory_transactions using btree (created_at desc);
create index if not exists idx_inventory_transactions_item_type on public.inventory_transactions using btree (item_type);
create index if not exists idx_inventory_transactions_transaction_type on public.inventory_transactions using btree (transaction_type);
create index if not exists idx_inventory_transactions_product_size_id on public.inventory_transactions using btree (product_size_id);
create index if not exists idx_inventory_transactions_created_by on public.inventory_transactions using btree (created_by);

