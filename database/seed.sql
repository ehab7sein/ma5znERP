-- Ma5zn ERP seed data for Supabase/PostgreSQL.
-- Run this file after database/schema.sql.

create extension if not exists pgcrypto;

insert into public.users (username, password_hash)
values (
  'admin',
  crypt('01275924043Ee$', gen_salt('bf', 10))
)
on conflict (username) do update
set password_hash = excluded.password_hash;

insert into public.packaging_items (name, quantity, minimum_quantity)
values
  ('علبة رجالي', 0, 10),
  ('علبة حريمي', 0, 10),
  ('علبة أطفال', 0, 10),
  ('كيس', 0, 25),
  ('استيكر', 0, 50),
  ('ورق تغليف', 0, 20)
on conflict (name) do nothing;
