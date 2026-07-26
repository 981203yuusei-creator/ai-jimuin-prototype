alter table companies add column if not exists email text;
alter table companies add column if not exists password_reset_token text;
alter table companies add column if not exists password_reset_expires_at timestamptz;
