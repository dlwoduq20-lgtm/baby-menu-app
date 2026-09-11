-- 기능 업데이트: 전체 레시피 조리순서에 재료량·준비과정을 명시해 디테일 강화

  with r as (select id from recipes where name = '소고기 애호박 덮밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '소고기 애호박 덮밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '소고기 40g을 잘게 다진다.'),
    (2, '애호박 30g과 양파 10g을 잘게 썬다.'),
    (3, '달군 팬에 소고기, 애호박, 양파를 넣고 중약불에서 5분간 충분히 익힌다.'),
    (4, '따뜻한 밥 80g과 함께 골고루 섞는다.'),
    (5, '아기의 월령에 맞게 크기와 질감을 조절해 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '두부 계란찜')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '두부 계란찜')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '두부 50g을 숟가락으로 곱게 으깬다.'),
    (2, '계란 1개를 볼에 깨서 완전히 풀어준다.'),
    (3, '으깬 두부와 계란물을 골고루 섞는다.'),
    (4, '내열 용기에 담아 전자레인지(600W 기준 1분 30초~2분) 또는 찜기에서 속까지 완전히 익힌다.'),
    (5, '한 김 식힌 뒤 월령에 맞는 크기로 잘라 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '계란밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '계란밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '계란 1개를 볼에 깨서 완전히 풀어준다.'),
    (2, '약한 불로 달군 팬에 계란물을 붓고 스크램블 형태로 완전히 익힌다.'),
    (3, '따뜻한 밥 70g에 익힌 계란을 넣고 골고루 섞는다.'),
    (4, '월령에 맞게 질감을 조절해 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '닭고기 야채죽')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '닭고기 야채죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '닭가슴살 40g을 끓는 물에 10분간 삶아 결대로 잘게 찢는다.'),
    (2, '당근 20g과 양파 15g을 잘게 다진다.'),
    (3, '냄비에 현미밥 60g과 닭 삶은 육수를 넣고 끓인다.'),
    (4, '찢은 닭고기와 다진 채소를 넣고 밥알이 푹 퍼질 때까지 5분 더 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '연어 브로콜리 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '연어 브로콜리 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '연어 40g을 찜기나 전자레인지로 완전히 익힌 뒤 가시를 꼼꼼히 제거하고 잘게 부순다.'),
    (2, '브로콜리 30g을 끓는 물에 3분간 데친 뒤 잘게 다진다.'),
    (3, '밥 80g과 연어, 브로콜리를 골고루 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '두부 채소 볶음밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '두부 채소 볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '두부 50g을 곱게 으깨고, 당근 15g과 애호박 15g을 잘게 다진다.'),
    (2, '달군 팬에 참기름 2g을 살짝 두르고 당근과 애호박을 2분간 볶는다.'),
    (3, '으깬 두부와 밥 70g을 넣고 약한 불에서 골고루 볶는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '바나나 요거트')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '바나나 요거트')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '바나나 50g을 포크로 곱게 으깬다.'),
    (2, '무가당 플레인 요거트 60g을 넣고 골고루 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '참치 주먹밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '참치 주먹밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '참치 30g은 체에 밭쳐 기름을 완전히 뺀 뒤 잘게 으깬다.'),
    (2, '밥 70g과 참치를 골고루 섞어 한입 크기로 동그랗게 뭉친다.'),
    (3, '잘게 부순 김 2g을 겉에 묻혀 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '흰살생선 감자 매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '흰살생선 감자 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '흰살생선 30g을 찜기로 완전히 익힌 뒤 가시를 꼼꼼히 제거하고 곱게 으깬다.'),
    (2, '감자 40g의 껍질을 벗겨 삶은 뒤 포크로 곱게 으깬다.'),
    (3, '두 재료를 골고루 섞어 부드러운 농도로 맞춘다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '소고기 감자조림밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '소고기 감자조림밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '소고기 35g을 잘게 다져 팬에 2분간 볶는다.'),
    (2, '감자 30g과 당근 15g을 잘게 썰어 물을 자작하게 붓고 5분간 부드럽게 조린다.'),
    (3, '조린 재료와 밥 70g을 골고루 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '닭고기 고구마 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '닭고기 고구마 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '닭가슴살 35g을 끓는 물에 삶아 결대로 잘게 찢는다.'),
    (2, '고구마 30g을 삶아 포크로 으깬다.'),
    (3, '밥 60g, 찢은 닭고기, 으깬 고구마를 부드럽게 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '시금치 두부국밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '시금치 두부국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '시금치 25g을 끓는 물에 1분간 데친 뒤 잘게 다진다.'),
    (2, '두부 40g을 으깨서 물 100ml에 넣고 끓인다.'),
    (3, '시금치와 밥 70g을 넣고 한소끔 더 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '돼지고기 채소볶음밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '돼지고기 채소볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '돼지고기 35g을 잘게 다져 팬에서 속까지 완전히 익힌다.'),
    (2, '당근 15g과 양파 15g을 잘게 다져 함께 3분간 볶는다.'),
    (3, '밥 80g을 넣고 골고루 볶는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '콩나물 밥국')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '콩나물 밥국')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '콩나물 30g을 3~4등분으로 잘게 잘라 끓는 물에 3분간 부드럽게 삶는다.'),
    (2, '육수 또는 물 150ml에 밥 70g과 콩나물을 넣고 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '소고기 미역국밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '소고기 미역국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '마른미역 10g을 물에 10분간 불린 뒤 잘게 썬다.'),
    (2, '참기름 2g을 두른 냄비에 소고기 30g과 미역을 넣고 2분간 볶는다.'),
    (3, '물 200ml를 넣고 10분간 푹 끓인 뒤 밥 80g을 곁들인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '감자 치즈 그라탕')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '감자 치즈 그라탕')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '감자 60g을 얇게 썰어 부드러워질 때까지 10분간 삶는다.'),
    (2, '내열 용기에 감자와 우유 30ml를 담는다.'),
    (3, '치즈 20g을 올려 전자레인지나 오븐에서 치즈가 녹을 때까지 익힌다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '흰살생선 채소 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '흰살생선 채소 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '흰살생선 30g을 완전히 익힌 뒤 가시를 제거하고 잘게 으깬다.'),
    (2, '애호박 20g과 당근 15g을 잘게 다져 부드럽게 익힌다.'),
    (3, '밥 60g과 모든 재료를 골고루 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '소고기 시금치죽')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '소고기 시금치죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '소고기 30g을 잘게 다져 팬에 2분간 볶는다.'),
    (2, '시금치 20g을 데쳐 잘게 다진다.'),
    (3, '현미밥 60g과 물 100ml를 넣고 죽처럼 부드럽게 끓인 뒤 소고기와 시금치를 넣는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '사과 오트밀')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '사과 오트밀')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '사과 30g을 강판에 갈거나 푹 익혀 곱게 으깬다.'),
    (2, '오트밀 20g을 따뜻한 물 40ml에 5분간 불려 부드럽게 만든다.'),
    (3, '두 재료를 골고루 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '고구마 매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '고구마 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '고구마 50g의 껍질을 벗겨 부드러워질 때까지 15분간 삶는다.'),
    (2, '포크로 곱게 으깨 덩어리 없이 부드럽게 만든다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '감자 치즈 매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '감자 치즈 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '감자 50g을 삶아 곱게 으깬다.'),
    (2, '치즈 15g을 잘게 잘라 따뜻한 감자에 섞어 녹인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '두부 김가루밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '두부 김가루밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '두부 40g을 곱게 으깬다.'),
    (2, '밥 60g과 두부를 섞는다.'),
    (3, '잘게 부순 김 1g을 뿌려 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '블루베리 요거트')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '블루베리 요거트')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '블루베리 30g을 씻어 껍질까지 곱게 으깬다.'),
    (2, '무가당 플레인 요거트 60g과 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '계란 국수')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '계란 국수')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '국수 50g을 삶은 뒤 1~2cm 길이로 짧게 자른다.'),
    (2, '계란 1개를 완전히 풀어 팬에서 국수와 함께 약한 불로 익힌다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '냉동만두 야채찜')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '냉동만두 야채찜')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '냉동만두 60g과 잘게 썬 당근 15g을 찜기에 넣고 10분간 푹 찐다.'),
    (2, '만두 속까지 완전히 익었는지 확인한 뒤 한입 크기로 잘라 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '사과 치즈 스틱')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '사과 치즈 스틱')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '사과 40g을 얇고 작은 스틱 모양으로 썬다.'),
    (2, '치즈 15g도 비슷한 크기로 썰어 사과와 함께 낸다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '우유 감자수프')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '우유 감자수프')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '감자 50g을 삶아 곱게 으깬다.'),
    (2, '따뜻하게 데운 우유 80ml를 부어 수프 농도로 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '냉동베리 요거트볼')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '냉동베리 요거트볼')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '냉동베리 30g을 실온에서 5분간 살짝 해동한 뒤 곱게 으깬다.'),
    (2, '무가당 플레인 요거트 60g과 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '닭고기 애호박 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '닭고기 애호박 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '닭가슴살 35g을 삶아 결대로 잘게 찢는다.'),
    (2, '애호박 25g을 잘게 다져 부드럽게 익힌다.'),
    (3, '밥 60g과 함께 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '연어 감자 매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '연어 감자 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '연어 30g을 완전히 익힌 뒤 가시를 제거하고 잘게 부순다.'),
    (2, '감자 40g을 삶아 곱게 으깬다.'),
    (3, '두 재료를 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '두부 시금치죽')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '두부 시금치죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '두부 40g을 곱게 으깬다.'),
    (2, '시금치 20g을 데쳐 잘게 다진다.'),
    (3, '현미밥 60g과 물 100ml를 넣고 함께 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '소고기 브로콜리덮밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '소고기 브로콜리덮밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '소고기 40g을 잘게 다져 팬에 3분간 볶는다.'),
    (2, '브로콜리 30g을 데쳐 잘게 다진다.'),
    (3, '밥 80g과 함께 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '닭고기 양파 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '닭고기 양파 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '닭가슴살 40g을 삶아 결대로 잘게 찢는다.'),
    (2, '양파 20g을 잘게 다져 투명해질 때까지 3분간 볶는다.'),
    (3, '밥 70g과 함께 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '참치 애호박덮밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '참치 애호박덮밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '참치 30g은 기름을 빼고 잘게 으깬다.'),
    (2, '애호박 25g을 잘게 다져 2분간 볶는다.'),
    (3, '밥 80g과 함께 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '돼지고기 감자조림')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '돼지고기 감자조림')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '돼지고기 40g을 잘게 다져 완전히 익힌다.'),
    (2, '감자 30g과 양파 15g을 넣고 물을 자작하게 부어 5분간 조린다.'),
    (3, '밥 80g과 곁들여 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '연어 시금치 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '연어 시금치 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '연어 35g을 완전히 익힌 뒤 가시를 제거하고 부순다.'),
    (2, '시금치 20g을 데쳐 잘게 다진다.'),
    (3, '밥 75g과 함께 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '소고기 콩나물국밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '소고기 콩나물국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '소고기 30g을 잘게 다져 볶는다.'),
    (2, '콩나물 25g을 잘게 잘라 부드럽게 삶는다.'),
    (3, '육수에 밥 80g과 함께 넣고 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '흰살생선 브로콜리 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '흰살생선 브로콜리 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '흰살생선 30g을 완전히 익힌 뒤 가시를 제거하고 으깬다.'),
    (2, '브로콜리 25g을 데쳐 잘게 다진다.'),
    (3, '밥 60g과 함께 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '두부 브로콜리 매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '두부 브로콜리 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '두부 40g을 곱게 으깬다.'),
    (2, '브로콜리 20g을 데쳐 곱게 다져 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '바나나 오트밀')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '바나나 오트밀')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '바나나 40g을 포크로 곱게 으깬다.'),
    (2, '오트밀 20g을 따뜻한 물 40ml에 10분간 불린다.'),
    (3, '으깬 바나나와 불린 오트밀을 섞어 골고루 저어준다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '감자 당근 매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '감자 당근 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '감자 35g과 당근 20g의 껍질을 벗겨 부드러워질 때까지 12분간 삶는다.'),
    (2, '두 재료를 곱게 으깨 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '치즈 계란말이')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '치즈 계란말이')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '계란 1개를 완전히 풀고, 치즈 10g을 잘게 잘라 섞는다.'),
    (2, '약한 불로 달군 팬에 얇게 부쳐 돌돌 만다.'),
    (3, '한 김 식힌 뒤 한입 크기로 잘라 제공한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '참치 두부덮밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '참치 두부덮밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '참치 25g은 기름을 빼고 두부 30g과 함께 곱게 으깬다.'),
    (2, '따뜻한 밥 70g 위에 올려 골고루 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '사과 요거트')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '사과 요거트')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '사과 30g을 푹 익혀 곱게 으깬다.'),
    (2, '무가당 플레인 요거트 60g과 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '미역 계란국밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '미역 계란국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '마른미역 8g을 물에 10분간 불려 잘게 썬다.'),
    (2, '물 200ml에 미역을 넣고 5분간 끓이다 완전히 푼 계란 1개를 넣는다.'),
    (3, '밥 80g과 함께 낸다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '냉동만두 감자수프')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '냉동만두 감자수프')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '냉동만두 40g을 잘게 잘라 감자 30g과 함께 물 150ml에 넣고 10분간 끓인다.'),
    (2, '감자가 부드러워지면 수저로 으깨 걸쭉하게 만든다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '국수 애호박볶음')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '국수 애호박볶음')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '국수 50g을 삶아 1~2cm 길이로 짧게 자른다.'),
    (2, '애호박 20g을 잘게 다져 참기름 2g에 2분간 볶는다.'),
    (3, '국수를 넣고 함께 볶는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '콩나물 두부무침밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '콩나물 두부무침밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '콩나물 25g을 잘게 잘라 데친다.'),
    (2, '두부 35g을 으깨 콩나물과 함께 무친다.'),
    (3, '밥 80g과 곁들여 낸다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '무 배추 두부국밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '무 배추 두부국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '무 20g과 배추 20g을 잘게 다져 부드러워질 때까지 5분간 삶는다.'),
    (2, '두부 30g을 으깨 함께 끓인다.'),
    (3, '밥 70g과 곁들여 낸다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '숙주나물 무침밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '숙주나물 무침밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '숙주나물 30g을 끓는 물에 2분간 데친 뒤 잘게 다진다.'),
    (2, '참기름 2g과 밥 70g을 넣고 골고루 무친다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '오이 그릭요거트무침')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '오이 그릭요거트무침')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '오이 30g은 씨를 제거하고 잘게 썬다.'),
    (2, '그릭요거트 50g과 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '파프리카 채소볶음밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '파프리카 채소볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '파프리카 25g과 당근 15g을 잘게 다져 3분간 부드럽게 볶는다.'),
    (2, '밥 70g을 넣고 골고루 볶는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '단호박 진밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '단호박 진밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '단호박 50g의 씨를 제거하고 10분간 푹 찐다.'),
    (2, '곱게 으깬 뒤 밥 30g과 부드럽게 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '옥수수 감자수프')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '옥수수 감자수프')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '옥수수 30g과 감자 30g을 삶아 곱게 으깬다.'),
    (2, '우유 50ml를 넣고 수프 농도로 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '양송이버섯 계란볶음밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '양송이버섯 계란볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '양송이버섯 25g을 잘게 다져 2분간 볶는다.'),
    (2, '완전히 푼 계란 1개를 넣고 함께 볶는다.'),
    (3, '밥 80g을 넣고 골고루 볶는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '가지 두부덮밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '가지 두부덮밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '가지 30g을 잘게 다져 부드러워질 때까지 3분간 볶는다.'),
    (2, '두부 35g을 으깨 함께 볶는다.'),
    (3, '밥 80g 위에 올려 낸다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '마늘생강 소고기볶음밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '마늘생강 소고기볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '마늘 2g과 생강 1g을 아주 잘게 다진다.'),
    (2, '소고기 40g과 함께 약한 불에서 3분간 볶는다.'),
    (3, '밥 80g을 넣고 골고루 볶는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '대파 계란국밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '대파 계란국밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '대파 10g을 아주 잘게 썬다.'),
    (2, '물 200ml에 대파를 넣고 끓이다 완전히 푼 계란 1개를 넣는다.'),
    (3, '밥 80g과 함께 낸다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '셀러리 닭죽')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '셀러리 닭죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '닭가슴살 35g을 삶아 결대로 찢는다.'),
    (2, '셀러리 20g의 질긴 섬유질을 제거하고 아주 잘게 다져 부드럽게 익힌다.'),
    (3, '밥 60g과 함께 죽처럼 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '케일 사과 그릭요거트볼')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '케일 사과 그릭요거트볼')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '케일 15g은 줄기를 제거하고 잎만 데쳐서 아주 곱게 다진다.'),
    (2, '사과 30g을 푹 익혀 으깬다.'),
    (3, '케일, 사과, 그릭요거트 50g을 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '배 사과 퓨레')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '배 사과 퓨레')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '배 30g과 사과 30g을 껍질과 씨를 제거하고 부드러워질 때까지 10분간 익힌다.'),
    (2, '곱게 으깨 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '딸기 그릭요거트')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '딸기 그릭요거트')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '딸기 30g을 씻어 꼭지를 떼고 곱게 으깬다.'),
    (2, '무가당 그릭요거트 50g과 섞는다. 처음 시도라면 소량만 제공하고 알레르기 반응을 관찰한다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '키위 매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '키위 매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '키위 40g의 껍질을 벗기고 씨를 최대한 제거한다.'),
    (2, '과육을 곱게 으깬다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '망고 그릭요거트볼')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '망고 그릭요거트볼')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '망고 30g을 껍질과 씨를 제거하고 곱게 으깬다.'),
    (2, '무가당 그릭요거트 50g과 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '보리 새우볶음밥')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '보리 새우볶음밥')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '보리 30g을 미리 삶아 부드럽게 준비한다.'),
    (2, '새우 30g은 껍질과 내장을 제거하고 완전히 익힌 뒤 잘게 다진다.'),
    (3, '보리밥과 흰밥 50g, 새우를 골고루 볶는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '퀴노아 채소죽')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '퀴노아 채소죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '퀴노아 30g을 깨끗이 씻어 물 100ml에 15분간 푹 삶는다.'),
    (2, '당근 15g과 애호박 15g을 잘게 다져 함께 넣고 5분 더 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '완두콩 두부매시')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '완두콩 두부매시')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '완두콩 30g을 삶아 껍질을 벗기고 곱게 으깬다.'),
    (2, '두부 30g과 함께 섞는다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '병아리콩 채소스튜')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '병아리콩 채소스튜')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '병아리콩 35g을 부드러워질 때까지 20분간 삶아 으깬다.'),
    (2, '당근 20g과 양파 15g을 잘게 다져 함께 8분간 끓인다.'),
    (3, '다진 파슬리 1g을 아주 소량 뿌려 낸다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '렌틸콩 야채죽')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '렌틸콩 야채죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '렌틸콩 30g을 물에 15분간 삶는다.'),
    (2, '당근 15g을 잘게 다져 밥 50g과 함께 넣고 5분 더 끓인다.')
  ) as s(step_number, instruction);

  with r as (select id from recipes where name = '굴 야채죽')
  delete from recipe_steps where recipe_id in (select id from r);
  with r as (select id from recipes where name = '굴 야채죽')
  insert into recipe_steps (recipe_id, step_number, instruction)
  select r.id, s.step_number, s.instruction from r, (values
    (1, '굴 25g을 흐르는 물에 깨끗이 씻어 이물질을 제거한다.'),
    (2, '끓는 물에 완전히 익힌 뒤 잘게 다진다.'),
    (3, '당근 15g을 잘게 다져 밥 60g과 함께 끓인 뒤 굴을 넣고 한소끔 더 끓인다.')
  ) as s(step_number, instruction);