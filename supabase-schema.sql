-- =============================================
-- قاعدة بيانات نظام SYK
-- شغّل هذا الكود في Supabase SQL Editor
-- =============================================

create table letters (
  id uuid default gen_random_uuid() primary key,
  letter_number text not null,          -- رقم الخطاب مثل 001-LC-2026
  letter_prefix text,                   -- 000 الى 100
  letter_type text,                     -- LC او ST
  letter_year text,                     -- 2026 الى 2040
  -- بيانات العميل
  client_name text default 'N/A',
  client_phone text default 'N/A',
  responsible text default 'N/A',
  -- تفاصيل المنتج الرقمي
  service text default 'N/A',
  product_description text default 'N/A',
  -- القسم المالي
  quantity text default 'N/A',
  sale_price text default 'N/A',
  shipped_to_account text default 'N/A',
  shipped_from_account text default 'N/A',
  -- تقييم العميل
  experience_rating text default 'N/A',
  notes text default 'N/A',
  improvements text default 'N/A',
  -- الايصال
  receipt_url text,
  -- التواريخ
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- تفعيل RLS
alter table letters enable row level security;

-- سياسة: الادمن فقط يقدر يشوف ويعدل
create policy "Admin full access" on letters
  for all using (true);

-- تخزين الايصالات
insert into storage.buckets (id, name, public) values ('receipts', 'receipts', false);

create policy "Admin can upload receipts" on storage.objects
  for all using (bucket_id = 'receipts');
