-- 작업지시서 32: 방문예약 동의 분리. 기존 행은 지우거나 바꾸지 않는다(새 칸 기본값만).
alter table visit_reservations add column if not exists age14 boolean not null default false;
alter table visit_reservations add column if not exists consent_marketing boolean not null default false;
alter table visit_reservations add column if not exists consent_call boolean not null default false;
alter table visit_reservations add column if not exists consent_sms boolean not null default false;
alter table visit_reservations add column if not exists consented_at timestamptz;
alter table visit_reservations alter column visit_slot drop not null;
