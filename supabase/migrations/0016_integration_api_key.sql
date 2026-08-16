-- AI売上監査などの外部サービスから案件データを取得するためのAPIキー。
-- 発行するまではnull（未連携）。ダッシュボード設定画面で発行/再発行する。
alter table companies add column if not exists integration_api_key text unique;
