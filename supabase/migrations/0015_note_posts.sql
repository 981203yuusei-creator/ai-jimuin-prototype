create table note_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  url text,
  created_at timestamptz not null default now()
);

alter table note_posts enable row level security;
