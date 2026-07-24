create extension if not exists pgcrypto;

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  line_user_id text not null,
  name text,
  phone text,
  address text,
  work_type text,
  urgency text not null default 'normal',
  status text not null default 'collecting',
  calendar_event_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists jobs_line_user_id_status_idx
  on jobs (line_user_id, status);

alter table jobs enable row level security;
