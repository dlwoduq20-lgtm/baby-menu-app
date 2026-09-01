-- =============================================
-- Baby Menu App Complete Database Migration (0001 - 0010)
-- 100% Pure PostgreSQL DDL & UTF-8 Safe Script
-- =============================================

create extension if not exists "pgcrypto";

-- =============================================
-- 1. Babies & Preferences
-- =============================================
create table if not exists babies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  birth_date date not null,
  gender text not null default 'unspecified' check (gender in ('female', 'male', 'unspecified')),
  created_at timestamptz not null default now()
);

create table if not exists baby_allergies (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references babies (id) on delete cascade,
  allergen text not null,
  created_at timestamptz not null default now(),
  unique (baby_id, allergen)
);

create table if not exists baby_preferences (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references babies (id) on delete cascade,
  food_name text not null,
  preference_type text not null check (preference_type in ('not_eaten', 'avoid', 'favorite', 'disliked')),
  created_at timestamptz not null default now(),
  unique (baby_id, food_name, preference_type)
);

alter table babies enable row level security;
alter table baby_allergies enable row level security;
alter table baby_preferences enable row level security;

drop policy if exists "babies_owner_all" on babies;
create policy "babies_owner_all" on babies for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "baby_allergies_owner_all" on baby_allergies;
create policy "baby_allergies_owner_all" on baby_allergies for all using (exists (select 1 from babies b where b.id = baby_allergies.baby_id and b.user_id = auth.uid())) with check (exists (select 1 from babies b where b.id = baby_allergies.baby_id and b.user_id = auth.uid()));

drop policy if exists "baby_preferences_owner_all" on baby_preferences;
create policy "baby_preferences_owner_all" on baby_preferences for all using (exists (select 1 from babies b where b.id = baby_preferences.baby_id and b.user_id = auth.uid())) with check (exists (select 1 from babies b where b.id = baby_preferences.baby_id and b.user_id = auth.uid()));

create index if not exists idx_babies_user_id on babies (user_id);
create index if not exists idx_baby_allergies_baby_id on baby_allergies (baby_id);
create index if not exists idx_baby_preferences_baby_id on baby_preferences (baby_id);

-- =============================================
-- 2. Ingredients
-- =============================================
create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (
    category in ('곡류', '육류', '생선', '달걀', '두부/콩', '채소', '과일', '유제품', '해조류', '조미료', '냉동식품', '기타')
  ),
  primary_nutrients text[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table ingredients add column if not exists primary_nutrients text[] not null default '{}';

create table if not exists user_ingredients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ingredient_id uuid not null references ingredients (id) on delete cascade,
  is_owned boolean not null default true,
  expiry_date date,
  usage_count integer not null default 0,
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ingredient_id)
);

alter table ingredients enable row level security;
alter table user_ingredients enable row level security;

drop policy if exists "ingredients_read_all" on ingredients;
create policy "ingredients_read_all" on ingredients for select using (auth.role() = 'authenticated');

drop policy if exists "user_ingredients_owner_all" on user_ingredients;
create policy "user_ingredients_owner_all" on user_ingredients for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_ingredients_category on ingredients (category);
create index if not exists idx_user_ingredients_user_id on user_ingredients (user_id);

-- Seed ingredients
insert into ingredients (name, category, primary_nutrients) values
  ('밥', '곡류', array['탄수화물']),
  ('현미밥', '곡류', array['탄수화물', '식이섬유']),
  ('오트밀', '곡류', array['식이섬유', '철분']),
  ('국수', '곡류', array['탄수화물']),
  ('소고기', '육류', array['단백질', '철분', '아연']),
  ('닭가슴살', '육류', array['단백질']),
  ('돼지고기', '육류', array['단백질', '비타민B1']),
  ('흰살생선', '생선', array['단백질', 'DHA']),
  ('연어', '생선', array['단백질', '오메가-3']),
  ('참치', '생선', array['단백질', '오메가-3']),
  ('계란', '달걀', array['단백질', '콜린']),
  ('두부', '두부/콩', array['단백질', '칼슘']),
  ('콩나물', '두부/콩', array['식이섬유', '비타민C']),
  ('애호박', '채소', array['비타민A', '식이섬유']),
  ('당근', '채소', array['비타민A']),
  ('양파', '채소', array['식이섬유']),
  ('브로콜리', '채소', array['비타민C', '식이섬유']),
  ('시금치', '채소', array['철분', '비타민A']),
  ('감자', '채소', array['탄수화물', '비타민C']),
  ('고구마', '채소', array['탄수화물', '식이섬유']),
  ('바나나', '과일', array['칼륨', '식이섬유']),
  ('사과', '과일', array['식이섬유', '비타민C']),
  ('블루베리', '과일', array['비타민C', '항산화물질']),
  ('플레인요거트', '유제품', array['칼슘', '단백질']),
  ('우유', '유제품', array['칼슘', '단백질']),
  ('치즈', '유제품', array['칼슘', '단백질']),
  ('미역', '해조류', array['칼슘', '요오드']),
  ('김', '해조류', array['요오드', '식이섬유']),
  ('국간장', '조미료', array['나트륨(소량만 사용)']),
  ('참기름', '조미료', array['불포화지방']),
  ('냉동만두', '냉동식품', array['탄수화물', '단백질']),
  ('냉동베리', '냉동식품', array['비타민C', '항산화물질'])
on conflict (name) do update set
  category = excluded.category,
  primary_nutrients = excluded.primary_nutrients;

-- =============================================
-- 3. Recipes & Nutrition
-- =============================================
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  min_age_stage text not null check (min_age_stage in ('0-5', '6-8', '9-11', '12-17', '18-23', '24+')),
  cook_minutes integer not null,
  difficulty integer not null check (difficulty between 1 and 3),
  is_quick boolean not null default false,
  allergens text[] not null default '{}',
  choking_hazard_note text,
  caution_note text,
  created_at timestamptz not null default now()
);

create unique index if not exists idx_recipes_name_unique on recipes (name);

create table if not exists recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes (id) on delete cascade,
  ingredient_id uuid not null references ingredients (id),
  quantity numeric not null,
  unit text not null,
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

create table if not exists nutrition_data (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null unique references recipes (id) on delete cascade,
  carbs_g numeric,
  protein_g numeric,
  fat_g numeric,
  fiber_g numeric,
  key_micronutrients text[] default '{}',
  source text not null,
  created_at timestamptz not null default now()
);

alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;
alter table recipe_steps enable row level security;
alter table nutrition_data enable row level security;

drop policy if exists "recipes_read_all" on recipes;
create policy "recipes_read_all" on recipes for select using (auth.role() = 'authenticated');

drop policy if exists "recipe_ingredients_read_all" on recipe_ingredients;
create policy "recipe_ingredients_read_all" on recipe_ingredients for select using (auth.role() = 'authenticated');

drop policy if exists "recipe_steps_read_all" on recipe_steps;
create policy "recipe_steps_read_all" on recipe_steps for select using (auth.role() = 'authenticated');

drop policy if exists "nutrition_data_read_all" on nutrition_data;
create policy "nutrition_data_read_all" on nutrition_data for select using (auth.role() = 'authenticated');

create index if not exists idx_recipe_ingredients_recipe_id on recipe_ingredients (recipe_id);
create index if not exists idx_recipe_steps_recipe_id on recipe_steps (recipe_id);

-- Seed Recipes
-- 1) 소고기 애호박 덮밥
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('소고기 애호박 덮밥', '18-23', 20, 2, false, '{}', '고기와 채소를 아기가 씹기 좋은 크기로 다졌는지 확인하세요.', '나트륨 함량이 낮도록 간을 최소화했어요.')
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '소고기 애호박 덮밥')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit
from r, (values ('소고기', 40, 'g'), ('애호박', 30, 'g'), ('양파', 10, 'g'), ('밥', 80, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '소고기 애호박 덮밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '소고기를 잘게 다진다.'), (2, '애호박과 양파를 잘게 썬다.'), (3, '팬에 재료를 충분히 익힌다.'), (4, '밥과 함께 섞는다.'), (5, '아기의 월령에 맞게 크기와 질감을 조절한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '소고기 애호박 덮밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 42, 14, 6, 2.1, array['철분', '비타민A'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- 2) 두부 계란찜
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('두부 계란찜', '12-17', 10, 1, true, '{계란}', null, '완전히 익혀서 제공하세요 (반숙 금지).')
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '두부 계란찜')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit
from r, (values ('두부', 50, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '두부 계란찜')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '두부를 곱게 으깬다.'), (2, '계란을 풀어 두부와 섞는다.'), (3, '내열 용기에 담아 전자레인지 또는 찜기에서 완전히 익힌다.'), (4, '한 김 식힌 뒤 월령에 맞는 크기로 잘라 제공한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '두부 계란찜')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 11, 7, 0.4, array['칼슘', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- 3) 계란밥
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('계란밥', '9-11', 8, 1, true, '{계란}', null, '계란은 완전히 익혀서 사용하세요.')
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '계란밥')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit
from r, (values ('밥', 70, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '계란밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '계란을 완전히 풀어 약한 불에서 스크램블 형태로 익힌다.'), (2, '따뜻한 밥에 계란을 섞는다.'), (3, '월령에 맞게 질감을 조절해 제공한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '계란밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 38, 8, 5, 0.3, array['단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- 4) 닭고기 야채죽
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('닭고기 야채죽', '12-17', 25, 2, false, '{}', '닭고기는 결대로 잘게 찢어서 제공하세요.', null)
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '닭고기 야채죽')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('닭가슴살', 40, 'g'), ('당근', 20, 'g'), ('양파', 15, 'g'), ('현미밥', 60, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '닭고기 야채죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '닭가슴살을 삶아 결대로 잘게 찢는다.'), (2, '당근과 양파를 잘게 다진다.'), (3, '냄비에 현미밥과 육수를 넣고 재료를 넣어 끓인다.'), (4, '푹 퍼질 때까지 저어가며 익힌다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '닭고기 야채죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 35, 13, 5, 2.4, array['비타민A', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- 5) 연어 브로콜리 진밥
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('연어 브로콜리 진밥', '18-23', 20, 2, false, '{}', '연어 가시가 없는지 반드시 확인하고, 브로콜리는 잘게 썰어 제공하세요.', null)
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '연어 브로콜리 진밥')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('연어', 40, 'g'), ('브로콜리', 30, 'g'), ('밥', 80, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '연어 브로콜리 진밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '연어를 완전히 익힌 뒤 가시를 꼼꼼히 제거하고 잘게 부순다.'), (2, '브로콜리를 데친 뒤 잘게 다진다.'), (3, '밥과 함께 부드럽게 섞는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '연어 브로콜리 진밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 40, 15, 8, 2.8, array['오메가-3', '비타민C'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- 6) 두부 채소 볶음밥
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('두부 채소 볶음밥', '9-11', 15, 1, false, '{}', null, '기름은 소량만 사용하세요.')
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '두부 채소 볶음밥')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('두부', 50, 'g'), ('당근', 15, 'g'), ('애호박', 15, 'g'), ('밥', 70, 'g'), ('참기름', 2, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '두부 채소 볶음밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '두부를 으깨고 당근, 애호박을 잘게 다진다.'), (2, '팬에 참기름을 살짝 두르고 재료를 볶는다.'), (3, '밥을 넣고 골고루 볶는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '두부 채소 볶음밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 38, 10, 6, 2.0, array['칼슘', '비타민A'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- 7) 바나나 요거트
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('바나나 요거트', '6-8', 5, 1, true, '{우유}', null, '무가당 플레인 요거트를 사용하세요.')
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '바나나 요거트')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('바나나', 50, 'g'), ('플레인요거트', 60, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '바나나 요거트')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '바나나를 포크로 곱게 으깬다.'), (2, '플레인 요거트와 골고루 섞는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '바나나 요거트')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 22, 4, 2, 1.8, array['칼슘', '칼륨'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- 8) 참치 주먹밥
insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
values ('참치 주먹밥', '18-23', 10, 1, true, '{}', '한입 크기로 작게 뭉쳐서 제공하세요.', '참치는 기름기를 잘 빼고 사용하세요.')
on conflict (name) do update set min_age_stage = excluded.min_age_stage;

with r as (select id from recipes where name = '참치 주먹밥')
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('참치', 30, 'g'), ('밥', 70, 'g'), ('김', 2, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name
on conflict (recipe_id, ingredient_id) do update set quantity = excluded.quantity;

with r as (select id from recipes where name = '참치 주먹밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '참치는 기름을 빼고 잘게 으깬다.'), (2, '밥과 참치를 섞어 한입 크기로 뭉친다.'), (3, '잘게 부순 김을 겉에 묻힌다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;

with r as (select id from recipes where name = '참치 주먹밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 36, 12, 3, 1.0, array['오메가-3', '요오드'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r
on conflict (recipe_id) do update set carbs_g = excluded.carbs_g, protein_g = excluded.protein_g;

-- =============================================
-- 4. Age Rules
-- =============================================
create table if not exists age_rules (
  id uuid primary key default gen_random_uuid(),
  stage text not null unique check (stage in ('0-5', '6-8', '9-11', '12-17', '18-23', '24+')),
  recommended_food_groups text[] not null default '{}',
  texture text not null,
  food_size_guide text not null,
  cooking_method text not null,
  avoid_foods text[] not null default '{}',
  caution_foods text[] not null default '{}',
  allergy_caution text,
  choking_hazard_foods text[] not null default '{}',
  updated_at timestamptz not null default now()
);

alter table age_rules enable row level security;

drop policy if exists "age_rules_read_all" on age_rules;
create policy "age_rules_read_all" on age_rules for select using (auth.role() = 'authenticated');

insert into age_rules (stage, recommended_food_groups, texture, food_size_guide, cooking_method, avoid_foods, caution_foods, allergy_caution, choking_hazard_foods)
values
  ('0-5', '{}', '이유식 대상 아님', '해당 없음', '해당 없음', '{}', '{}', '이 서비스는 만 6개월 이상을 기준으로 추천합니다. 그 이전 시기의 수유·이유식 시작은 소아과 상담을 먼저 받아보세요.', '{}'),
  ('6-8', array['곡류(쌀미음)', '으깬 채소', '으깬 과일', '살코기 소량'], '완전히 으깬 형태 (퓨레/미음 수준)', '입자 없이 곱게 으깬 상태', '푹 삶아서 곱게 으깨거나 갈아서 조리', array['꿀', '날계란', '덜 익힌 육류/생선', '간이 강한 음식', '우유(음료 대체용)'], array['새로운 알레르기 유발 식품은 한 번에 하나씩만 시도'], '계란, 우유, 밀, 대두, 견과류, 갑각류 등은 소량씩 단독으로 먼저 시도하고 반응을 관찰하세요.', array['통포도', '견과류(통알)', '팝콘', '생당근']),
  ('9-11', array['곡류', '잘게 다진 채소', '잘게 다진 육류/생선', '두부/달걀'], '잘게 다진 형태', '3~5mm 크기로 다짐', '푹 삶거나 쪄서 잘게 다지기', array['꿀', '날계란', '덜 익힌 육류/생선', '과도한 나트륨/당류'], array['질식 위험 재료는 반드시 다진 형태로만 제공'], '이미 확인된 알레르기 식품은 완전히 제외. 새로운 식품은 여전히 소량부터 시작하세요.', array['통포도', '견과류(통알)', '팝콘', '큰 고기 덩어리']),
  ('12-17', array['일반 곡류', '채소', '육류/생선/두부', '유제품(소량)'], '잘게 썬 진밥 수준', '5~8mm 크기로 썰기', '부드럽게 조리, 간은 최소화', array['과도한 나트륨/당류', '날계란'], array['질식 위험 식품은 잘게 썰어서만 제공'], '반응이 확인된 알레르기 식품 외에는 다양한 식품군을 조금씩 넓혀가도 좋습니다.', array['통포도', '견과류(통알)', '팝콘']),
  ('18-23', array['가족식과 유사한 일반 식품군 전반'], '부드러운 일반식에 가까운 형태', '한 입 크기(1~1.5cm)로 자르기', '일반 조리, 다만 간은 성인보다 약하게', array['과도한 나트륨/당류'], array['통포도, 방울토마토 등은 4등분 이상으로 잘라서 제공'], '확인된 알레르기 식품은 계속 제외하세요.', array['통포도(자르지 않은 경우)', '단단한 생채소', '견과류(통알)']),
  ('24+', array['가족식 응용 가능'], '가족식과 거의 동일, 크기만 조절', '아기 한 입 크기 유지', '가족식 조리법을 그대로 응용 가능', '{}', array['단단한 생채소나 견과류는 잘게 잘라서 제공'], '확인된 알레르기 식품은 계속 제외하세요.', array['단단한 생채소(큼직하게 썬 경우)', '견과류(통알)'])
on conflict (stage) do update set
  recommended_food_groups = excluded.recommended_food_groups,
  texture = excluded.texture,
  food_size_guide = excluded.food_size_guide,
  cooking_method = excluded.cooking_method,
  avoid_foods = excluded.avoid_foods,
  caution_foods = excluded.caution_foods,
  allergy_caution = excluded.allergy_caution,
  choking_hazard_foods = excluded.choking_hazard_foods;

-- =============================================
-- 5. Notifications
-- =============================================
create table if not exists notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  enabled boolean not null default true,
  notify_time time not null default '16:00:00',
  push_endpoint text,
  push_p256dh text,
  push_auth text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table notification_settings enable row level security;

drop policy if exists "notification_settings_owner_all" on notification_settings;
create policy "notification_settings_owner_all" on notification_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_notification_settings_enabled_time on notification_settings (enabled, notify_time);

-- =============================================
-- 6. History & Feedback & Favorites
-- =============================================
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_id uuid not null references babies (id) on delete cascade,
  recipe_id uuid not null references recipes (id),
  recommendation_type text not null check (recommendation_type in ('main', 'quick')),
  recommended_date date not null,
  created_at timestamptz not null default now(),
  unique (baby_id, recommendation_type, recommended_date)
);

create table if not exists recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references recipes (id),
  feedback_type text not null check (feedback_type in ('like', 'dislike', 'cooked', 'reroll')),
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references recipes (id),
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

alter table recommendations enable row level security;
alter table recommendation_feedback enable row level security;
alter table favorites enable row level security;

drop policy if exists "recommendations_owner_all" on recommendations;
create policy "recommendations_owner_all" on recommendations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "recommendation_feedback_owner_all" on recommendation_feedback;
create policy "recommendation_feedback_owner_all" on recommendation_feedback for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "favorites_owner_all" on favorites;
create policy "favorites_owner_all" on favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_recommendations_baby_date on recommendations (baby_id, recommended_date desc);
create index if not exists idx_feedback_user_recipe on recommendation_feedback (user_id, recipe_id);
create index if not exists idx_favorites_user on favorites (user_id);

-- =============================================
-- 7. Nutrition Targets
-- =============================================
create table if not exists nutrition_targets (
  id uuid primary key default gen_random_uuid(),
  stage text not null unique check (stage in ('0-5', '6-8', '9-11', '12-17', '18-23', '24+')),
  daily_carbs_g numeric,
  daily_protein_g numeric,
  daily_fat_g numeric,
  daily_fiber_g numeric,
  key_nutrients text[] not null default '{}',
  source text not null,
  updated_at timestamptz not null default now()
);

alter table nutrition_targets enable row level security;

drop policy if exists "nutrition_targets_read_all" on nutrition_targets;
create policy "nutrition_targets_read_all" on nutrition_targets for select using (auth.role() = 'authenticated');

insert into nutrition_targets (stage, daily_carbs_g, daily_protein_g, daily_fat_g, daily_fiber_g, key_nutrients, source) values
  ('0-5', null, null, null, null, '{}', '이유식 대상 아님 — 해당 없음'),
  ('6-8', 60, 12, 25, 5, array['철분', '아연'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 영유아 식이섭취기준 개요)'),
  ('9-11', 70, 15, 28, 6, array['철분', '칼슘'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 영유아 식이섭취기준 개요)'),
  ('12-17', 90, 20, 30, 8, array['칼슘', '철분', '비타민D'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 유아 식이섭취기준 개요)'),
  ('18-23', 100, 22, 32, 9, array['칼슘', '철분'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 유아 식이섭취기준 개요)'),
  ('24+', 110, 25, 35, 10, array['칼슘', '철분', '비타민D'], '초안 값 — 관리자 검토 필요 (참고: 한국영양학회 유아 식이섭취기준 개요)')
on conflict (stage) do update set
  daily_carbs_g = excluded.daily_carbs_g,
  daily_protein_g = excluded.daily_protein_g,
  daily_fat_g = excluded.daily_fat_g,
  daily_fiber_g = excluded.daily_fiber_g,
  key_nutrients = excluded.key_nutrients,
  source = excluded.source;

-- =============================================
-- 8. Weekly Meal Plans & Shopping List
-- =============================================
create table if not exists weekly_meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_id uuid not null references babies (id) on delete cascade,
  week_start_date date not null,
  created_at timestamptz not null default now(),
  unique (baby_id, week_start_date)
);

create table if not exists weekly_meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references weekly_meal_plans (id) on delete cascade,
  day_offset integer not null check (day_offset between 0 and 6),
  meal_type text not null check (meal_type in ('main', 'quick')),
  recipe_id uuid not null references recipes (id),
  unique (plan_id, day_offset, meal_type)
);

alter table weekly_meal_plans enable row level security;
alter table weekly_meal_plan_items enable row level security;

drop policy if exists "weekly_meal_plans_owner_all" on weekly_meal_plans;
create policy "weekly_meal_plans_owner_all" on weekly_meal_plans for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "weekly_meal_plan_items_owner_all" on weekly_meal_plan_items;
create policy "weekly_meal_plan_items_owner_all" on weekly_meal_plan_items for all using (exists (select 1 from weekly_meal_plans p where p.id = weekly_meal_plan_items.plan_id and p.user_id = auth.uid())) with check (exists (select 1 from weekly_meal_plans p where p.id = weekly_meal_plan_items.plan_id and p.user_id = auth.uid()));

create index if not exists idx_weekly_plans_baby_week on weekly_meal_plans (baby_id, week_start_date desc);
create index if not exists idx_weekly_plan_items_plan on weekly_meal_plan_items (plan_id);
