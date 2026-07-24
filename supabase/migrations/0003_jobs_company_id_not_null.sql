-- Run only after every existing row in jobs has been backfilled with a
-- valid company_id (see 0002_multi_tenant_and_photos.sql).
alter table jobs alter column company_id set not null;
