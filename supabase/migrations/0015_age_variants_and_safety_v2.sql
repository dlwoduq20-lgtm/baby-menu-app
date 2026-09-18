-- 0015_age_variants_and_safety_v2.sql

-- 1) 레시피 월령별 조리법 변형
create table if not exists recipe_age_variants (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  age_from_month integer not null,
  age_to_month integer not null,
  texture text not null,
  size_guide text not null,
  cooking_method text,
  ingredient_adjustment text,
  serving_note text,
  oil_level text,
  created_at timestamptz not null default now()
);
create index if not exists idx_recipe_age_variants_recipe on recipe_age_variants(recipe_id);

-- 2) 식재료 안전 등급 (재료 + 형태 + 월령 조합 — 재료명만으로 위험 판정하는 한계 극복)
create table if not exists ingredient_safety_rules (
  id uuid primary key default gen_random_uuid(),
  ingredient_id uuid not null references ingredients(id) on delete cascade,
  age_from_month integer not null,
  age_to_month integer,
  safety_level text not null check (safety_level in ('SAFE','SAFE_AFTER_MODIFICATION','UNSAFE')),
  hazard_type text,
  modification_note text,
  created_at timestamptz not null default now()
);
create index if not exists idx_ingredient_safety_rules_ingredient on ingredient_safety_rules(ingredient_id);

-- RLS 활성화 및 읽기 정책 설정 (누구나 안전하게 조회 가능)
alter table recipe_age_variants enable row level security;
alter table ingredient_safety_rules enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'recipe_age_variants' and policyname = 'recipe_age_variants_read_all'
  ) then
    create policy "recipe_age_variants_read_all" on recipe_age_variants for select using (true);
  end if;

  if not exists (
    select 1 from pg_policies where tablename = 'ingredient_safety_rules' and policyname = 'ingredient_safety_rules_read_all'
  ) then
    create policy "ingredient_safety_rules_read_all" on ingredient_safety_rules for select using (true);
  end if;
end
$$;

-- 3) 식재료 식품군 태그 (WHO 최소 식이 다양성 기준용)
alter table ingredients add column if not exists food_groups text[] default '{}';

-- 4) 레시피 메뉴 타입 (다양성 점수용 — 덮밥만 반복 추천되는 것 방지)
alter table recipes add column if not exists menu_type text;

-- ==============================================================================
-- 식품군 태깅 (기존 59개 재료 전부)
-- ==============================================================================
update ingredients set food_groups = v.groups::text[]
from (values
  ('밥', '{곡류}'), ('현미밥', '{곡류}'), ('오트밀', '{곡류}'), ('국수', '{곡류}'), ('보리', '{곡류}'), ('퀴노아', '{곡류}'),
  ('소고기', '{육류}'), ('닭가슴살', '{육류}'), ('돼지고기', '{육류}'),
  ('흰살생선', '{생선}'), ('연어', '{생선}'), ('참치', '{생선}'), ('새우', '{생선}'), ('굴', '{생선}'),
  ('계란', '{계란}'),
  ('두부', '{콩류}'), ('완두콩', '{콩류}'), ('병아리콩', '{콩류}'), ('렌틸콩', '{콩류}'),
  ('콩나물', '{채소}'), ('애호박', '{채소}'), ('당근', '{채소}'), ('양파', '{채소}'), ('브로콜리', '{채소}'),
  ('시금치', '{채소}'), ('감자', '{채소}'), ('고구마', '{채소}'), ('숙주나물', '{채소}'), ('무', '{채소}'),
  ('배추', '{채소}'), ('오이', '{채소}'), ('파프리카', '{채소}'), ('단호박', '{채소}'), ('옥수수', '{채소}'),
  ('양송이버섯', '{채소}'), ('가지', '{채소}'), ('마늘', '{채소}'), ('생강', '{채소}'), ('대파', '{채소}'), ('셀러리', '{채소}'), ('케일', '{채소}'),
  ('바나나', '{과일}'), ('사과', '{과일}'), ('블루베리', '{과일}'), ('배', '{과일}'), ('딸기', '{과일}'),
  ('키위', '{과일}'), ('망고', '{과일}'), ('냉동베리', '{과일}'),
  ('플레인요거트', '{유제품}'), ('우유', '{유제품}'), ('치즈', '{유제품}'), ('그릭요거트', '{유제품}'),
  ('미역', '{해조류}'), ('김', '{해조류}'),
  ('국간장', '{조미료}'), ('참기름', '{조미료}'), ('파슬리', '{조미료}'),
  ('냉동만두', '{곡류,육류}')
) as v(name, groups)
where ingredients.name = v.name;

-- ==============================================================================
-- 메뉴 타입 태깅 (기존 70개 레시피 전부)
-- ==============================================================================
update recipes set menu_type = v.menu_type
from (values
  ('소고기 애호박 덮밥','rice'), ('두부 계란찜','egg'), ('계란밥','rice'), ('닭고기 야채죽','porridge'),
  ('연어 브로콜리 진밥','porridge'), ('두부 채소 볶음밥','rice'), ('바나나 요거트','snack'), ('참치 주먹밥','rice'),
  ('흰살생선 감자 매시','snack'), ('소고기 감자조림밥','rice'), ('닭고기 고구마 진밥','porridge'), ('시금치 두부국밥','soup'),
  ('돼지고기 채소볶음밥','rice'), ('콩나물 밥국','soup'), ('소고기 미역국밥','soup'), ('감자 치즈 그라탕','snack'),
  ('흰살생선 채소 진밥','porridge'), ('소고기 시금치죽','porridge'), ('사과 오트밀','snack'), ('고구마 매시','snack'),
  ('감자 치즈 매시','snack'), ('두부 김가루밥','rice'), ('블루베리 요거트','snack'), ('계란 국수','noodle'),
  ('냉동만두 야채찜','finger_food'), ('사과 치즈 스틱','finger_food'), ('우유 감자수프','soup'), ('냉동베리 요거트볼','snack'),
  ('닭고기 애호박 진밥','porridge'), ('연어 감자 매시','snack'), ('두부 시금치죽','porridge'), ('소고기 브로콜리덮밥','rice'),
  ('닭고기 양파 진밥','porridge'), ('참치 애호박덮밥','rice'), ('돼지고기 감자조림','stew'), ('연어 시금치 진밥','porridge'),
  ('소고기 콩나물국밥','soup'), ('흰살생선 브로콜리 진밥','porridge'), ('두부 브로콜리 매시','snack'), ('바나나 오트밀','snack'),
  ('감자 당근 매시','snack'), ('치즈 계란말이','egg'), ('참치 두부덮밥','rice'), ('사과 요거트','snack'),
  ('미역 계란국밥','soup'), ('냉동만두 감자수프','soup'), ('국수 애호박볶음','noodle'), ('콩나물 두부무침밥','rice'),
  ('무 배추 두부국밥','soup'), ('숙주나물 무침밥','rice'), ('오이 그릭요거트무침','snack'), ('파프리카 채소볶음밥','rice'),
  ('단호박 진밥','porridge'), ('옥수수 감자수프','soup'), ('양송이버섯 계란볶음밥','rice'), ('가지 두부덮밥','rice'),
  ('마늘생강 소고기볶음밥','rice'), ('대파 계란국밥','soup'), ('셀러리 닭죽','porridge'), ('케일 사과 그릭요거트볼','snack'),
  ('배 사과 퓨레','snack'), ('딸기 그릭요거트','snack'), ('키위 매시','snack'), ('망고 그릭요거트볼','snack'),
  ('보리 새우볶음밥','rice'), ('퀴노아 채소죽','porridge'), ('완두콩 두부매시','snack'), ('병아리콩 채소스튜','stew'),
  ('렌틸콩 야채죽','porridge'), ('굴 야채죽','porridge')
) as v(name, menu_type)
where recipes.name = v.name;

-- ==============================================================================
-- 신규 레시피: 감자전 (파일럿 쇼케이스 — 하나의 메뉴에 월령별 조리법 5단계 완비)
-- ==============================================================================
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('감자전', '12-17', 15, 2, false, '{계란}', '월령에 따라 크기를 반드시 조절하세요.', '기름은 아주 소량만 사용하세요.', 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('감자', 60, 'g'), ('계란', 1, '개'), ('양파', 10, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '감자전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '감자 60g을 강판이나 채칼로 곱게 간다.'),
  (2, '양파 10g을 아주 잘게 다진다.'),
  (3, '계란 1개와 함께 골고루 섞는다.'),
  (4, '팬에 기름을 아주 소량만 둘러 약한 불에서 속까지 완전히 익힌다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '감자전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 30, 7, 5, 2.0, array['탄수화물', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

with r as (select id from recipes where name = '감자전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (12, 14, '매우 부드러움', '작게 찢어서 제공', '아주 얇게 부친다', '양파는 거의 보이지 않을 정도로 다진다', '손으로 쉽게 으깨지는 정도로 충분히 익힌 뒤 작게 찢어서 제공하세요.', '최소'),
  (15, 17, '부드러움', '5~8mm 크기로 자르기', '작은 크기로 얇게 부친다', '감자와 양파 모두 곱게 다진다', '완전히 익힌 뒤 5~8mm 정도의 작은 조각으로 잘라주세요.', '최소'),
  (18, 23, '부드러운 일반식', '약 1cm 크기로 자르기', '한입 크기로 부친다', '감자를 곱게 갈거나 잘게 채썬다', '속까지 충분히 익힌 뒤 약 1cm 크기로 잘라 제공하세요.', '소량'),
  (24, 29, '일반 유아식', '한입 크기의 작은 전', '한입 크기의 작은 전으로 부친다', '감자를 가늘게 채썬 형태도 가능', '기름은 최소량만 사용하세요.', '소량'),
  (30, 36, '가족식에 가까움', '한입 크기로 자르기', '가족식과 비슷하게 조리', '일반 채썬 형태로 조리 가능', '너무 바삭하거나 딱딱하게 굽지 않고, 한입 크기로 잘라 제공하세요.', '일반')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- ==============================================================================
-- 기존 레시피 8개에 월령별 조리법 파일럿 적용 (총 18개 변형)
-- ==============================================================================

-- 1. 소고기 애호박 덮밥 (3개)
with r as (select id from recipes where name = '소고기 애호박 덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (12, 17, '부드러운 진밥 형태', '5~8mm로 잘게 다지기', '소고기와 애호박을 푹 익혀 부드럽게', '밥은 물을 더 넣어 진밥으로', '재료를 전부 잘게 다져 진밥과 섞어주세요.', '최소'),
  (18, 23, '일반 유아식', '약 1cm로 썰기', '기존 조리법 그대로', '표준 레시피 그대로', '기존 레시피 그대로 제공하세요.', '소량'),
  (24, 36, '가족식에 가까움', '한입 크기', '살짝 간을 더해도 무방', '어른 반찬과 비슷하게 조리 가능', '한입 크기로 썰어 제공하세요.', '일반')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- 2. 두부 계란찜 (3개)
with r as (select id from recipes where name = '두부 계란찜')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (12, 17, '아주 부드러운 푸딩 형태', '숟가락으로 떠먹는 크기', '찜기에 오래 쪄서 매우 부드럽게', '두부 비율을 조금 더 높임', '숟가락으로 떠먹기 좋은 농도로 만드세요.', '없음'),
  (18, 23, '일반 계란찜 농도', '숟가락 한입 크기', '기존 조리법 그대로', '표준 레시피 그대로', '기존 레시피 그대로 제공하세요.', '없음'),
  (24, 36, '가족식 계란찜', '한입 크기', '기호에 따라 다진 파 소량 추가 가능', '어른용 계란찜과 유사하게', '한입 크기로 떠서 제공하세요.', '없음')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- 3. 소고기 미역국밥 (2개)
with r as (select id from recipes where name = '소고기 미역국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (18, 23, '부드러운 국밥', '미역과 고기를 잘게 썰기', '기존 조리법 그대로', '표준 레시피 그대로', '건더기를 잘게 썰어 목에 걸리지 않게 하세요.', '소량'),
  (24, 36, '가족식 미역국', '한입 크기', '간을 아주 살짝 더해도 무방', '어른 미역국과 유사하게', '한입 크기로 썰어 제공하세요.', '일반')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- 4. 사과 오트밀 (2개)
with r as (select id from recipes where name = '사과 오트밀')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (6, 11, '완전히 곱게 으깬 퓨레', '덩어리 없이 매끄럽게', '사과를 완전히 익혀 곱게 으깨기', '오트밀도 충분히 불려 곱게', '덩어리가 전혀 없도록 곱게 으깨주세요.', '없음'),
  (12, 23, '약간의 씹는 질감 허용', '작은 알갱이 정도', '사과를 강판에 갈아도 됨', '오트밀 불리는 시간을 줄여도 됨', '약간의 질감이 남아있어도 괜찮아요.', '없음')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- 5. 닭고기 야채죽 (2개)
with r as (select id from recipes where name = '닭고기 야채죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (12, 17, '부드러운 죽', '아주 잘게 다지기', '닭고기를 결대로 아주 잘게 찢기', '물을 더 넣어 묽게', '닭고기를 아주 잘게 찢어 삼키기 편하게 하세요.', '없음'),
  (18, 36, '일반 죽 농도', '한입 크기로 찢기', '기존 조리법 그대로', '표준 레시피 그대로', '기존 레시피 그대로 제공하세요.', '없음')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- 6. 완두콩 두부매시 (2개)
with r as (select id from recipes where name = '완두콩 두부매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (6, 11, '완전히 곱게 으깬 퓨레', '덩어리 없이 매끄럽게', '완두콩 껍질 완전히 제거 후 곱게', '두부도 체에 한 번 더 내려 곱게', '완두콩 껍질이 조금도 남지 않게 곱게 으깨주세요.', '없음'),
  (12, 23, '약간의 알갱이 허용', '완두콩 반알 정도 크기', '완두콩을 가볍게만 으깨기', '두부는 포크로 으깨는 정도', '완두콩을 반알 정도 크기로 남겨도 괜찮아요.', '없음')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- 7. 참치 주먹밥 (2개)
with r as (select id from recipes where name = '참치 주먹밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (18, 23, '부드러운 주먹밥', '한입 크기의 작은 뭉치', '아기 손에 맞는 작은 크기로', '김은 아주 잘게 부수기', '한입에 삼킬 수 있는 작은 크기로 뭉쳐주세요.', '없음'),
  (24, 36, '일반 주먹밥', '작은 삼각김밥 크기', '기존 조리법 그대로', '표준 레시피 그대로', '작은 삼각김밥 크기로 뭉쳐 제공하세요.', '없음')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- 8. 감자 치즈 그라탕 (2개)
with r as (select id from recipes where name = '감자 치즈 그라탕')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, ingredient_adjustment, serving_note, oil_level)
select r.id, v.age_from, v.age_to, v.texture, v.size, v.method, v.adjustment, v.note, v.oil
from r, (values
  (18, 23, '부드러운 매시 형태', '숟가락으로 떠먹는 크기', '감자를 완전히 으깨어 매시로', '치즈는 아주 소량만', '완전히 으깨서 숟가락으로 떠먹기 좋게 만드세요.', '없음'),
  (24, 36, '일반 그라탕', '포크로 찍는 크기', '감자를 얇게 썬 형태 유지 가능', '표준 레시피 그대로', '포크로 찍기 좋은 크기로 제공하세요.', '소량')
) as v(age_from, age_to, texture, size, method, adjustment, note, oil);

-- ==============================================================================
-- 안전 등급 파일럿 (8개 예시)
-- ==============================================================================
insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select i.id, v.age_from, v.age_to, v.level, v.hazard, v.note
from (values
  ('당근', 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '푹 삶아 완전히 부드럽게 만든 뒤 곱게 으깨서 제공하세요.'),
  ('당근', 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '푹 익혀 잘게 다지거나 작은 조각으로 썰어 제공하세요. 생당근이나 큰 조각은 피하세요.'),
  ('사과', 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '완전히 익혀 곱게 으깬 형태로만 제공하세요. 생사과나 큰 조각은 위험해요.'),
  ('사과', 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '얇게 채썰거나 강판에 갈아서 제공하세요. 두꺼운 생사과 조각은 피하세요.'),
  ('새우', 6, 23, 'UNSAFE', 'allergen', '갑각류 알레르기 위험이 높은 시기입니다. 24개월 이후, 소아과 상담 후 소량으로 시작하세요.'),
  ('새우', 24, null, 'SAFE_AFTER_MODIFICATION', 'choking', '껍질과 내장을 완전히 제거하고 잘게 다져서 완전히 익혀 제공하세요.'),
  ('완두콩', 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '껍질을 벗기고 완전히 으깨서 제공하세요. 통완두콩은 위험해요.'),
  ('굴', 6, 23, 'UNSAFE', 'allergen', '조개류 알레르기 위험이 높은 시기입니다. 24개월 이후 소량으로 시작하세요.')
) as v(name, age_from, age_to, level, hazard, note)
join ingredients i on i.name = v.name;
