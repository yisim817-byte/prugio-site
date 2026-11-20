create table if not exists funnel_events (
  id bigserial primary key,
  site_id text not null,
  name text not null,
  form text not null default '',
  path text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists funnel_events_site_created on funnel_events (site_id, created_at desc);
