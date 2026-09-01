-- 기능 업데이트 #1: 주간 식단이 매일 다르게 나오려면 후보 레시피가 더 필요하다.

-- 4) 닭고기 야채죽 (일반, 12개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('닭고기 야채죽', '12-17', 25, 2, false, '{}', '닭고기는 결대로 잘게 찢어서 제공하세요.', null)
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('닭가슴살', 40, 'g'), ('당근', 20, 'g'), ('양파', 15, 'g'), ('현미밥', 60, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '닭고기 야채죽')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '닭가슴살을 삶아 결대로 잘게 찢는다.'),
  (2, '당근과 양파를 잘게 다진다.'),
  (3, '냄비에 현미밥과 육수를 넣고 재료를 넣어 끓인다.'),
  (4, '푹 퍼질 때까지 저어가며 익힌다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '닭고기 야채죽')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 35, 13, 5, 2.4, array['비타민A', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

-- 5) 연어 브로콜리 진밥 (일반, 18개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('연어 브로콜리 진밥', '18-23', 20, 2, false, '{}', '연어 가시가 없는지 반드시 확인하고, 브로콜리는 잘게 썰어 제공하세요.', null)
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('연어', 40, 'g'), ('브로콜리', 30, 'g'), ('밥', 80, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '연어 브로콜리 진밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '연어를 완전히 익힌 뒤 가시를 꼼꼼히 제거하고 잘게 부순다.'),
  (2, '브로콜리를 데친 뒤 잘게 다진다.'),
  (3, '밥과 함께 부드럽게 섞는다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '연어 브로콜리 진밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 40, 15, 8, 2.8, array['오메가-3', '비타민C'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

-- 6) 두부 채소 볶음밥 (일반, 9개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('두부 채소 볶음밥', '9-11', 15, 1, false, '{}', null, '기름은 소량만 사용하세요.')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('두부', 50, 'g'), ('당근', 15, 'g'), ('애호박', 15, 'g'), ('밥', 70, 'g'), ('참기름', 2, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '두부 채소 볶음밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '두부를 으깨고 당근, 애호박을 잘게 다진다.'),
  (2, '팬에 참기름을 살짝 두르고 재료를 볶는다.'),
  (3, '밥을 넣고 골고루 볶는다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '두부 채소 볶음밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 38, 10, 6, 2.0, array['칼슘', '비타민A'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

-- 7) 바나나 요거트 (초간편, 6개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('바나나 요거트', '6-8', 5, 1, true, '{우유}', null, '무가당 플레인 요거트를 사용하세요.')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('바나나', 50, 'g'), ('플레인요거트', 60, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '바나나 요거트')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '바나나를 포크로 곱게 으깬다.'),
  (2, '플레인 요거트와 골고루 섞는다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '바나나 요거트')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 22, 4, 2, 1.8, array['칼슘', '칼륨'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

-- 8) 참치 주먹밥 (초간편, 18개월+)
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
  values ('참치 주먹밥', '18-23', 10, 1, true, '{}', '한입 크기로 작게 뭉쳐서 제공하세요.', '참치는 기름기를 잘 빼고 사용하세요.')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values
  ('참치', 30, 'g'), ('밥', 70, 'g'), ('김', 2, 'g')
) as v(name, quantity, unit) join ingredients i on i.name = v.name;

with r as (select id from recipes where name = '참치 주먹밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values
  (1, '참치는 기름을 빼고 잘게 으깬다.'),
  (2, '밥과 참치를 섞어 한입 크기로 뭉친다.'),
  (3, '잘게 부순 김을 겉에 묻힌다.')
) as s(step_number, instruction);

with r as (select id from recipes where name = '참치 주먹밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 36, 12, 3, 1.0, array['오메가-3', '요오드'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
