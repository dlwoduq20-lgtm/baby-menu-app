-- 4단계: 부족한 카테고리(전/완자/면/주먹밥) 중심 신규 레시피 24개 추가
-- supabase/migrations/0017_more_recipes_step4.sql 로 저장해서 실행

-- 애호박전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('애호박전', '12-17', 12, 1, false, '{계란}', null, '계란은 완전히 익혀서 사용하세요.', 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('애호박', 50, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '애호박전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '애호박을 얇게 썰거나 채썬다.'), (2, '계란을 완전히 풀어 애호박에 옷을 입힌다.'), (3, '약한 불에서 앞뒤로 충분히 익힌다.'), (4, '한입 크기로 잘라 제공한다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '애호박전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 6, 7, 5, 1.0, array['비타민A', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '애호박전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 당근전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('당근전', '9-11', 12, 1, false, '{계란}', '당근은 얇게 채썰어 부드럽게 익히세요.', null, 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('당근', 40, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '당근전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '당근을 아주 얇게 채썬다.'), (2, '계란을 완전히 풀어 당근과 섞는다.'), (3, '약한 불에서 작고 얇게 부쳐 속까지 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '당근전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 4, 7, 5, 0.8, array['비타민A', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '당근전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

-- 브로콜리전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('브로콜리전', '12-17', 13, 1, false, '{계란}', null, '계란은 완전히 익혀서 사용하세요.', 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('브로콜리', 45, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '브로콜리전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '브로콜리를 데친 뒤 잘게 다진다.'), (2, '계란을 완전히 풀어 브로콜리와 섞는다.'), (3, '약한 불에서 앞뒤로 충분히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '브로콜리전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 5, 7, 5, 1.4, array['비타민C', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '브로콜리전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 시금치전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('시금치전', '12-17', 13, 1, false, '{계란}', null, '계란은 완전히 익혀서 사용하세요.', 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('시금치', 40, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '시금치전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '시금치를 데쳐서 잘게 다진다.'), (2, '계란을 완전히 풀어 시금치와 섞는다.'), (3, '약한 불에서 얇게 부쳐 충분히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '시금치전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 4, 7, 5, 1.2, array['철분', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '시금치전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 단호박전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('단호박전', '9-11', 15, 1, false, '{계란}', null, null, 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('단호박', 50, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '단호박전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '단호박을 푹 쪄서 곱게 으깬다.'), (2, '계란과 섞어 반죽처럼 만든다.'), (3, '약한 불에서 작고 도톰하게 부쳐 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '단호박전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 10, 7, 5, 1.6, array['비타민A', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '단호박전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

-- 양파계란전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('양파계란전', '18-23', 12, 1, false, '{계란}', null, '계란은 완전히 익혀서 사용하세요.', 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('양파', 40, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '양파계란전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '양파를 잘게 다져 살짝 볶아 단맛을 낸다.'), (2, '계란을 완전히 풀어 양파와 섞는다.'), (3, '약한 불에서 앞뒤로 충분히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '양파계란전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 4, 7, 5, 0.8, array['단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '양파계란전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

-- 파프리카전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('파프리카전', '12-17', 12, 1, false, '{계란}', null, null, 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('파프리카', 40, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '파프리카전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '파프리카를 잘게 다진다.'), (2, '계란을 완전히 풀어 파프리카와 섞는다.'), (3, '약한 불에서 앞뒤로 충분히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '파프리카전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 4, 7, 5, 0.9, array['비타민C', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '파프리카전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 콩나물두부전
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('콩나물두부전', '18-23', 14, 1, false, '{계란}', '콩나물은 잘게 잘라서 제공하세요.', null, 'pancake')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('콩나물', 30, 'g'), ('두부', 30, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '콩나물두부전')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '콩나물을 잘게 잘라 데친다.'), (2, '두부를 으깨고 계란과 함께 섞는다.'), (3, '약한 불에서 앞뒤로 충분히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '콩나물두부전')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 6, 9, 6, 1.4, array['단백질', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '콩나물두부전')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 전 요리', '작은 조각으로 잘라서 제공', '얇게 부쳐 충분히 익힌다', '작은 조각으로 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

-- 소고기완자
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기완자', '12-17', 18, 2, false, '{계란}', '완자는 한입 크기보다 작게 빚어주세요.', null, 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('소고기', 50, 'g'), ('당근', 15, 'g'), ('양파', 10, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '소고기완자')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '소고기를 곱게 다진다.'), (2, '당근과 양파를 잘게 다져 섞는다.'), (3, '계란을 넣어 반죽하듯 잘 치댄다.'), (4, '작은 완자 모양으로 빚어 속까지 완전히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '소고기완자')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 4, 15, 7, 1.0, array['단백질', '철분'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '소고기완자')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 닭고기완자
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('닭고기완자', '12-17', 18, 2, false, '{계란}', '완자는 한입 크기보다 작게 빚어주세요.', null, 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('닭가슴살', 50, 'g'), ('애호박', 20, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '닭고기완자')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '닭가슴살을 곱게 다진다.'), (2, '애호박을 잘게 다져 섞는다.'), (3, '계란을 넣어 반죽처럼 치댄다.'), (4, '작은 완자로 빚어 속까지 완전히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '닭고기완자')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 16, 4, 0.9, array['단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '닭고기완자')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 두부동그랑땡
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('두부동그랑땡', '12-17', 16, 2, false, '{계란}', '완자는 한입 크기보다 작게 빚어주세요.', null, 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('두부', 60, 'g'), ('당근', 15, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '두부동그랑땡')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '두부의 물기를 꼭 짠 뒤 곱게 으깬다.'), (2, '당근을 잘게 다져 섞는다.'), (3, '계란을 넣어 반죽처럼 치댄다.'), (4, '납작하게 빚어 약한 불에서 완전히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '두부동그랑땡')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 4, 10, 6, 1.0, array['단백질', '칼슘'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '두부동그랑땡')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 연어완자
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('연어완자', '12-17', 18, 2, false, '{계란}', '완자는 한입 크기보다 작게 빚어주세요.', '연어 가시가 없는지 반드시 확인하세요.', 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('연어', 50, 'g'), ('감자', 20, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '연어완자')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '연어를 완전히 익힌 뒤 가시를 제거하고 곱게 부순다.'), (2, '감자를 삶아 으깨어 섞는다.'), (3, '계란을 넣어 반죽처럼 치댄다.'), (4, '작은 완자로 빚어 다시 한번 속까지 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '연어완자')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 5, 14, 6, 0.8, array['오메가-3', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '연어완자')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 돼지고기완자
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('돼지고기완자', '18-23', 18, 2, false, '{계란}', '완자는 한입 크기보다 작게 빚어주세요.', '돼지고기는 완전히 익혀서 사용하세요.', 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('돼지고기', 50, 'g'), ('양파', 15, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '돼지고기완자')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '돼지고기를 곱게 다진다.'), (2, '양파를 잘게 다져 섞는다.'), (3, '계란을 넣어 반죽처럼 치댄다.'), (4, '작은 완자로 빚어 속까지 완전히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '돼지고기완자')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 15, 8, 0.7, array['단백질', '비타민B1'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '돼지고기완자')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

-- 흰살생선완자
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('흰살생선완자', '9-11', 17, 2, false, '{}', '완자는 한입 크기보다 작게 빚어주세요.', '생선 가시가 없는지 반드시 확인하세요.', 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('흰살생선', 45, 'g'), ('감자', 25, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '흰살생선완자')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '흰살생선을 완전히 익힌 뒤 가시를 꼼꼼히 제거하고 곱게 부순다.'), (2, '감자를 삶아 곱게 으깨어 섞는다.'), (3, '작은 완자 모양으로 빚어 부드럽게 마무리한다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '흰살생선완자')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 6, 11, 2, 0.9, array['단백질', '비타민C'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '흰살생선완자')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

-- 참치두부완자
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('참치두부완자', '12-17', 16, 2, false, '{계란}', '완자는 한입 크기보다 작게 빚어주세요.', '참치는 기름기를 잘 빼고 사용하세요.', 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('참치', 40, 'g'), ('두부', 30, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '참치두부완자')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '참치는 기름을 빼고 두부와 함께 곱게 으깬다.'), (2, '계란을 넣어 반죽처럼 치댄다.'), (3, '작은 완자로 빚어 속까지 완전히 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '참치두부완자')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 3, 14, 6, 0.6, array['오메가-3', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '참치두부완자')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 병아리콩완자
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('병아리콩완자', '18-23', 20, 2, false, '{계란}', '완자는 한입 크기보다 작게 빚어주세요.', null, 'meatball')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('병아리콩', 50, 'g'), ('당근', 15, 'g'), ('계란', 1, '개')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '병아리콩완자')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '병아리콩을 푹 삶아 곱게 으깬다.'), (2, '당근을 잘게 다져 섞는다.'), (3, '계란을 넣어 반죽처럼 치댄다.'), (4, '작은 완자로 빚어 부드럽게 익힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '병아리콩완자')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 9, 10, 4, 3.0, array['단백질', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '병아리콩완자')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 완자 요리', '완자를 아주 작게 빚어서 제공', '속까지 완전히 익히고 필요시 눌러 으깨어 제공', '완자를 아주 작게 빚어서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

-- 닭고기 국수
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('닭고기 국수', '12-17', 15, 1, false, '{}', '국수는 짧게 잘라서 제공하세요.', null, 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('닭가슴살', 35, 'g'), ('국수', 50, 'g'), ('당근', 15, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '닭고기 국수')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '닭가슴살을 삶아 결대로 잘게 찢는다.'), (2, '국수를 삶아 1~2cm로 짧게 자른다.'), (3, '당근을 잘게 다져 함께 익힌다.'), (4, '전부 섞어 낸다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '닭고기 국수')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 38, 14, 3, 1.2, array['단백질', '비타민A'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '닭고기 국수')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 면 요리', '면을 1~2cm 길이로 짧게 잘라서 제공', '푹 삶아 부드럽게 만든다', '면을 1~2cm 길이로 짧게 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 두부 국수
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('두부 국수', '9-11', 13, 1, true, '{}', '국수는 짧게 잘라서 제공하세요.', null, 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('두부', 40, 'g'), ('국수', 40, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '두부 국수')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '국수를 삶아 짧게 자른다.'), (2, '두부를 곱게 으깨 국수와 섞는다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '두부 국수')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 34, 9, 3, 0.8, array['단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '두부 국수')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 면 요리', '면을 1~2cm 길이로 짧게 잘라서 제공', '푹 삶아 부드럽게 만든다', '면을 1~2cm 길이로 짧게 잘라서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

-- 채소 비빔국수
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('채소 비빔국수', '18-23', 15, 1, false, '{}', '국수는 짧게 잘라서 제공하세요.', null, 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('국수', 60, 'g'), ('애호박', 20, 'g'), ('당근', 15, 'g'), ('참기름', 2, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '채소 비빔국수')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '국수를 삶아 짧게 자른다.'), (2, '애호박과 당근을 잘게 다져 볶는다.'), (3, '참기름을 살짝 둘러 국수와 함께 무친다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '채소 비빔국수')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 44, 7, 4, 1.4, array['탄수화물', '비타민A'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '채소 비빔국수')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 면 요리', '면을 1~2cm 길이로 짧게 잘라서 제공', '푹 삶아 부드럽게 만든다', '면을 1~2cm 길이로 짧게 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

-- 소고기 국수
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기 국수', '18-23', 16, 1, false, '{}', '국수는 짧게 잘라서 제공하세요.', null, 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('소고기', 35, 'g'), ('국수', 50, 'g'), ('당근', 15, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '소고기 국수')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '소고기를 잘게 다져 볶는다.'), (2, '국수를 삶아 짧게 자른다.'), (3, '당근을 잘게 다져 함께 볶은 뒤 국수와 섞는다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '소고기 국수')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 40, 14, 5, 1.0, array['단백질', '철분'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '소고기 국수')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 면 요리', '면을 1~2cm 길이로 짧게 잘라서 제공', '푹 삶아 부드럽게 만든다', '면을 1~2cm 길이로 짧게 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

-- 미역 국수
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('미역 국수', '12-17', 14, 1, false, '{}', '국수는 짧게 잘라서 제공하세요.', '간은 최소화해서 조리하세요.', 'noodle')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('미역', 8, 'g'), ('국수', 50, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '미역 국수')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '마른미역을 물에 불려 잘게 썬다.'), (2, '국수를 삶아 짧게 자른다.'), (3, '미역을 육수에 살짝 끓여 국수와 섞는다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '미역 국수')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 36, 6, 1, 1.2, array['칼슘', '요오드'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '미역 국수')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 면 요리', '면을 1~2cm 길이로 짧게 잘라서 제공', '푹 삶아 부드럽게 만든다', '면을 1~2cm 길이로 짧게 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 소고기 주먹밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('소고기 주먹밥', '18-23', 15, 1, true, '{}', '한입 크기보다 작게 뭉쳐주세요.', null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('소고기', 35, 'g'), ('당근', 15, 'g'), ('밥', 80, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '소고기 주먹밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '소고기와 당근을 잘게 다져 볶는다.'), (2, '밥과 골고루 섞는다.'), (3, '한입 크기로 동그랗게 뭉친다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '소고기 주먹밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 42, 14, 5, 1.2, array['단백질', '철분'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '소고기 주먹밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '한입 크기보다 작게 뭉쳐서 제공', '재료를 푹 익혀 잘게 다져 밥과 섞는다', '한입 크기보다 작게 뭉쳐서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

-- 채소 주먹밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('채소 주먹밥', '12-17', 13, 1, true, '{}', '한입 크기보다 작게 뭉쳐주세요.', null, 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('애호박', 20, 'g'), ('당근', 15, 'g'), ('밥', 80, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '채소 주먹밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '애호박과 당근을 잘게 다져 부드럽게 볶는다.'), (2, '밥과 골고루 섞는다.'), (3, '한입 크기로 동그랗게 뭉친다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '채소 주먹밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 40, 5, 2, 1.4, array['비타민A', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '채소 주먹밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 밥 형태', '한입 크기보다 작게 뭉쳐서 제공', '재료를 푹 익혀 잘게 다져 밥과 섞는다', '한입 크기보다 작게 뭉쳐서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

-- 연어 주먹밥
with r as (
  insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note, menu_type)
  values ('연어 주먹밥', '18-23', 15, 1, true, '{}', '한입 크기보다 작게 뭉쳐주세요.', '연어 가시가 없는지 반드시 확인하세요.', 'rice')
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
select r.id, i.id, v.quantity, v.unit from r, (values ('연어', 35, 'g'), ('밥', 80, 'g'), ('김', 2, 'g')) as v(name, quantity, unit)
join ingredients i on i.name = v.name;
with r as (select id from recipes where name = '연어 주먹밥')
insert into recipe_steps (recipe_id, step_number, instruction)
select r.id, s.step_number, s.instruction from r, (values (1, '연어를 완전히 익힌 뒤 가시를 제거하고 잘게 부순다.'), (2, '밥과 골고루 섞는다.'), (3, '한입 크기로 뭉친 뒤 잘게 부순 김을 묻힌다.')) as s(step_number, instruction);
with r as (select id from recipes where name = '연어 주먹밥')
insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
select r.id, 40, 13, 5, 0.6, array['오메가-3', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;
with r as (select id from recipes where name = '연어 주먹밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '한입 크기보다 작게 뭉쳐서 제공', '재료를 푹 익혀 잘게 다져 밥과 섞는다', '한입 크기보다 작게 뭉쳐서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;
