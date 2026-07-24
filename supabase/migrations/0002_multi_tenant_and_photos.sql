create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  line_channel_id text unique not null,
  line_channel_secret text not null,
  line_channel_access_token text not null,
  calendar_id text,
  dashboard_username text unique not null,
  dashboard_password_hash text not null,
  created_at timestamptz not null default now()
);

alter table companies enable row level security;

-- company_id starts nullable so existing rows can be backfilled before
-- the NOT NULL constraint is added (see migration 0003).
alter table jobs add column if not exists company_id uuid references companies(id);
alter table jobs add column if not exists photo_path text;

create index if not exists jobs_company_id_status_idx
  on jobs (company_id, status);

insert into storage.buckets (id, name, public)
values ('job-photos', 'job-photos', false)
on conflict (id) do nothing;
