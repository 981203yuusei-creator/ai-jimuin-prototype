alter table jobs add column if not exists job_number integer;

with numbered as (
  select id, row_number() over (partition by company_id order by created_at asc) as rn
  from jobs
)
update jobs
set job_number = numbered.rn
from numbered
where jobs.id = numbered.id
  and jobs.job_number is null;

create index if not exists jobs_company_job_number_idx on jobs (company_id, job_number);
