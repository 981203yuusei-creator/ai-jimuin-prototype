create table if not exists blog_posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  body_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table blog_posts enable row level security;
