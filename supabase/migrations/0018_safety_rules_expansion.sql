-- 업데이트 2: 안전등급 데이터 확대 (16개 재료, 19건)
-- supabase/migrations/0018_safety_rules_expansion.sql 로 저장해서 실행

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '동그랗고 단단해서 통째로 주면 위험해요. 반으로 잘라서 제공하세요.' from ingredients where name = '블루베리';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '반으로 잘라서 제공하는 걸 권장해요.' from ingredients where name = '블루베리';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '낱알 그대로 주면 위험해요. 으깨거나 다져서 제공하세요.' from ingredients where name = '옥수수';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '통째로 주면 위험해요. 푹 삶아 곱게 으깨서 제공하세요.' from ingredients where name = '병아리콩';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '삶아서 반으로 눌러 으깨 제공하세요.' from ingredients where name = '병아리콩';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '푹 삶아 곱게 으깨서 제공하세요.' from ingredients where name = '렌틸콩';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 8, 'SAFE_AFTER_MODIFICATION', 'allergen', '알레르기 유발 가능성이 높은 시기예요. 소량부터 완전히 익혀서 시작하고 이상반응을 살펴보세요.' from ingredients where name = '계란';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'allergen', '돌 전에는 음료로 그대로 마시기보다 조리용으로 소량만 사용하세요.' from ingredients where name = '우유';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 23, 'SAFE_AFTER_MODIFICATION', 'other', '수은 함량 때문에 너무 자주 주기보다 주 1~2회 이내로 제한하는 걸 권장해요.' from ingredients where name = '참치';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 17, 'SAFE_AFTER_MODIFICATION', 'choking', '불린 미역이 입천장에 붙을 수 있어요. 잘게 썰어서 제공하세요.' from ingredients where name = '미역';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 17, 'SAFE_AFTER_MODIFICATION', 'choking', '통김은 입에 붙어 위험할 수 있어요. 잘게 부숴서 뿌리는 형태로 제공하세요.' from ingredients where name = '김';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 17, 'SAFE_AFTER_MODIFICATION', 'choking', '쫄깃한 식감이라 완전히 익혀 잘게 다져서 제공하세요.' from ingredients where name = '양송이버섯';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '생으로 주면 질긴 섬유질이 위험해요. 충분히 익히고 섬유질을 제거해 잘게 썰어 제공하세요.' from ingredients where name = '셀러리';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 17, 'SAFE_AFTER_MODIFICATION', 'choking', '생오이는 단단해요. 껍질과 씨를 제거하고 아주 작게 썰어 제공하세요.' from ingredients where name = '오이';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '통째로 주면 위험해요. 4등분 이상으로 잘라서 제공하세요.' from ingredients where name = '딸기';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 11, 'SAFE_AFTER_MODIFICATION', 'choking', '생배는 단단해요. 푹 익히거나 강판에 갈아서 제공하세요.' from ingredients where name = '배';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 12, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '얇게 채썰거나 강판에 갈아서 제공하세요.' from ingredients where name = '배';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 17, 'SAFE_AFTER_MODIFICATION', 'choking', '긴 면을 그대로 주면 위험해요. 1~2cm로 짧게 잘라서 제공하세요.' from ingredients where name = '국수';

insert into ingredient_safety_rules (ingredient_id, age_from_month, age_to_month, safety_level, hazard_type, modification_note)
select id, 6, 23, 'SAFE_AFTER_MODIFICATION', 'choking', '만두피가 미끄러워 위험할 수 있어요. 작게 잘라서 충분히 식혀 제공하세요.' from ingredients where name = '냉동만두';
