-- 작업지시서 9 (2026-10-19): 모델하우스 방문 희망일. 추가만, 기본값 없음, 기존 행 영향 없음.
alter table leads add column if not exists visit_date date;
alter table leads add column if not exists visit_slot text;
alter table leads add column if not exists visit_updated_at timestamptz;
