alter table jobs add column if not exists scheduled_at timestamptz;
alter table jobs add column if not exists quote_amount numeric;
alter table jobs add column if not exists invoice_amount numeric;
alter table jobs add column if not exists invoice_note text;

alter table companies add column if not exists contact_address text;
alter table companies add column if not exists contact_phone text;
