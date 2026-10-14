-- 0019_mass_ingredients_and_recipes.sql
-- 식재료 48종 및 레시피 55종 대량 확장 마이그레이션

-- 1. 신규 식재료 48종 추가
insert into ingredients (name, category, primary_nutrients, food_groups) values
  ('양배추', '채소', array['비타민U', '식이섬유', '비타민C'], array['채소']),
  ('청경채', '채소', array['칼슘', '비타민A', '비타민C'], array['채소']),
  ('비트', '채소', array['철분', '엽산', '칼륨'], array['채소']),
  ('콜리플라워', '채소', array['비타민C', '식이섬유'], array['채소']),
  ('토마토', '채소', array['라이코펜', '비타민C', '식이섬유'], array['채소']),
  ('방울토마토', '채소', array['라이코펜', '비타민C'], array['채소']),
  ('부추', '채소', array['철분', '비타민A', '알리신'], array['채소']),
  ('아스파라거스', '채소', array['아스파라긴산', '엽산', '루테인'], array['채소']),
  ('표고버섯', '채소', array['비타민D', '식이섬유', '아연'], array['채소']),
  ('팽이버섯', '채소', array['식이섬유', '키토산', '비타민B'], array['채소']),
  ('새송이버섯', '채소', array['식이섬유', '비타민C'], array['채소']),
  ('느타리버섯', '채소', array['식이섬유', '칼륨'], array['채소']),
  ('연근', '채소', array['식이섬유', '비타민C', '철분'], array['채소']),
  ('우엉', '채소', array['식이섬유', '이눌린'], array['채소']),
  ('피망', '채소', array['비타민C', '비타민A'], array['채소']),
  ('깻잎', '채소', array['칼슘', '철분', '비타민A'], array['채소']),
  ('닭안심', '육류', array['단백질', '필수아미노산'], array['육류']),
  ('소고기다짐육', '육류', array['철분', '단백질', '아연'], array['육류']),
  ('오리고기', '육류', array['불포화지방산', '단백질', '비타민A'], array['육류']),
  ('대구살', '생선', array['단백질', '비타민B', '칼슘'], array['생선']),
  ('가자미살', '생선', array['단백질', '비타민D', '오메가3'], array['생선']),
  ('멸치', '생선', array['칼슘', '오메가3', '단백질'], array['생선']),
  ('오징어', '생선', array['타우린', '단백질'], array['생선']),
  ('게살', '생선', array['단백질', '칼슘', '키토산'], array['생선']),
  ('전복', '생선', array['단백질', '타우린', '아르기닌'], array['생선']),
  ('고등어', '생선', array['오메가3', 'DHA', '단백질'], array['생선']),
  ('메추리알', '달걀', array['단백질', '비타민A', '철분'], array['계란']),
  ('순두부', '두부/콩', array['단백질', '칼슘', '수분'], array['콩류']),
  ('콩비지', '두부/콩', array['식이섬유', '단백질', '칼슘'], array['콩류']),
  ('검은콩', '두부/콩', array['안토시아닌', '단백질', '식이섬유'], array['콩류']),
  ('낫토', '두부/콩', array['단백질', '비타민K2', '프로바이오틱스'], array['콩류']),
  ('아보카도', '과일', array['불포화지방산', '식이섬유', '칼륨'], array['과일']),
  ('수박', '과일', array['수분', '라이코펜', '비타민A'], array['과일']),
  ('복숭아', '과일', array['비타민C', '식이섬유', '유기산'], array['과일']),
  ('귤', '과일', array['비타민C', '구연산', '식이섬유'], array['과일']),
  ('자두', '과일', array['식이섬유', '비타민C', '소르비톨'], array['과일']),
  ('아기치즈', '유제품', array['칼슘', '단백질', '지방'], array['유제품']),
  ('무염버터', '유제품', array['지방', '비타민A'], array['유제품']),
  ('리코타치즈', '유제품', array['단백질', '칼슘'], array['유제품']),
  ('다시마', '해조류', array['요오드', '칼슘', '알긴산'], array['해조류']),
  ('톳', '해조류', array['철분', '칼슘', '식이섬유'], array['해조류']),
  ('파래', '해조류', array['철분', '비타민A', '칼슘'], array['해조류']),
  ('쌀가루', '곡류', array['탄수화물'], array['곡류']),
  ('찹쌀', '곡류', array['탄수화물', '식이섬유'], array['곡류']),
  ('파스타면', '곡류', array['탄수화물', '단백질'], array['곡류']),
  ('당면', '곡류', array['탄수화물'], array['곡류']),
  ('기장', '곡류', array['식이섬유', '마그네슘'], array['곡류']),
  ('들기름', '조미료', array['오메가3', '불포화지방산'], array['조미료']),
  ('올리브유', '조미료', array['불포화지방산', '비타민E'], array['조미료']),
  ('아기간장', '조미료', array['아미노산'], array['조미료']),
  ('아기된장', '조미료', array['이소플라본', '아미노산'], array['조미료'])
on conflict (name) do update set
  category = excluded.category,
  primary_nutrients = excluded.primary_nutrients,
  food_groups = excluded.food_groups;

-- 2. 식재료 안전 규칙 추가
insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '동그랗고 껍질이 질겨요. 껍질을 벗기고 4등분 이상 잘라 제공하세요.'
from ingredients where name = '방울토마토'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 6
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '통째로 주면 기도가 막힐 수 있어요. 반드시 4등분으로 잘라 제공하세요.'
from ingredients where name = '방울토마토'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 12
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '산도가 있고 껍질이 질길 수 있어요. 껍질과 씨를 제거하고 푹 익혀서 제공하세요.'
from ingredients where name = '토마토'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 6
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '동그랗고 단단하여 질식 위험이 큽니다. 완전히 익혀 4등분 이상으로 잘게 으깨어 제공하세요.'
from ingredients where name = '메추리알'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 6
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '통째로 삼키지 않도록 반 또는 4등분으로 잘라 제공하세요.'
from ingredients where name = '메추리알'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 12
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'other', '덜 익은 아보카도는 단단하고 소화가 어려워요. 완전히 후숙된 부드러운 과육만 으깨서 제공하세요.'
from ingredients where name = '아보카도'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 6
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'allergen', '과일 알레르기 유발 가능성이 있습니다. 껍질을 두껍게 벗기고 씨 주변을 피해 부드러운 과육만 소량 시작하세요.'
from ingredients where name = '복숭아'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 6
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '조직이 질겨 질식 위험이 있어요. 완전히 익힌 뒤 아주 잘게 다져서 제공하세요.'
from ingredients where name = '오징어'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 12
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'other', '염분이 높을 수 있으므로 미온수에 담가 짠기를 뺀 후 조리하세요.'
from ingredients where name = '멸치'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 12
);

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'other', '가시를 완전히 제거한 순살을 사용하고 기름기가 많으므로 바짝 구워 기름을 빼고 제공하세요.'
from ingredients where name = '고등어'
and not exists (
  select 1 from ingredient_safety_rules sr
  where sr.ingredient_id = ingredients.id and sr.age_from_month = 12
);

-- 3. 신규 레시피 55종 및 연관 데이터 추가

-- 레시피: 소고기 청경채죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기 청경채죽', '6-8', 15, 1, true, '{}', null, '소고기 핏물을 충분히 빼고 조리하세요.', 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기', 20, 'g'),
  ('청경채', 15, 'g'),
  ('쌀가루', 20, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '소고기 청경채죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '쌀가루를 찬물에 부드럽게 푼다.'),
  (2, '소고기는 핏물을 빼고 삶아 곱게 간다.'),
  (3, '청경채는 잎 부분만 데쳐 잘게 간다.'),
  (4, '모든 재료를 냄비에 넣고 저어가며 푹 끓인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '소고기 청경채죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 18, 6, 2, 0.8, array['철분', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '소고기 청경채죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 미음/죽 농도', '건더기 없이 곱게 간 형태', '푹 끓여 체에 밭쳐 부드럽게 제공', '한 김 식혀 미온수로 농도를 맞춰 먹이세요.', '없음'
from r;

-- 레시피: 닭안심 양배추죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('닭안심 양배추죽', '6-8', 18, 1, false, '{}', null, '닭안심 힘줄을 깨끗이 제거하세요.', 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('닭안심', 20, 'g'),
  ('양배추', 20, 'g'),
  ('쌀가루', 20, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '닭안심 양배추죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '닭안심 힘줄을 제거하고 삶아 믹서에 곱게 간다.'),
  (2, '양배추 잎을 부드럽게 쪄서 간다.'),
  (3, '찬물에 푼 쌀가루와 닭안심, 양배추를 섞는다.'),
  (4, '약불에서 주걱으로 저으며 걸쭉하게 끓인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '닭안심 양배추죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 19, 7, 1.5, 1, array['단백질', '비타민U'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '닭안심 양배추죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 미음/죽 농도', '고운 입자', '체에 거르거나 부드럽게 갈아 끓임', '양배추의 은은한 단맛으로 아기 선호도가 높습니다.', '없음'
from r;

-- 레시피: 대구살 감자죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('대구살 감자죽', '6-8', 15, 1, true, '{생선}', '생선 가시가 완전히 제거되었는지 두 번 확인하세요.', '신선한 순살 대구살만 사용하세요.', 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('대구살', 20, 'g'),
  ('감자', 25, 'g'),
  ('쌀가루', 15, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '대구살 감자죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '대구살의 가시를 꼼꼼히 확인하고 푹 찐 뒤 으깬다.'),
  (2, '감자는 껍질을 벗겨 찐 후 곱게 으깬다.'),
  (3, '냄비에 쌀가루 푼 물과 대구살, 감자를 넣는다.'),
  (4, '약불에서 5분간 뭉근하게 끓인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '대구살 감자죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 16, 6, 1, 0.7, array['단백질', '칼륨'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '대구살 감자죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '고운 감자 스프 농도', '가시 없는 고운 입자', '대구살을 푹 익혀 곱게 으깸', '생선 가시가 없는지 두 번 확인하세요.', '없음'
from r;

-- 레시피: 콜리플라워 소고기죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('콜리플라워 소고기죽', '6-8', 18, 1, false, '{}', null, null, 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기', 20, 'g'),
  ('콜리플라워', 20, 'g'),
  ('쌀가루', 20, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '콜리플라워 소고기죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '콜리플라워 꽃송이만 끓는 물에 데쳐 곱게 간다.'),
  (2, '소고기는 핏물을 빼고 익혀 곱게 간다.'),
  (3, '쌀가루 푼 물에 소고기와 콜리플라워를 섞는다.'),
  (4, '약불에서 저어가며 푹 끓여낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '콜리플라워 소고기죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 17, 6.5, 2, 1.1, array['철분', '비타민C'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '콜리플라워 소고기죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 죽 농도', '입자 없는 퓨레 상태', '콜리플라워와 소고기를 곱게 갈아 조리', '비타민C가 소고기 철분 흡수를 돕습니다.', '없음'
from r;

-- 레시피: 비트 사과 퓨레
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('비트 사과 퓨레', '6-8', 12, 1, true, '{}', null, '비트는 소화기관이 미숙한 아기를 위해 소량만 섞으세요.', 'snack')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('비트', 15, 'g'),
  ('사과', 45, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '비트 사과 퓨레')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '비트는 껍질을 벗겨 찜기에 푹 찐다.'),
  (2, '사과는 껍질과 씨를 제거하고 작게 썬다.'),
  (3, '익힌 비트와 사과를 믹서에 넣고 곱게 간다.'),
  (4, '소분하여 미온으로 식혀 먹인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '비트 사과 퓨레')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 12, 0.5, 0.2, 1.4, array['철분', '비타민C'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '비트 사과 퓨레')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '고운 과일 퓨레', '숟가락으로 흘러내리는 점도', '비트를 푹 쪄서 사과와 함께 블렌딩', '예쁜 붉은색과 달콤함으로 식욕을 돋웁니다.', '없음'
from r;

-- 레시피: 단호박 사과 매시
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('단호박 사과 매시', '6-8', 10, 1, true, '{}', null, null, 'snack')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('단호박', 40, 'g'),
  ('사과', 30, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '단호박 사과 매시')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '단호박 껍질과 씨를 제거하고 푹 찐다.'),
  (2, '사과는 강판에 갈거나 살짝 쪄서 준비한다.'),
  (3, '단호박과 사과를 볼에 넣고 곱게 으깬다.'),
  (4, '부드러운 스프 상태가 되도록 잘 섞는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '단호박 사과 매시')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 14, 1, 0.3, 1.8, array['베타카로틴', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '단호박 사과 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 매시 형태', '덩어리 없이 크리미한 상태', '푹 쪄서 곱게 으깸', '변비가 있는 아기에게 특히 좋은 영양 간식입니다.', '없음'
from r;

-- 레시피: 아보카도 바나나 퓨레
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아보카도 바나나 퓨레', '6-8', 5, 1, true, '{}', null, '충분히 후숙되어 부드러운 아보카도를 사용하세요.', 'snack')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('아보카도', 30, 'g'),
  ('바나나', 40, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아보카도 바나나 퓨레')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '잘 익은 아보카도의 부드러운 과육만 덜어낸다.'),
  (2, '바나나 껍질을 벗겨 포크로 곱게 으깬다.'),
  (3, '아보카도와 바나나를 섞어 크림처럼 으깬다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아보카도 바나나 퓨레')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 15, 1.2, 4.5, 2.2, array['불포화지방산', '칼륨'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아보카도 바나나 퓨레')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '크리미한 요거트 질감', '매끄럽게 으깬 상태', '열을 가하지 않고 즉석에서 으깸', '두뇌 발달에 좋은 좋은 지방이 듬뿍 들어있습니다.', '없음'
from r;

-- 레시피: 가자미살 당근죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('가자미살 당근죽', '6-8', 15, 1, true, '{생선}', '가시가 없는지 꼼꼼하게 살피세요.', null, 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('가자미살', 20, 'g'),
  ('당근', 15, 'g'),
  ('쌀가루', 20, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '가자미살 당근죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '가자미살은 푹 쪄서 가시가 없도록 손으로 으깬다.'),
  (2, '당근은 삶아 곱게 간다.'),
  (3, '냄비에 쌀가루 물과 가자미, 당근을 넣는다.'),
  (4, '약불에서 주걱으로 저으며 5분간 끓인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '가자미살 당근죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 17, 5.5, 0.8, 0.9, array['단백질', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '가자미살 당근죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 죽', '가시 확인 후 곱게 으깬 형태', '가자미를 푹 쪄서 곱게 간 재료와 끓임', '비린내가 적어 초기 생선 이유식으로 가장 좋습니다.', '없음'
from r;

-- 레시피: 오트밀 단호박죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('오트밀 단호박죽', '6-8', 10, 1, true, '{}', null, null, 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('오트밀', 20, 'g'),
  ('단호박', 35, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '오트밀 단호박죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '단호박은 껍질을 벗겨 찐 후 부드럽게 으깬다.'),
  (2, '냄비에 오트밀과 물 120ml를 넣고 끓인다.'),
  (3, '오트밀이 퍼지면 단호박을 넣고 잘 섞는다.'),
  (4, '약불에서 2분간 저어 부드러운 죽으로 완성한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '오트밀 단호박죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 21, 3.2, 1.5, 2.5, array['철분', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '오트밀 단호박죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 오트밀 죽', '푹 퍼진 미세 오트밀', '오트밀을 푹 불려 단호박과 조리', '아침 대용으로 빠르고 영양가 높은 한 끼입니다.', '없음'
from r;

-- 레시피: 청경채 고구마 매시
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('청경채 고구마 매시', '6-8', 12, 1, true, '{}', null, null, 'snack')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('청경채', 15, 'g'),
  ('고구마', 45, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '청경채 고구마 매시')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '고구마는 껍질을 벗겨 찜기에 푹 찐다.'),
  (2, '청경채 잎을 살짝 데쳐 곱게 다지거나 간다.'),
  (3, '익힌 고구마에 물 약간을 섞으며 곱게 으깬다.'),
  (4, '청경채를 고구마와 골고루 섞어 완성한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '청경채 고구마 매시')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 16, 1.2, 0.2, 1.5, array['비타민A', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '청경채 고구마 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '촉촉한 매시 질감', '입자 없는 퓨레', '고구마 쪄서 으깨고 청경채 섞기', '달달한 고구마 맛으로 채소 거부감을 줄여줍니다.', '없음'
from r;

-- 레시피: 소고기 표고버섯 진밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기 표고버섯 진밥', '9-11', 20, 2, false, '{}', null, '버섯은 아기가 씹기 좋게 3~5mm로 다지세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기다짐육', 30, 'g'),
  ('표고버섯', 15, 'g'),
  ('당근', 15, 'g'),
  ('밥', 60, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '소고기 표고버섯 진밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '표고버섯과 당근을 3~5mm 크기로 다진다.'),
  (2, '냄비에 소고기다짐육을 볶다가 표고와 당근을 넣는다.'),
  (3, '물 100ml와 밥을 넣고 중불에서 끓인다.'),
  (4, '밥알이 퍼지고 재료가 부드러워질 때까지 저어가며 익힌다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '소고기 표고버섯 진밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 25, 9, 3, 1.5, array['철분', '비타민D'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '소고기 표고버섯 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 5배죽/진밥', '3~5mm 작은 입자', '표고와 소고기를 푹 익혀 부드럽게 조리', '표고버섯의 풍부한 감칠맛으로 소금 없이도 맛있습니다.', '소량'
from r;

-- 레시피: 닭안심 단호박 진밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('닭안심 단호박 진밥', '9-11', 18, 1, false, '{}', null, null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('닭안심', 30, 'g'),
  ('단호박', 30, 'g'),
  ('밥', 60, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '닭안심 단호박 진밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '닭안심을 삶아 결대로 잘게 다진다.'),
  (2, '단호박은 껍질을 벗겨 4mm 크기로 깍둑썰기한다.'),
  (3, '냄비에 밥, 닭안심, 단호박, 물을 넣고 끓인다.'),
  (4, '약불에서 단호박이 부드럽게 으깨질 때까지 뜸을 들인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '닭안심 단호박 진밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 27, 8.5, 1.5, 1.8, array['단백질', '베타카로틴'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '닭안심 단호박 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '촉촉한 진밥', '3~5mm 다짐', '닭안심을 푹 끓여 부드럽게 조리', '단호박의 단맛이 닭고기와 잘 어우러집니다.', '없음'
from r;

-- 레시피: 순두부 계란죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('순두부 계란죽', '9-11', 10, 1, true, '{계란,대두}', null, '계란을 완전히 완숙으로 익히세요.', 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('순두부', 50, 'g'),
  ('계란', 1, '개'),
  ('밥', 50, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '순두부 계란죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '냄비에 밥과 물 100ml를 넣고 끓여 부드럽게 만든다.'),
  (2, '순두부를 숟가락으로 으깨며 넣는다.'),
  (3, '계란을 곱게 풀어 빙 둘러 넣고 완전히 익을 때까지 젓는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '순두부 계란죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 20, 9.5, 5.5, 0.6, array['단백질', '칼슘'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '순두부 계란죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드럽고 몽글몽글한 죽', '부드러운 순두부 입자', '계란을 완전히 완숙으로 익힘', '목 넘김이 매우 부드러워 감기 걸렸을 때도 좋습니다.', '없음'
from r;

-- 레시피: 대구살 브로콜리 리조또
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('대구살 브로콜리 리조또', '9-11', 15, 2, true, '{생선,우유}', '생선 가시가 없는지 확인하세요.', '우유 알레르기가 있는지 확인하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('대구살', 30, 'g'),
  ('브로콜리', 20, 'g'),
  ('우유', 30, 'ml'),
  ('밥', 60, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '대구살 브로콜리 리조또')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '대구살을 쪄서 가시를 살피며 잘게 부순다.'),
  (2, '브로콜리는 꽃 부분만 데쳐 잘게 다진다.'),
  (3, '팬에 밥과 물 50ml, 우유 30ml를 넣고 끓인다.'),
  (4, '대구살과 브로콜리를 넣고 걸쭉해질 때까지 조린다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '대구살 브로콜리 리조또')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 24, 8, 2.2, 1.2, array['칼슘', '비타민C'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '대구살 브로콜리 리조또')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '고소한 리조또 진밥', '3~4mm 입자', '우유를 넣어 부드럽게 끓임', '우유 알레르기가 없는지 사전에 확인하세요.', '소량'
from r;

-- 레시피: 사과 당근 핑거스틱
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('사과 당근 핑거스틱', '9-11', 12, 1, true, '{}', '당근이 푹 물러 손으로 눌렀을 때 쉽게 으스러지는지 확인하세요.', '아기가 먹을 때 곁에서 지켜보세요.', 'finger_food')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('사과', 30, 'g'),
  ('당근', 30, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '사과 당근 핑거스틱')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '당근과 사과를 아기 손가락 굵기(길이 4~5cm, 두께 5mm) 스틱 모양으로 자른다.'),
  (2, '찜기에 당근을 먼저 올려 8분간 푹 찐다.'),
  (3, '사과를 넣고 3분간 더 쪄서 잇몸으로 으깰 수 있게 익힌다.'),
  (4, '식혀서 아기 식판에 올려준다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '사과 당근 핑거스틱')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 10, 0.5, 0.2, 1.6, array['비타민A', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '사과 당근 핑거스틱')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '잇몸으로 뭉개지는 스틱', '손가락 크기 스틱 (길이 4cm)', '푹 쪄서 손으로 눌렀을 때 쉽게 으깨지도록 조리', '아기가 손으로 쥐고 갉아먹는 연습에 최적입니다.', '없음'
from r;

-- 레시피: 완두콩 감자 수프
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('완두콩 감자 수프', '9-11', 12, 1, true, '{우유}', '완두콩 낱알 흡인 위험이 있으므로 반드시 곱게 갈아 조리하세요.', null, 'soup')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('완두콩', 25, 'g'),
  ('감자', 40, 'g'),
  ('우유', 40, 'ml')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '완두콩 감자 수프')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '완두콩은 삶아 껍질을 벗겨 준비한다.'),
  (2, '감자는 껍질을 벗겨 얇게 썰어 삶는다.'),
  (3, '완두콩과 감자를 믹서에 넣고 우유와 함께 부드럽게 간다.'),
  (4, '냄비에 담아 약불에서 한소끔 데워낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '완두콩 감자 수프')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 15, 4.5, 1.8, 2.1, array['식이섬유', '칼슘'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '완두콩 감자 수프')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 크림 수프', '부드럽게 간 스프', '완두콩 껍질을 벗겨 체에 걸러 조리', '완두콩 껍질을 벗기면 소화가 훨씬 잘 됩니다.', '없음'
from r;

-- 레시피: 게살 야채죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('게살 야채죽', '9-11', 15, 1, true, '{갑각류}', '게살 껍질 조각이 들어가지 않았는지 확인하세요.', '갑각류 알레르기 유무를 먼저 확인하세요.', 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('게살', 25, 'g'),
  ('애호박', 20, 'g'),
  ('당근', 15, 'g'),
  ('밥', 60, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '게살 야채죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '게살을 결대로 곱게 찢는다.'),
  (2, '애호박과 당근을 3mm 크기로 다진다.'),
  (3, '냄비에 밥과 물 120ml를 붓고 끓인다.'),
  (4, '야채와 게살을 넣고 밥알이 푹 퍼질 때까지 끓인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '게살 야채죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 24, 7, 0.8, 1.2, array['단백질', '키토산'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '게살 야채죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 죽 농도', '잘게 찢은 게살과 다진 채소', '푹 끓여 진밥/죽 형태로 완성', '갑각류 알레르기 여부를 사전에 소량 확인하세요.', '없음'
from r;

-- 레시피: 소고기 비트 진밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기 비트 진밥', '9-11', 20, 2, false, '{}', null, null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기다짐육', 30, 'g'),
  ('비트', 15, 'g'),
  ('양파', 15, 'g'),
  ('밥', 60, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '소고기 비트 진밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '비트와 양파를 3~4mm 크기로 잘게 다진다.'),
  (2, '냄비에 소고기다짐육과 양파를 볶는다.'),
  (3, '비트, 밥, 물 100ml를 붓고 중약불에서 끓인다.'),
  (4, '예쁜 분홍빛 진밥이 되도록 저어가며 조린다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '소고기 비트 진밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 26, 8.5, 2.8, 1.4, array['철분', '엽산'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '소고기 비트 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '촉촉한 진밥', '3~4mm 크기 다짐', '비트와 소고기를 푹 익혀 부드럽게 조리', '철분이 매우 풍부하여 빈혈 예방에 탁월합니다.', '소량'
from r;

-- 레시피: 연어 양배추 진밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('연어 양배추 진밥', '9-11', 18, 1, false, '{생선}', '연어 가시와 껍질을 완벽하게 제거하세요.', null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('연어', 30, 'g'),
  ('양배추', 25, 'g'),
  ('밥', 60, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '연어 양배추 진밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '연어는 쪄서 가시와 껍질을 제거하고 살코기만 으깬다.'),
  (2, '양배추는 잎 부분을 부드럽게 다진다.'),
  (3, '냄비에 밥, 연어, 양배추, 물 100ml를 넣고 끓인다.'),
  (4, '약불에서 7분간 푹 익혀 완성한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '연어 양배추 진밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 24, 8.8, 3.5, 1.3, array['오메가3', '단백질'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '연어 양배추 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 진밥', '3~5mm 다짐', '연어 살코기를 부드럽게 익힘', '연어의 고소한 지방과 양배추의 단맛이 일품입니다.', '없음'
from r;

-- 레시피: 가자미 감자조림밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('가자미 감자조림밥', '9-11', 18, 2, false, '{생선}', '가시를 꼼꼼히 제거하세요.', null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('가자미살', 30, 'g'),
  ('감자', 35, 'g'),
  ('당근', 15, 'g'),
  ('밥', 60, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '가자미 감자조림밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '감자와 당근을 4mm 크기로 썬다.'),
  (2, '가자미살은 가시를 살피고 작게 썬다.'),
  (3, '냄비에 물 120ml와 감자, 당근을 넣고 먼저 익힌다.'),
  (4, '가자미와 밥을 넣고 밥알이 푹 무를 때까지 조린다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '가자미 감자조림밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 27, 7.5, 1.2, 1.4, array['단백질', '칼륨'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '가자미 감자조림밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '촉촉한 진밥', '4mm 부드러운 조각', '감자와 가자미를 푹 끓여 무르게 조리', '간을 하지 않아도 생선과 채소의 단맛이 우러납니다.', '소량'
from r;

-- 레시피: 아보카도 계란 노른자 비빔밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아보카도 계란 노른자 비빔밥', '9-11', 8, 1, true, '{계란}', null, '계란은 완전히 완숙으로 익힌 노른자를 사용하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('아보카도', 30, 'g'),
  ('계란', 1, '개'),
  ('밥', 60, 'g'),
  ('김', 1, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아보카도 계란 노른자 비빔밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '계란은 완숙으로 삶아 노른자만 분리해 으깬다.'),
  (2, '잘 익은 아보카도를 작게 깍둑썰기한다.'),
  (3, '따뜻한 진밥 위에 계란 노른자와 아보카도를 얹는다.'),
  (4, '김을 아주 잘게 부수어 올리고 골고루 비빈다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아보카도 계란 노른자 비빔밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 26, 6.2, 7, 2.3, array['콜린', '불포화지방산'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아보카도 계란 노른자 비빔밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드럽고 크리미한 비빔밥', '노른자 으깸, 아보카도 작은 조각', '계란 완숙 삶기', '돌 전에는 계란 노른자 위주로 시작하는 것을 권장합니다.', '없음'
from r;

-- 레시피: 닭안심 핑거스틱
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('닭안심 핑거스틱', '9-11', 15, 1, false, '{}', '부드럽게 쪄서 아기가 잇몸으로 베어 물 수 있게 하세요.', null, 'finger_food')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('닭안심', 40, 'g'),
  ('당근', 15, 'g'),
  ('양파', 10, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '닭안심 핑거스틱')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '닭안심 힘줄을 제거하고 믹서에 곱게 간다.'),
  (2, '당근과 양파를 아주 곱게 다져 닭고기와 섞는다.'),
  (3, '반죽을 손가락 굵기 스틱 모양으로 빚는다.'),
  (4, '찜기에 올려 10분간 속까지 충분히 찐다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '닭안심 핑거스틱')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 10.5, 1.2, 0.6, array['단백질', '아연'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '닭안심 핑거스틱')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 핑거푸드 스틱', '손가락 굵기 스틱', '찜기에서 부드럽게 찜', '기름 없이 쪄서 퍽퍽하지 않고 촉촉합니다.', '없음'
from r;

-- 레시피: 맑은 순두부 계란국
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('맑은 순두부 계란국', '12-17', 10, 1, true, '{계란,대두}', null, '염도를 낮추기 위해 국간장은 소량만 사용하세요.', 'soup')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('순두부', 60, 'g'),
  ('계란', 1, '개'),
  ('대파', 5, 'g'),
  ('국간장', 2, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '맑은 순두부 계란국')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '물 250ml에 국간장 약간을 넣고 끓인다.'),
  (2, '순두부를 숟가락으로 큼직하게 떠 넣는다.'),
  (3, '계란을 곱게 풀어 냄비 가장자리에 둘러 넣는다.'),
  (4, '송송 썬 대파를 넣고 한소끔 끓여 불을 끈다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '맑은 순두부 계란국')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 2, 9.8, 6, 0.4, array['단백질', '칼슘'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '맑은 순두부 계란국')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 맑은 국', '한입 크기 순두부', '센 불에 오래 끓이지 않고 부드럽게 익힘', '간을 최소화하고 따뜻하게 밥과 곁들여주세요.', '없음'
from r;

-- 레시피: 잔멸치 아기 주먹밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('잔멸치 아기 주먹밥', '12-17', 8, 1, true, '{생선}', '주먹밥을 너무 크지 않게 한입 크기로 빚으세요.', '멸치의 짠기를 물에 불려 뺀 뒤 사용하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('멸치', 10, 'g'),
  ('김', 2, 'g'),
  ('밥', 80, 'g'),
  ('참기름', 3, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '잔멸치 아기 주먹밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '잔멸치를 미온수에 5분간 불려 짠기를 뺀 뒤 마른 팬에 볶는다.'),
  (2, '볶은 멸치를 칼로 잘게 다진다.'),
  (3, '볼에 따뜻한 밥, 멸치, 잘게 부순 김, 참기름을 넣고 섞는다.'),
  (4, '아기가 한입에 먹기 좋은 작은 완자 크기로 뭉친다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '잔멸치 아기 주먹밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 44, 7.2, 4.5, 1, array['칼슘', '철분'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '잔멸치 아기 주먹밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '핑거푸드 주먹밥', '지름 1.5~2cm 볼 형태', '멸치 짠기 빼고 마른 팬 볶기', '손으로 집어먹는 자기주도 식사에 훌륭합니다.', '소량'
from r;

-- 레시피: 토마토 소고기 리조또
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('토마토 소고기 리조또', '12-17', 18, 2, false, '{우유}', null, '토마토 껍질은 질길 수 있으니 꼭 벗겨서 조리하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('토마토', 40, 'g'),
  ('소고기다짐육', 35, 'g'),
  ('양파', 15, 'g'),
  ('밥', 70, 'g'),
  ('아기치즈', 1, '장')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '토마토 소고기 리조또')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '토마토는 끓는 물에 데쳐 껍질을 벗기고 잘게 다진다.'),
  (2, '팬에 소고기와 다진 양파를 볶는다.'),
  (3, '토마토와 밥, 물 60ml를 넣고 자작하게 졸인다.'),
  (4, '불을 끄고 아기치즈를 넣어 여열로 녹이며 섞는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '토마토 소고기 리조또')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 38, 13.5, 7.8, 2.1, array['라이코펜', '철분'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '토마토 소고기 리조또')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '크리미한 치즈 리조또', '5~8mm 입자', '토마토 껍질 제거 후 치즈로 부드럽게 마무리', '상큼하고 고소하여 편식하는 아기도 잘 먹습니다.', '소량'
from r;

-- 레시피: 팽이버섯 소고기덮밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('팽이버섯 소고기덮밥', '12-17', 15, 1, true, '{}', '팽이버섯이 길면 목에 걸릴 수 있으니 1cm 이하로 썰어주세요.', null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('팽이버섯', 30, 'g'),
  ('소고기', 35, 'g'),
  ('양파', 20, 'g'),
  ('밥', 80, 'g'),
  ('참기름', 3, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '팽이버섯 소고기덮밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '팽이버섯은 밑동을 자르고 1cm 길이로 송송 썬다.'),
  (2, '소고기와 양파는 작게 채썬다.'),
  (3, '팬에 참기름을 두르고 소고기와 양파를 볶는다.'),
  (4, '팽이버섯과 물 50ml를 넣고 버섯 숨이 죽을 때까지 익혀 밥 위에 얹는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '팽이버섯 소고기덮밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 43, 12.8, 6.2, 2.4, array['철분', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '팽이버섯 소고기덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 덮밥', '1cm 짧은 길이', '버섯을 짧게 잘라 충분히 익힘', '팽이버섯은 길면 목에 걸릴 수 있으니 짧게 썰어주세요.', '소량'
from r;

-- 레시피: 새송이버섯 들기름구이
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('새송이버섯 들기름구이', '12-17', 10, 1, true, '{}', null, null, 'snack')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('새송이버섯', 50, 'g'),
  ('들기름', 5, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '새송이버섯 들기름구이')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '새송이버섯을 아기가 씹기 좋은 0.5cm 두께로 깍둑썰기한다.'),
  (2, '팬에 들기름을 두르고 약불로 예열한다.'),
  (3, '버섯을 넣고 노릇하고 촉촉해질 때까지 은근하게 굽는다.'),
  (4, '한 김 식혀 핑거푸드 반찬으로 낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '새송이버섯 들기름구이')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 2, 5, 1.8, array['오메가3', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '새송이버섯 들기름구이')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '쫄깃하고 부드러운 구이', '작은 깍둑썰기 (7~8mm)', '들기름에 약불로 은근히 구움', '들기름의 고소한 향으로 버섯을 맛있게 즐길 수 있습니다.', '소량'
from r;

-- 레시피: 아기 토마토 파스타
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 토마토 파스타', '12-17', 15, 2, true, '{밀}', '파스타면은 1~2cm 짧은 길이로 잘라 제공하세요.', '면을 평소보다 푹 삶아 부드럽게 조리하세요.', 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('파스타면', 35, 'g'),
  ('토마토', 45, 'g'),
  ('소고기다짐육', 25, 'g'),
  ('양파', 15, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 토마토 파스타')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '파스타면(숏파스타 또는 잘게 부순 면)을 부드럽게 푹 삶는다.'),
  (2, '토마토는 껍질을 벗겨 으깨고 양파는 다진다.'),
  (3, '팬에 소고기와 양파를 볶다가 토마토 퓨레를 넣고 조린다.'),
  (4, '삶은 파스타면을 넣고 소스가 배어들도록 1분간 버무린다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 토마토 파스타')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 32, 10.2, 4.5, 2, array['라이코펜', '철분'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 토마토 파스타')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 면 요리', '1~2cm 짧은 면 또는 마카로니', '면을 평소보다 2~3분 더 푹 삶음', '면을 작게 잘라 숟가락이나 포크로 떠먹게 해주세요.', '소량'
from r;

-- 레시피: 대구살전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('대구살전', '12-17', 12, 1, true, '{생선,계란}', '가시가 없는지 두 번 확인하세요.', '계란 옷을 충분히 익히세요.', 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('대구살', 45, 'g'),
  ('계란', 1, '개'),
  ('당근', 10, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '대구살전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '대구살을 가시 없이 확인하고 칼등으로 곱게 으깬다.'),
  (2, '당근을 잘게 다져 대구살, 푼 계란과 함께 섞는다.'),
  (3, '팬에 기름을 살짝 두르고 한 숟가락씩 떠 올린다.'),
  (4, '약불에서 속까지 완전히 익혀낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '대구살전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 2, 14.5, 5.8, 0.5, array['고단백', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '대구살전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '촉촉하고 부드러운 전', '한입 크기 핑거푸드', '약불에서 계란 옷이 타지 않게 조리', '가시가 없는 순살 생선 패티로 밥반찬에 아주 좋습니다.', '소량'
from r;

-- 레시피: 부추 계란전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('부추 계란전', '12-17', 10, 1, true, '{계란}', '부추는 질길 수 있으니 1cm 이하로 썰어주세요.', null, 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('부추', 25, 'g'),
  ('계란', 1, '개'),
  ('당근', 15, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '부추 계란전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '부추를 깨끗이 씻어 1cm 길이로 송송 썬다.'),
  (2, '당근은 잘게 채썰어 부추와 함께 계란물에 넣는다.'),
  (3, '팬을 달궈 반죽을 얇고 넓게 부친다.'),
  (4, '앞뒤로 노릇하게 완전히 익힌 뒤 한입 크기로 자른다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '부추 계란전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 7.2, 5.2, 1.1, array['단백질', '철분'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '부추 계란전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 전 요리', '1.5cm 조각', '부추를 짧게 썰어 속까지 익힘', '부추는 질길 수 있으므로 짧게 송송 썰어주세요.', '소량'
from r;

-- 레시피: 소고기 무국밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기 무국밥', '12-17', 20, 2, false, '{}', null, '무를 푹 끓여 입안에서 쉽게 으깨지도록 하세요.', 'soup')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기', 40, 'g'),
  ('무', 40, 'g'),
  ('대파', 10, 'g'),
  ('밥', 80, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '소고기 무국밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '소고기는 핏물을 빼고 얇게 썬다.'),
  (2, '무는 아기가 씹기 좋게 얇은 나박썰기를 한다.'),
  (3, '냄비에 소고기와 무를 볶다가 물 300ml를 붓고 푹 끓인다.'),
  (4, '무가 투명하게 익으면 대파를 넣고 밥과 함께 낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '소고기 무국밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 44, 13.2, 5.5, 1.6, array['철분', '비타민C'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '소고기 무국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '시원하고 부드러운 국밥', '얇고 작은 나박썰기', '무를 푹 끓여 입에서 으깨지도록 조리', '국물에 밥을 말아 부드럽게 넘길 수 있습니다.', '소량'
from r;

-- 레시피: 단호박 치즈 리조또
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('단호박 치즈 리조또', '12-17', 12, 1, true, '{유제품}', null, '치즈의 염도를 감안해 추가 간을 하지 마세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('단호박', 50, 'g'),
  ('아기치즈', 1, '장'),
  ('우유', 30, 'ml'),
  ('밥', 70, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '단호박 치즈 리조또')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '단호박은 쪄서 숟가락으로 부드럽게 으깬다.'),
  (2, '냄비에 밥, 으깬 단호박, 우유를 넣고 끓인다.'),
  (3, '약불에서 2분간 저으며 농도를 맞춘다.'),
  (4, '불을 끄고 아기치즈를 넣어 녹여 섞는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '단호박 치즈 리조또')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 41, 7.8, 6.5, 2.2, array['칼슘', '베타카로틴'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '단호박 치즈 리조또')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드럽고 달콤한 리조또', '밥알과 으깬 단호박', '치즈를 마지막에 녹여 풍미를 더함', '칼슘과 비타민A를 맛있게 보충할 수 있습니다.', '없음'
from r;

-- 레시피: 새우 브로콜리 볶음밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('새우 브로콜리 볶음밥', '12-17', 15, 2, true, '{갑각류}', '새우살을 질기지 않게 잘게 다져 볶으세요.', '새우 내장을 깨끗이 제거하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('새우', 30, 'g'),
  ('브로콜리', 25, 'g'),
  ('당근', 15, 'g'),
  ('밥', 80, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '새우 브로콜리 볶음밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '새우는 내장을 제거하고 잘게 다진다.'),
  (2, '브로콜리와 당근을 5mm 크기로 다진다.'),
  (3, '팬에 기름을 살짝 두르고 당근과 새우를 볶는다.'),
  (4, '브로콜리와 밥을 넣고 골고루 볶아 완성한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '새우 브로콜리 볶음밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 45, 10.5, 3.8, 1.8, array['단백질', '키토산'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '새우 브로콜리 볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '촉촉한 볶음밥', '5mm 작은 입자', '새우를 작게 다져 질기지 않게 볶음', '새우의 감칠맛이 살아있는 인기 만점 볶음밥입니다.', '소량'
from r;

-- 레시피: 소고기 양배추 덮밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기 양배추 덮밥', '12-17', 15, 1, true, '{}', null, null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기', 35, 'g'),
  ('양배추', 35, 'g'),
  ('양파', 15, 'g'),
  ('밥', 80, 'g'),
  ('참기름', 3, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '소고기 양배추 덮밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '소고기, 양배추, 양파를 5~8mm 크기로 채썬다.'),
  (2, '팬에 참기름을 두르고 소고기와 양파를 볶는다.'),
  (3, '양배추와 물 50ml를 넣고 뚜껑을 덮어 숨을 죽인다.'),
  (4, '양배추가 투명하고 달큰해지면 밥 위에 얹는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '소고기 양배추 덮밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 45, 12, 6, 2.3, array['철분', '비타민U'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '소고기 양배추 덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 덮밥', '5~8mm 채썰기', '양배추를 푹 익혀 부드러운 단맛 추출', '소화가 잘되어 저녁 메뉴로 안성맞춤입니다.', '소량'
from r;

-- 레시피: 닭안심 야채 핑거볼
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('닭안심 야채 핑거볼', '12-17', 18, 2, false, '{}', '한입에 삼키지 않도록 아기 입 크기에 맞게 빚으세요.', null, 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('닭안심', 45, 'g'),
  ('당근', 15, 'g'),
  ('애호박', 15, 'g'),
  ('밥', 50, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '닭안심 야채 핑거볼')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '닭안심을 곱게 다지고 당근과 애호박도 잘게 다진다.'),
  (2, '볼에 닭안심, 야채, 밥을 넣고 끈기가 생기게 치댄다.'),
  (3, '동글동글 한입 크기(지름 2cm) 경단 모양으로 빚는다.'),
  (4, '찜기에 올려 12분간 속까지 푹 쪄낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '닭안심 야채 핑거볼')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 30, 12.5, 2, 1.2, array['단백질', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '닭안심 야채 핑거볼')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 완자 형태', '지름 1.5~2cm 볼', '찜기에서 부드럽게 찜', '식어도 부드러워 외출용 도시락 메뉴로도 좋습니다.', '없음'
from r;

-- 레시피: 아기 소불고기 덮밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 소불고기 덮밥', '18-23', 18, 2, false, '{대두}', null, '설탕 대신 배를 갈아 넣어 단맛을 조절하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기', 45, 'g'),
  ('양파', 25, 'g'),
  ('표고버섯', 15, 'g'),
  ('배', 15, 'g'),
  ('밥', 90, 'g'),
  ('아기간장', 5, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 소불고기 덮밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '배를 강판에 갈아 아기간장과 섞어 불고기 양념을 만든다.'),
  (2, '소고기는 얇게 썰어 양념에 5분간 재운다.'),
  (3, '양파와 표고버섯을 채썬다.'),
  (4, '팬에 고기와 야채, 물 약간을 넣고 부드럽게 익혀 밥에 얹는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 소불고기 덮밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 52, 15.5, 7.2, 2.5, array['철분', '비타민D'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 소불고기 덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 불고기 덮밥', '1~1.5cm 한입 크기', '배즙으로 연육하여 부드럽게 조리', '설탕 없이 배의 천연 단맛으로 감칠맛을 냅니다.', '소량'
from r;

-- 레시피: 닭안심 데리야끼 조림
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('닭안심 데리야끼 조림', '18-23', 15, 2, true, '{대두}', null, '짜지 않게 물을 넉넉히 잡고 조리하세요.', 'stew')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('닭안심', 50, 'g'),
  ('양파', 20, 'g'),
  ('당근', 15, 'g'),
  ('아기간장', 5, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '닭안심 데리야끼 조림')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '닭안심을 한입 크기로 깍둑썰기한다.'),
  (2, '팬에 기름을 살짝 두르고 닭안심 표면을 익힌다.'),
  (3, '양파, 당근, 물 80ml, 아기간장을 넣는다.'),
  (4, '국물이 자작해질 때까지 은근하게 조려낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '닭안심 데리야끼 조림')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 6, 14.8, 3.5, 1, array['고단백', '비타민B'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '닭안심 데리야끼 조림')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '촉촉한 고기 반찬', '1cm 크기 깍둑썰기', '간장 소스에 조려 간이 배게 함', '짜지 않은 저염 데리야끼로 밥도둑 반찬입니다.', '소량'
from r;

-- 레시피: 들기름 팽이버섯 볶음밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('들기름 팽이버섯 볶음밥', '18-23', 10, 1, true, '{계란}', '버섯을 1cm 이하로 썰어주세요.', null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('팽이버섯', 35, 'g'),
  ('계란', 1, '개'),
  ('밥', 90, 'g'),
  ('들기름', 5, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '들기름 팽이버섯 볶음밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '팽이버섯을 1cm 길이로 송송 썬다.'),
  (2, '팬에 들기름을 두르고 팽이버섯을 달달 볶는다.'),
  (3, '계란을 넣어 스크램블 형태로 볶는다.'),
  (4, '밥을 넣고 들기름 향이 배도록 고루 볶아낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '들기름 팽이버섯 볶음밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 48, 9.8, 8.5, 2.2, array['오메가3', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '들기름 팽이버섯 볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '고소한 볶음밥', '1cm 버섯 입자', '들기름에 계란과 볶음', '재료가 간단하면서도 풍미가 아주 뛰어납니다.', '보통'
from r;

-- 레시피: 메추리알 버섯 조림
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('메추리알 버섯 조림', '18-23', 15, 1, true, '{계란,대두}', '메추리알은 질식 방지를 위해 통째로 주지 말고 4등분으로 잘라주세요.', null, 'stew')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('메추리알', 4, '개'),
  ('표고버섯', 20, 'g'),
  ('당근', 15, 'g'),
  ('아기간장', 5, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '메추리알 버섯 조림')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '메추리알을 완숙으로 삶아 껍질을 벗긴다.'),
  (2, '표고버섯과 당근을 한입 크기로 썬다.'),
  (3, '냄비에 물 100ml, 아기간장, 재료를 모두 넣고 끓인다.'),
  (4, '중약불에서 10분간 국물이 절반으로 줄 때까지 조린다.'),
  (5, '제공 시 메추리알을 반 또는 4등분으로 잘라 준다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '메추리알 버섯 조림')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 5, 7.5, 4.8, 1.2, array['단백질', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '메추리알 버섯 조림')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '탱글탱글한 조림 반찬', '메추리알 4등분 자르기', '간장 소스에 조린 후 잘라서 제공', '질식 방지를 위해 통째로 주지 말고 반드시 잘라주세요.', '없음'
from r;

-- 레시피: 맑은 감자 멸치국
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('맑은 감자 멸치국', '18-23', 15, 1, true, '{생선,계란}', null, '멸치 육수를 우려낸 뒤 멸치는 건져내세요.', 'soup')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('감자', 45, 'g'),
  ('멸치', 10, 'g'),
  ('대파', 10, 'g'),
  ('계란', 1, '개')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '맑은 감자 멸치국')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '냄비에 멸치를 넣고 볶다가 물 350ml를 부어 멸치 육수를 낸다.'),
  (2, '멸치를 건져내고 얇게 썬 감자를 넣어 익힌다.'),
  (3, '감자가 투명해지면 푼 계란을 줄알 쳐 넣는다.'),
  (4, '송송 썬 대파를 넣고 불을 끈다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '맑은 감자 멸치국')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 12, 9, 5.2, 1, array['칼슘', '칼륨'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '맑은 감자 멸치국')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '구수한 맑은 국', '포슬포슬한 감자 조각', '멸치 육수를 진하게 우려 감자와 끓임', '멸치 육수 자체의 감칠맛으로 소금 없이도 깊은 맛이 납니다.', '없음'
from r;

-- 레시피: 아기 순살 고등어구이
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 순살 고등어구이', '18-23', 12, 1, true, '{생선}', '생선 가시가 완전히 없는지 손으로 만져 확인하세요.', '기름기가 많으므로 기름을 잘 빼서 제공하세요.', 'finger_food')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('고등어', 50, 'g'),
  ('들기름', 3, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 순살 고등어구이')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '순살 고등어의 잔가시를 핀셋으로 꼼꼼히 제거한다.'),
  (2, '종이호일에 들기름을 살짝 바르고 고등어를 올린다.'),
  (3, '팬이나 에어프라이어에 겉바속촉으로 노릇하게 굽는다.'),
  (4, '살코기를 발라 한입 크기로 떼어 제공한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 순살 고등어구이')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 0, 12, 9.5, 0, array['DHA', '오메가3'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 순살 고등어구이')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '고소한 생선 구이', '가시 없는 살코기 조각', '기름을 쏙 빼며 노릇하게 구움', '두뇌 발달에 핵심인 DHA가 가장 풍부한 생선입니다.', '소량'
from r;

-- 레시피: 아기 잡채
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 잡채', '18-23', 20, 2, false, '{대두}', '당면은 목에 걸릴 수 있으니 가위로 2~3cm로 짧게 잘라주세요.', null, 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('당면', 30, 'g'),
  ('소고기', 30, 'g'),
  ('시금치', 20, 'g'),
  ('당근', 15, 'g'),
  ('아기간장', 5, 'g'),
  ('참기름', 4, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 잡채')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '당면을 부드럽게 삶아 찬물에 헹군 뒤 2~3cm 길이로 짧게 자른다.'),
  (2, '시금치는 데쳐 물기를 짜고, 당근과 소고기는 채썬다.'),
  (3, '팬에 소고기와 당근을 볶다가 시금치와 삶은 당면을 넣는다.'),
  (4, '아기간장과 참기름을 넣고 골고루 볶아낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 잡채')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 36, 9.5, 6.8, 1.8, array['철분', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 잡채')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 잡채면', '당면을 2~3cm로 짧게 자름', '당면을 푹 삶아 부드럽게 조리', '목에 걸리지 않도록 당면을 가위로 충분히 잘라주세요.', '소량'
from r;

-- 레시피: 옥수수 치즈전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('옥수수 치즈전', '18-23', 10, 1, true, '{유제품,계란}', '옥수수 알갱이를 포크나 칼등으로 살짝 으깨어 조리하세요.', null, 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('옥수수', 35, 'g'),
  ('아기치즈', 1, '장'),
  ('계란', 1, '개')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '옥수수 치즈전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '옥수수 알갱이를 칼등이나 포크로 살짝 으깬다.'),
  (2, '볼에 계란을 풀고 옥수수와 잘게 찢은 치즈를 섞는다.'),
  (3, '팬에 기름을 살짝 두르고 반죽을 한 숟가락씩 올린다.'),
  (4, '치즈가 녹으며 노릇해질 때까지 앞뒤로 굽는다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '옥수수 치즈전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 10, 8.5, 7.5, 1.4, array['칼슘', '단백질'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '옥수수 치즈전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '고소하고 쫀득한 전', '한입 크기 핑거푸드', '옥수수를 으깨어 약불에 부침', '옥수수 낱알 흡인 방지를 위해 으깨어 조리했습니다.', '소량'
from r;

-- 레시피: 연근 들기름 조림
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('연근 들기름 조림', '18-23', 15, 1, true, '{대두}', '연근이 너무 딱딱하지 않도록 먼저 푹 삶아내세요.', null, 'stew')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('연근', 40, 'g'),
  ('당근', 15, 'g'),
  ('들기름', 5, 'g'),
  ('아기간장', 4, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '연근 들기름 조림')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '연근을 껍질 벗겨 얇게 썰어 끓는 물에 5분간 삶아 아린 맛을 뺀다.'),
  (2, '삶은 연근을 아기 한입 크기로 자른다.'),
  (3, '팬에 들기름을 두르고 연근과 당근을 볶는다.'),
  (4, '물 50ml와 아기간장을 넣고 부드럽게 조려낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '연근 들기름 조림')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 9, 1.5, 5.2, 2.5, array['식이섬유', '철분'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '연근 들기름 조림')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드럽고 아삭한 조림', '얇고 작은 조각', '먼저 푹 삶은 뒤 들기름에 조림', '코피가 자주 나거나 철분이 필요한 아기에게 명약입니다.', '소량'
from r;

-- 레시피: 게살 계란 덮밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('게살 계란 덮밥', '18-23', 10, 1, true, '{갑각류,계란}', null, '계란을 완숙으로 익히세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('게살', 30, 'g'),
  ('계란', 1, '개'),
  ('대파', 10, 'g'),
  ('밥', 90, 'g'),
  ('참기름', 3, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '게살 계란 덮밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '게살을 결대로 찢고 대파는 얇게 송송 썬다.'),
  (2, '팬에 참기름을 두르고 대파와 게살을 볶는다.'),
  (3, '물 40ml를 붓고 끓어오르면 푼 계란을 둘러 촉촉하게 익힌다.'),
  (4, '따뜻한 밥 위에 몽글몽글하게 얹어낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '게살 계란 덮밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 48, 13, 7, 0.8, array['단백질', '키토산'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '게살 계란 덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '촉촉하고 부드러운 덮밥', '부드러운 계란과 게살', '계란을 완숙으로 몽글몽글하게 익힘', '호텔 중식 게살 볶음밥처럼 부드럽고 감칠맛이 좋습니다.', '소량'
from r;

-- 레시피: 아기 궁중 떡볶이
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 궁중 떡볶이', '24+', 18, 2, false, '{대두,밀}', '고기와 채소를 한입 크기로 썰어주세요.', '간을 약하게 하여 유아 입맛에 맞추세요.', 'finger_food')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기', 40, 'g'),
  ('양파', 20, 'g'),
  ('당근', 15, 'g'),
  ('표고버섯', 15, 'g'),
  ('아기간장', 5, 'g'),
  ('참기름', 4, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 궁중 떡볶이')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '소고기와 채소들을 먹기 좋은 크기로 썬다.'),
  (2, '팬에 참기름을 두르고 소고기와 야채를 볶는다.'),
  (3, '물 80ml와 아기간장을 넣고 자작하게 끓인다.'),
  (4, '채소와 고기가 부드럽게 익어 양념이 배면 불을 끈다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 궁중 떡볶이')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 10, 14, 8.5, 2.2, array['철분', '비타민D'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 궁중 떡볶이')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '부드러운 조림/핑거푸드', '1~1.5cm 한입 크기', '간장 소스에 채소와 고기를 볶아 조림', '맵지 않고 달콤 짭짤하여 유아식 최고의 특식입니다.', '소량'
from r;

-- 레시피: 전복 영양죽
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('전복 영양죽', '24+', 22, 2, false, '{패류}', '전복 살을 충분히 잘게 다져 씹기 편하게 하세요.', '전복 알레르기가 있는지 확인하세요.', 'porridge')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('전복', 35, 'g'),
  ('당근', 15, 'g'),
  ('애호박', 15, 'g'),
  ('밥', 80, 'g'),
  ('참기름', 4, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '전복 영양죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '전복을 깨끗이 솔로 씻어 내장을 떼고 살만 잘게 다진다.'),
  (2, '당근과 애호박도 잘게 다진다.'),
  (3, '냄비에 참기름을 두르고 전복을 달달 볶는다.'),
  (4, '밥과 물 200ml, 야채를 넣고 밥알이 푹 퍼지도록 끓인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '전복 영양죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 45, 12.5, 5.5, 1.5, array['아르기닌', '타우린'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '전복 영양죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '진하고 구수한 죽', '잘게 다진 전복 살코기', '참기름에 볶아 푹 끓임', '체력 보충과 입맛을 돋우는 대표 보양 이유식입니다.', '소량'
from r;

-- 레시피: 아기 버섯 불고기
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 버섯 불고기', '24+', 18, 2, false, '{대두}', null, null, 'stew')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('소고기', 50, 'g'),
  ('팽이버섯', 20, 'g'),
  ('새송이버섯', 20, 'g'),
  ('양파', 20, 'g'),
  ('아기간장', 5, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 버섯 불고기')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '소고기를 얇게 썰어 아기간장에 살짝 버무린다.'),
  (2, '새송이버섯과 양파는 채썰고, 팽이버섯은 2cm로 썬다.'),
  (3, '냄비에 소고기와 버섯, 양파, 물 50ml를 넣고 볶는다.'),
  (4, '재료가 푹 익어 자연스러운 버섯 채수가 우러나오면 완성한다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 버섯 불고기')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 8, 16.5, 7.8, 2.8, array['철분', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 버섯 불고기')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '부드러운 불고기 전골', '1.5cm 한입 크기', '채수를 우려 자작하게 끓임', '다양한 버섯의 식감과 풍미를 익히는 좋은 메뉴입니다.', '소량'
from r;

-- 레시피: 훈제오리 야채볶음밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('훈제오리 야채볶음밥', '24+', 15, 1, true, '{}', null, '오리고기를 데쳐 기름기를 뺀 후 사용하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('오리고기', 45, 'g'),
  ('부추', 15, 'g'),
  ('양파', 15, 'g'),
  ('밥', 90, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '훈제오리 야채볶음밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '오리고기는 끓는 물에 살짝 데쳐 기름기를 뺀 뒤 작게 썬다.'),
  (2, '부추와 양파를 잘게 다진다.'),
  (3, '팬에 오리고기와 양파를 먼저 볶아 향을 낸다.'),
  (4, '밥과 부추를 넣고 빠르게 볶아낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '훈제오리 야채볶음밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 48, 13.5, 8, 1.5, array['불포화지방산', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '훈제오리 야채볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '고소한 볶음밥', '1cm 작은 조각', '오리 기름을 한번 뺀 후 담백하게 볶음', '부추와 오리의 궁합이 뛰어나며 기력 회복에 좋습니다.', '보통'
from r;

-- 레시피: 오징어 야채볶음
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('오징어 야채볶음', '24+', 15, 2, true, '{연체류}', '오징어가 질기지 않도록 칼집을 넣고 아주 잘게 썰어주세요.', '오래 볶으면 질겨지므로 살짝 익히세요.', 'stew')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('오징어', 40, 'g'),
  ('애호박', 25, 'g'),
  ('당근', 15, 'g'),
  ('양파', 15, 'g'),
  ('참기름', 3, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '오징어 야채볶음')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '오징어 껍질을 벗기고 격자로 칼집을 낸 후 아주 잘게 썬다.'),
  (2, '애호박, 당근, 양파를 채썬다.'),
  (3, '팬에 참기름을 두르고 야채를 먼저 볶다가 오징어를 넣는다.'),
  (4, '오징어가 부드럽게 익도록 단시간에 볶아낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '오징어 야채볶음')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 6, 11.5, 4.2, 1.7, array['타우린', '고단백'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '오징어 야채볶음')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '부드럽고 쫄깃한 볶음 반찬', '아주 잘게 썬 오징어', '칼집을 내어 연하게 볶음', '질길 수 있으니 꼭 작게 썰어주고 잘 씹는지 지켜봐주세요.', '소량'
from r;

-- 레시피: 아기 된장 나물비빔밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 된장 나물비빔밥', '24+', 12, 1, true, '{대두}', null, '저염 아기된장을 소량만 사용하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('콩나물', 25, 'g'),
  ('시금치', 20, 'g'),
  ('당근', 15, 'g'),
  ('밥', 90, 'g'),
  ('아기된장', 3, 'g'),
  ('들기름', 4, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 된장 나물비빔밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '콩나물, 시금치, 채썬 당근을 끓는 물에 데쳐 물기를 짠다.'),
  (2, '나물들을 아기 한입 크기로 쫑쫑 썬다.'),
  (3, '아기된장과 들기름을 섞어 부드러운 양념을 만든다.'),
  (4, '밥 위에 나물과 된장 소스를 올리고 골고루 비벼준다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 된장 나물비빔밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 50, 7.5, 5.5, 3.2, array['이소플라본', '식이섬유'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 된장 나물비빔밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '구수한 나물 비빔밥', '1cm 나물 송송', '나물을 데쳐 저염 된장에 버무림', '된장의 유익균과 나물의 풍부한 식이섬유가 장 건강을 돕습니다.', '소량'
from r;

-- 레시피: 리코타치즈 과일 샐러드
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('리코타치즈 과일 샐러드', '24+', 5, 1, true, '{유제품}', '블루베리와 딸기는 4등분으로 잘라 제공하세요.', null, 'snack')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('리코타치즈', 35, 'g'),
  ('딸기', 30, 'g'),
  ('블루베리', 20, 'g'),
  ('바나나', 30, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '리코타치즈 과일 샐러드')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '딸기와 블루베리는 깨끗이 씻어 4등분한다.'),
  (2, '바나나는 한입 크기로 썬다.'),
  (3, '볼에 신선한 과일을 담고 리코타치즈를 숟가락으로 얹는다.'),
  (4, '치즈와 과일을 살살 버무려 바로 먹인다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '리코타치즈 과일 샐러드')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 18, 4.8, 4, 2.4, array['비타민C', '칼슘'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '리코타치즈 과일 샐러드')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '신선하고 크리미한 디저트', '과일 4등분 조각', '조리 없이 신선하게 제공', '간식이나 아침 식사에 곁들이기 좋은 영양 폭탄 샐러드입니다.', '없음'
from r;

-- 레시피: 연근 소고기전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('연근 소고기전', '24+', 15, 2, false, '{계란}', null, '소고기가 속까지 완전히 익도록 약불에서 은근히 구우세요.', 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('연근', 35, 'g'),
  ('소고기다짐육', 35, 'g'),
  ('계란', 1, '개')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '연근 소고기전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '연근은 강판에 곱게 갈아 물기를 살짝 짠다.'),
  (2, '갈아놓은 연근, 소고기다짐육, 계란을 볼에 넣고 치댄다.'),
  (3, '팬에 기름을 두르고 한 숟가락씩 도톰하게 올린다.'),
  (4, '약불에서 속까지 소고기가 완전히 익도록 노릇하게 부친다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '연근 소고기전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 7, 13, 7.2, 1.6, array['철분', '단백질'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '연근 소고기전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '겉바속촉 고기전', '한입 크기 전', '연근을 갈아 넣어 쫀득하게 부침', '연근 특유의 전분기로 밀가루 없이도 쫀득하고 고소합니다.', '소량'
from r;

-- 레시피: 아기 잔치국수
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 잔치국수', '24+', 15, 1, true, '{밀,계란,생선}', '국수는 2~3cm 길이로 짧게 잘라 숟가락으로 떠먹게 하세요.', null, 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('국수', 40, 'g'),
  ('멸치', 10, 'g'),
  ('애호박', 20, 'g'),
  ('당근', 15, 'g'),
  ('계란', 1, '개')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 잔치국수')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '멸치로 진하게 육수를 끓이고 멸치를 건진다.'),
  (2, '육수에 채썬 애호박과 당근을 넣어 익힌다.'),
  (3, '국수를 부드럽게 삶아 찬물에 헹군 뒤 짧게 자른다.'),
  (4, '지단을 부쳐 썰어 올리고 따뜻한 멸치 육수를 부어낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 잔치국수')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 38, 11.2, 6, 1.5, array['칼슘', '비타민A'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 잔치국수')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '부드러운 온면', '2~3cm 짧은 면', '면을 푹 삶고 멸치 육수 조리', '면을 짧게 잘라 숟가락으로 국물과 함께 떠먹게 해주세요.', '소량'
from r;

-- 레시피: 아기 두부 된장국밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('아기 두부 된장국밥', '24+', 15, 1, true, '{대두}', null, '된장을 연하게 풀어 짜지 않게 끓이세요.', 'soup')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('두부', 50, 'g'),
  ('감자', 30, 'g'),
  ('애호박', 20, 'g'),
  ('아기된장', 3, 'g'),
  ('밥', 90, 'g')
) as v(name, quantity, unit)
join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '아기 두부 된장국밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '냄비에 물 300ml를 붓고 감자와 애호박을 깍둑썰어 넣고 끓인다.'),
  (2, '채소가 익으면 아기된장을 체에 밭쳐 곱게 푼다.'),
  (3, '두부를 한입 크기로 썰어 넣고 3분간 더 끓인다.'),
  (4, '따뜻한 밥을 국물에 말아 낸다.')
) as s(step_number, instruction)
on conflict (recipe_id, step_number) do nothing;

with r as (select id from recipes where name = '아기 두부 된장국밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 52, 11, 4.8, 2.2, array['칼슘', '단백질'], '식품의약품안전처 식품영양성분DB'
from r
on conflict (recipe_id) do nothing;
with r as (select id from recipes where name = '아기 두부 된장국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '구수하고 부드러운 국밥', '1cm 두부 깍둑썰기', '된장을 연하게 풀어 채소와 끓임', '자극적이지 않은 구수한 맛으로 아침 든든한 식사로 최고입니다.', '없음'
from r;
