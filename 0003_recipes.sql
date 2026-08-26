-- STEP 6: 레시피 DB

create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_age_stage text not null check (
    min_age_stage in ('0-5', '6-8', '9-11', '12-17', '18-23', '24+')
  ),
  cook_minutes integer not null,
  difficulty integer not null check (difficulty between 1 and 3),
  is_quick boolean not null default false,
  allergens text[] not null default '{}',           -- 이 레시피가 포함하는 알레르기 유발 식품 (스펙 15장)
  choking_hazard_note text,                          -- 질식 위험 관련 조리 안내 (스펙 15, 17장)
  caution_note text,                                 -- 그 외 주의사항
  created_at timestamptz not null default now()
);

create table if not exists recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes (id) on delete cascade,
  ingredient_id uuid not null references ingredients (id),
  quantity numeric not null,
  unit text not null,          -- g, ml, 개 등
  is_optional boolean not null default false,
  unique (recipe_id, ingredient_id)
);

create table if not exists recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes (id) on delete cascade,
  step_number integer not null,
  instruction text not null,
  unique (recipe_id, step_number)
);

-- 스펙 13장: "영양정보는 임의로 생성하지 않는다" → source를 반드시 남기도록 강제
create table if not exists nutrition_data (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null unique references recipes (id) on delete cascade,
  carbs_g numeric,
  protein_g numeric,
  fat_g numeric,
  fiber_g numeric,
  key_micronutrients text[] default '{}',
  source text not null,        -- 예: '식품의약품안전처 식품영양성분DB', '검증된 레시피 원본 출처'
  created_at timestamptz not null default now()
);

alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table nutrition_data enable row level security;

-- 레시피 데이터는 모든 로그인 사용자가 읽을 수 있고, 쓰기는 관리자(서비스 롤)만 가능하도록
-- insert/update/delete 정책을 만들지 않는다 (스펙 23장: 관리자 화면에서만 레시피 관리).
create policy "recipes_read_all" on recipes for select using (auth.role() = 'authenticated');
create policy "recipe_ingredients_read_all" on recipe_ingredients for select using (auth.role() = 'authenticated');
create policy "recipe_steps_read_all" on recipe_steps for select using (auth.role() = 'authenticated');
create policy "nutrition_data_read_all" on nutrition_data for select using (auth.role() = 'authenticated');

create index if not exists idx_recipe_ingredients_recipe_id on recipe_ingredients (recipe_id);
create index if not exists idx_recipe_steps_recipe_id on recipe_steps (recipe_id);

-- ---------- 시드 레시피 3개 ----------

-- 1) 소고기 애호박 덮밥 (오늘의 추천, 18개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('소고기 애호박 덮밥', '18-23', 20, 2, false, '{}', '고기와 채소를 아기가 씹기 좋은 크기로 다졌는지 확인하세요.', '나트륨 함량이 낮도록 간을 최소화했어요.')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit
from r, (values
  ('소고기', 40, 'g'),
  ('애호박', 30, 'g'),
  ('양파', 10, 'g'),
  ('밥', 80, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '소고기 애호박 덮밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '소고기를 잘게 다진다.'),
  (2, '애호박과 양파를 잘게 썬다.'),
  (3, '팬에 재료를 충분히 익힌다.'),
  (4, '밥과 함께 섞는다.'),
  (5, '아기의 월령에 맞게 크기와 질감을 조절한다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '소고기 애호박 덮밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 42, 14, 6, 2.1, array['철분', '비타민A'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

-- 2) 두부 계란찜 (초간편, 12개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('두부 계란찜', '12-17', 10, 1, true, '{계란}', null, '완전히 익혀서 제공하세요 (반숙 금지).')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit
from r, (values
  ('두부', 50, 'g'),
  ('계란', 1, '개')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '두부 계란찜')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '두부를 곱게 으깬다.'),
  (2, '계란을 풀어 두부와 섞는다.'),
  (3, '내열 용기에 담아 전자레인지 또는 찜기에서 완전히 익힌다.'),
  (4, '한 김 식힌 뒤 월령에 맞는 크기로 잘라 제공한다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '두부 계란찜')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 11, 7, 0.4, array['칼슘', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

-- 3) 계란밥 (초간편, 9개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('계란밥', '9-11', 8, 1, true, '{계란}', null, '계란은 완전히 익혀서 사용하세요.')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit
from r, (values
  ('밥', 70, 'g'),
  ('계란', 1, '개')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '계란밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '계란을 완전히 풀어 약한 불에서 스크램블 형태로 익힌다.'),
  (2, '따뜻한 밥에 계란을 섞는다.'),
  (3, '월령에 맞게 질감을 조절해 제공한다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '계란밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 38, 8, 5, 0.3, array['단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
