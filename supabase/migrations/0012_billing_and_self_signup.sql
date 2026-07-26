alter table companies alter column line_channel_id drop not null;
alter table companies alter column line_channel_secret drop not null;
alter table companies alter column line_channel_access_token drop not null;

alter table companies add column if not exists subscription_status text not null default 'pending';
alter table companies add column if not exists stripe_customer_id text;
alter table companies add column if not exists stripe_subscription_id text;

-- 既存の(手動登録済みの)企業は決済を経ていないため、稼働継続できるよう有効化しておく
update companies set subscription_status = 'active' where subscription_status = 'pending';
