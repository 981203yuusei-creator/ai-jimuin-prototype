-- 電話で受け付けた案件などをダッシュボードから手入力できるように、
-- LINEのユーザーIDを持たない案件を許可する。
alter table jobs alter column line_user_id drop not null;
