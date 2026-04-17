-- =============================================
-- supabase-schema.sql — v2
-- شغّله في SQL Editor في Supabase
-- =============================================

create table if not exists letters (
  id uuid default gen_random_uuid() primary key,
  letter_number text not null,
  letter_prefix text,
  letter_type text,
  letter_year text,
  sender text default 'Admin',
  status text default 'pending',
  client_name text default 'N/A',
  client_phone text default 'N/A',
  responsible text default 'N/A',
  service text default 'N/A',
  product_description text default 'N/A',
  quantity text default 'N/A',
  sale_price text default 'N/A',
  shipped_to_account text default 'N/A',
  shipped_from_account text default 'N/A',
  experience_rating text default 'N/A',
  notes text default 'N/A',
  improvements text default 'N/A',
  receipt_url text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table letters add column if not exists sender text default 'Admin';
alter table letters add column if not exists status text default 'pending';

alter table letters enable row level security;
drop policy if exists "full access" on letters;
create policy "full access" on letters for all using (true);

insert into storage.buckets (id, name, public)
values ('receipts', 'receipts', true)
on conflict (id) do nothing;

drop policy if exists "receipts access" on storage.objects;
create policy "receipts access" on storage.objects
for all using (bucket_id = 'receipts');
