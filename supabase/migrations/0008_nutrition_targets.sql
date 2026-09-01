-- 기능 업데이트 #2, #4: 월령별 "하루 권장 섭취 목표" — 주간/일별 화면에서 커버리지(%)를 계산하는 데 쓴다.
-- 스펙 13장 원칙: 임의 생성 금지 → source를 필수로 남기고, 관리자가 /admin/nutrition-targets 에서 언제든 검증/수정 가능하게 한다.

create table if not exists nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  stage text not null unique check (
    stage in ('0-5', '6-8', '9-11', '12-17', '18-23', '24+')
  ),
  daily_carbs_g numeric,
  daily_protein_g numeric,
  daily_fat_g numeric,
  daily_fiber_g numeric,
  key_nutrients text[] not null default '{}',
  source text not null,
  updated_at timestamptz not null default now()
);

alter table nutrition_targets enable row level security;
create policy "nutrition_targets_read_all" on nutrition_targets for select using (auth.role() = 'authenticated');

-- 시드값은 일반적으로 알려진 영유아 참고 수치를 바탕으로 한 "초안"이다.
-- 실제 서비스 운영 전 반드시 관리자 화면(/admin/nutrition-targets)에서 소아영양 전문가 검토를 거쳐 source와 함께 업데이트할 것.
insert into nutrition_targets (stage, daily_carbs_g, daily_protein_g, daily_fat_g, daily_fiber_g, key_nutrients, source) values
  ('0-5', null, null, null, null, '{}', '이유식 대상 아님 — 해당 없음'),
  ('6-8', 60, 12, 25, 5, array['철분', '아연'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 영유아 식이섭취기준 개요)'),
  ('9-11', 70, 15, 28, 6, array['철분', '칼슘'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 영유아 식이섭취기준 개요)'),
  ('12-17', 90, 20, 30, 8, array['칼슘', '철분', '비타민D'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 유아 식이섭취기준 개요)'),
  ('18-23', 100, 22, 32, 9, array['칼슘', '철분'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 유아 식이섭취기준 개요)'),
  ('24+', 110, 25, 35, 10, array['칼슘', '철분', '비타민D'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 유아 식이섭취기준 개요)')
on conflict (stage) do nothing;
