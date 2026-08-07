create table if not exists note_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body_json jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table note_posts drop column if exists url;

alter table note_posts enable row level security;
