alter table jobs add column if not exists report_worker_name text;
alter table jobs add column if not exists report_started_at timestamptz;
alter table jobs add column if not exists report_completed_at timestamptz;
