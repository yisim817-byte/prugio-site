-- Operator-issued id/password logins (2026-10-03).
--
-- Only rows with a login_id grant access. Rows created by the retired
-- first-sign-in bootstrap (login_id null) stay in place but no longer open the
-- admin screen. must_change_password forces a new password before any lead is
-- shown, and is set again whenever the operator resets a staff password.

alter table site_admins add column if not exists login_id text;
alter table site_admins add column if not exists must_change_password boolean not null default false;

create unique index if not exists site_admins_site_login_idx
  on site_admins (site_id, login_id)
  where login_id is not null;

-- Better Auth rate-limit store (rateLimit.storage = "database"), so the sign-in
-- limit holds across serverless instances. Columns are camelCase on purpose.
create table if not exists "rateLimit" (
  "id" text not null primary key,
  "key" text not null unique,
  "count" integer not null,
  "lastRequest" bigint not null
);
