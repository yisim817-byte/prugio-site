create table if not exists site_admins (
  site_id text not null,
  user_id text not null,
  role text not null check (role in ('owner', 'staff')),
  created_at timestamptz not null default now(),
  primary key (site_id, user_id)
);

create table if not exists notify_settings (
  site_id text primary key,
  phone text not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

create table if not exists notify_recipient_log (
  id serial primary key,
  site_id text not null,
  old_phone text,
  new_phone text not null,
  actor_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id serial primary key,
  site_id text not null,
  receipt_no text not null unique,
  name text not null,
  phone text not null,
  birth6 text not null,
  sido text not null,
  sigungu text not null,
  dong text not null,
  created_at timestamptz not null default now(),
  notify_status text not null default 'pending',
  notify_detail text,
  notify_at timestamptz,
  unique (site_id, phone)
);

create index if not exists leads_site_created_idx on leads (site_id, created_at desc);
