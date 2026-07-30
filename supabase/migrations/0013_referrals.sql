alter table companies add column if not exists referral_code text unique;

create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  referrer_company_id uuid not null references companies(id),
  referred_company_id uuid not null unique references companies(id),
  status text not null default 'pending',
  paid_invoice_count integer not null default 0,
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index if not exists referrals_referrer_idx on referrals (referrer_company_id, status);

alter table referrals enable row level security;

update companies
set referral_code = upper(substr(md5(id::text || clock_timestamp()::text), 1, 8))
where referral_code is null;
