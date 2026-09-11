-- 0013_more_recipes.sql — 신규 22개 레시피 (상세 조리순서 포함 완전판)

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('무 배추 두부국밥', '12-17', 18, 1, false, '{}', null, '간은 최소화해서 조리하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('무', 20, 'g'), ('배추', 20, 'g'), ('두부', 30, 'g'), ('밥', 70, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '무 배추 두부국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '무 20g과 배추 20g을 잘게 다져 부드러워질 때까지 5분간 삶는다.'),
    (2, '두부 30g을 으깨 함께 끓인다.'),
    (3, '밥 70g과 곁들여 낸다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '무 배추 두부국밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 36, 9, 3, 2.0, array['비타민C', '칼슘'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('숙주나물 무침밥', '12-17', 10, 1, true, '{}', '숙주나물은 잘게 잘라서 제공하세요.', null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('숙주나물', 30, 'g'), ('밥', 70, 'g'), ('참기름', 2, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '숙주나물 무침밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '숙주나물 30g을 끓는 물에 2분간 데친 뒤 잘게 다진다.'),
    (2, '참기름 2g과 밥 70g을 넣고 골고루 무친다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '숙주나물 무침밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 34, 4, 2, 1.6, array['비타민C', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('오이 그릭요거트무침', '18-23', 5, 1, true, '{우유}', '오이는 씨를 제거하고 잘게 썰어서 제공하세요.', null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('오이', 30, 'g'), ('그릭요거트', 50, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '오이 그릭요거트무침')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '오이 30g은 씨를 제거하고 잘게 썬다.'),
    (2, '그릭요거트 50g과 섞는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '오이 그릭요거트무침')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 8, 6, 2, 0.6, array['단백질', '수분'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('파프리카 채소볶음밥', '12-17', 15, 1, false, '{}', null, null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('파프리카', 25, 'g'), ('당근', 15, 'g'), ('밥', 70, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '파프리카 채소볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '파프리카 25g과 당근 15g을 잘게 다져 3분간 부드럽게 볶는다.'),
    (2, '밥 70g을 넣고 골고루 볶는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '파프리카 채소볶음밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 40, 5, 3, 1.8, array['비타민C', '비타민A'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('단호박 진밥', '6-8', 15, 1, false, '{}', null, null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('단호박', 50, 'g'), ('밥', 30, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '단호박 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '단호박 50g의 씨를 제거하고 10분간 푹 찐다.'),
    (2, '곱게 으깬 뒤 밥 30g과 부드럽게 섞는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '단호박 진밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 26, 2, 0, 2.2, array['비타민A', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('옥수수 감자수프', '12-17', 15, 1, true, '{우유}', '옥수수 알갱이는 으깨서 제공하세요.', null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('옥수수', 30, 'g'), ('감자', 30, 'g'), ('우유', 50, 'ml')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '옥수수 감자수프')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '옥수수 30g과 감자 30g을 삶아 곱게 으깬다.'),
    (2, '우유 50ml를 넣고 수프 농도로 섞는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '옥수수 감자수프')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 30, 5, 3, 1.8, array['탄수화물', '칼슘'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('양송이버섯 계란볶음밥', '18-23', 15, 2, false, '{계란}', null, '계란은 완전히 익혀서 사용하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('양송이버섯', 25, 'g'), ('계란', 1, '개'), ('밥', 80, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '양송이버섯 계란볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '양송이버섯 25g을 잘게 다져 2분간 볶는다.'),
    (2, '완전히 푼 계란 1개를 넣고 함께 볶는다.'),
    (3, '밥 80g을 넣고 골고루 볶는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '양송이버섯 계란볶음밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 42, 11, 5, 1.6, array['비타민D', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('가지 두부덮밥', '18-23', 15, 1, false, '{}', null, null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('가지', 30, 'g'), ('두부', 35, 'g'), ('밥', 80, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '가지 두부덮밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '가지 30g을 잘게 다져 부드러워질 때까지 3분간 볶는다.'),
    (2, '두부 35g을 으깨 함께 볶는다.'),
    (3, '밥 80g 위에 올려 낸다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '가지 두부덮밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 44, 10, 4, 2.4, array['식이섬유', '칼슘'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('마늘생강 소고기볶음밥', '24+', 20, 2, false, '{}', null, '마늘과 생강은 아주 소량만 사용해 향만 살짝 나게 조리하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('소고기', 40, 'g'), ('마늘', 2, 'g'), ('생강', 1, 'g'), ('밥', 80, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '마늘생강 소고기볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '마늘 2g과 생강 1g을 아주 잘게 다진다.'),
    (2, '소고기 40g과 함께 약한 불에서 3분간 볶는다.'),
    (3, '밥 80g을 넣고 골고루 볶는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '마늘생강 소고기볶음밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 44, 15, 6, 1.4, array['철분', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('대파 계란국밥', '18-23', 12, 1, true, '{계란}', null, '계란은 완전히 익혀서 사용하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('대파', 10, 'g'), ('계란', 1, '개'), ('밥', 80, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '대파 계란국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '대파 10g을 아주 잘게 썬다.'),
    (2, '물 200ml에 대파를 넣고 끓이다 완전히 푼 계란 1개를 넣는다.'),
    (3, '밥 80g과 함께 낸다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '대파 계란국밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 40, 11, 5, 1.0, array['단백질', '비타민C'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('셀러리 닭죽', '12-17', 22, 2, false, '{}', '셀러리 섬유질은 잘게 다져서 제공하세요.', null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('셀러리', 20, 'g'), ('닭가슴살', 35, 'g'), ('밥', 60, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '셀러리 닭죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '닭가슴살 35g을 삶아 결대로 찢는다.'),
    (2, '셀러리 20g의 질긴 섬유질을 제거하고 아주 잘게 다져 부드럽게 익힌다.'),
    (3, '밥 60g과 함께 죽처럼 끓인다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '셀러리 닭죽')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 36, 13, 3, 1.6, array['단백질', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('케일 사과 그릭요거트볼', '12-17', 8, 1, true, '{우유}', null, '케일 줄기는 제거하고 잎만 곱게 다지세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('케일', 15, 'g'), ('사과', 30, 'g'), ('그릭요거트', 50, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '케일 사과 그릭요거트볼')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '케일 15g은 줄기를 제거하고 잎만 데쳐서 아주 곱게 다진다.'),
    (2, '사과 30g을 푹 익혀 으깬다.'),
    (3, '케일, 사과, 그릭요거트 50g을 섞는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '케일 사과 그릭요거트볼')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 18, 6, 2, 2.0, array['비타민A', '칼슘'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('배 사과 퓨레', '6-8', 10, 1, true, '{}', null, '두 재료 모두 완전히 익혀서 곱게 으깨세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('배', 30, 'g'), ('사과', 30, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '배 사과 퓨레')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '배 30g과 사과 30g을 껍질과 씨를 제거하고 부드러워질 때까지 10분간 익힌다.'),
    (2, '곱게 으깨 섞는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '배 사과 퓨레')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 20, 0, 0, 2.4, array['식이섬유', '수분'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('딸기 그릭요거트', '9-11', 5, 1, true, '{우유}', '딸기는 처음 접하는 경우 소량만 주고 알레르기 반응을 관찰하세요.', '무가당 그릭요거트를 사용하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('딸기', 30, 'g'), ('그릭요거트', 50, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '딸기 그릭요거트')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '딸기 30g을 씻어 꼭지를 떼고 곱게 으깬다.'),
    (2, '무가당 그릭요거트 50g과 섞는다. 처음 시도라면 소량만 제공하고 알레르기 반응을 관찰한다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '딸기 그릭요거트')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 14, 6, 2, 1.4, array['비타민C', '단백질'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('키위 매시', '9-11', 5, 1, true, '{}', '키위는 처음 접하는 경우 소량만 주고 알레르기 반응을 관찰하세요.', '씨는 최대한 제거하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('키위', 40, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '키위 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '키위 40g의 껍질을 벗기고 씨를 최대한 제거한다.'),
    (2, '과육을 곱게 으깬다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '키위 매시')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 12, 1, 0, 2.6, array['비타민C', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('망고 그릭요거트볼', '9-11', 5, 1, true, '{우유}', null, '무가당 그릭요거트를 사용하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('망고', 30, 'g'), ('그릭요거트', 50, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '망고 그릭요거트볼')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '망고 30g을 껍질과 씨를 제거하고 곱게 으깬다.'),
    (2, '무가당 그릭요거트 50g과 섞는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '망고 그릭요거트볼')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 16, 6, 2, 1.2, array['비타민A', '비타민C'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('보리 새우볶음밥', '24+', 20, 2, false, '{갑각류}', '새우는 껍질과 내장을 완전히 제거하고 잘게 다져서 제공하세요.', '새우는 처음 접하는 경우 소량만 주고 알레르기 반응을 반드시 관찰하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('보리', 30, 'g'), ('새우', 30, 'g'), ('밥', 50, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '보리 새우볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '보리 30g을 미리 삶아 부드럽게 준비한다.'),
    (2, '새우 30g은 껍질과 내장을 제거하고 완전히 익힌 뒤 잘게 다진다.'),
    (3, '보리밥과 흰밥 50g, 새우를 골고루 볶는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '보리 새우볶음밥')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 42, 14, 3, 3.0, array['단백질', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('퀴노아 채소죽', '9-11', 20, 2, false, '{}', null, null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('퀴노아', 30, 'g'), ('당근', 15, 'g'), ('애호박', 15, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '퀴노아 채소죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '퀴노아 30g을 깨끗이 씻어 물 100ml에 15분간 푹 삶는다.'),
    (2, '당근 15g과 애호박 15g을 잘게 다져 함께 넣고 5분 더 끓인다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '퀴노아 채소죽')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 30, 8, 3, 2.6, array['단백질', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('완두콩 두부매시', '6-8', 10, 1, true, '{}', '완두콩 껍질은 벗겨내고 곱게 으깨세요.', null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('완두콩', 30, 'g'), ('두부', 30, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '완두콩 두부매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '완두콩 30g을 삶아 껍질을 벗기고 곱게 으깬다.'),
    (2, '두부 30g과 함께 섞는다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '완두콩 두부매시')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 14, 8, 3, 2.8, array['단백질', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('병아리콩 채소스튜', '18-23', 22, 2, false, '{}', null, null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('병아리콩', 35, 'g'), ('당근', 20, 'g'), ('양파', 15, 'g'), ('파슬리', 1, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '병아리콩 채소스튜')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '병아리콩 35g을 부드러워질 때까지 20분간 삶아 으깬다.'),
    (2, '당근 20g과 양파 15g을 잘게 다져 함께 8분간 끓인다.'),
    (3, '다진 파슬리 1g을 아주 소량 뿌려 낸다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '병아리콩 채소스튜')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 38, 12, 3, 4.0, array['단백질', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('렌틸콩 야채죽', '12-17', 20, 2, false, '{}', null, null)
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('렌틸콩', 30, 'g'), ('당근', 15, 'g'), ('밥', 50, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '렌틸콩 야채죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '렌틸콩 30g을 물에 15분간 삶는다.'),
    (2, '당근 15g을 잘게 다져 밥 50g과 함께 넣고 5분 더 끓인다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '렌틸콩 야채죽')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 36, 10, 2, 3.4, array['철분', '식이섬유'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;

  with r as (
    insert into recipes (name, min_age_stage, cook_minutes, difficulty, is_quick, allergens, choking_hazard_note, caution_note)
    values ('굴 야채죽', '24+', 25, 2, false, '{}', '굴은 반드시 완전히 익혀서 사용하고, 이물질이 없는지 확인하세요.', '조개류는 알레르기 위험이 있으니 처음 접하는 경우 소아과 상담 후 소량만 시도하고 반응을 관찰하세요.')
    returning id
  )
  insert into recipe_ingredients (recipe_id, ingredient_id, quantity, unit)
  select r.id, i.id, v.quantity, v.unit from r, (values ('굴', 25, 'g'), ('당근', 15, 'g'), ('밥', 60, 'g')) as v(name, quantity, unit)
  join ingredients i on i.name = v.name;
  with r as (select id from recipes where name = '굴 야채죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '굴 25g을 흐르는 물에 깨끗이 씻어 이물질을 제거한다.'),
    (2, '끓는 물에 완전히 익힌 뒤 잘게 다진다.'),
    (3, '당근 15g을 잘게 다져 밥 60g과 함께 끓인 뒤 굴을 넣고 한소끔 더 끓인다.')
  ) as s(step_number, instruction);
  with r as (select id from recipes where name = '굴 야채죽')
  insert into nutrition_data (recipe_id, carbs_g, protein_g, fat_g, fiber_g, key_micronutrients, source)
  select r.id, 36, 10, 2, 1.4, array['아연', '철분'], '식품의약품안전처 식품영양성분DB (대표값, 1인분 기준 추정)' from r;