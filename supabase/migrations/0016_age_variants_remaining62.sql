-- 이 파일은 supabase/migrations/0016_age_variants_remaining62.sql 로 저장해서 실행해주세요 --
-- 기존 recipe_age_variants 9개(감자전+파일럿8개)에 이어서, 나머지 62개 레시피에 월령별 조리 가이드를 추가합니다 --
-- 메뉴 타입(밥/죽/국/간식/계란/면/스튜/핑거푸드)별로 표준화된 질감·크기·조리법 가이드입니다 --

with r as (select id from recipes where name = '계란밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '연어 브로콜리 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '두부 채소 볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '바나나 요거트')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '흰살생선 감자 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '소고기 감자조림밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '닭고기 고구마 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '시금치 두부국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '돼지고기 채소볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '콩나물 밥국')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '흰살생선 채소 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '소고기 시금치죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '고구마 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '감자 치즈 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '두부 김가루밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '블루베리 요거트')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '계란 국수')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 면 요리', '면을 1~2cm 길이로 짧게 잘라서 제공', '푹 삶아 부드럽게 만든다', '면을 1~2cm 길이로 짧게 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '냉동만두 야채찜')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '손으로 집어먹기 좋은 형태', '아기 손가락 크기의 작은 스틱 모양', '질식 위험이 없도록 부드럽게 조리한다', '아기 손가락 크기의 작은 스틱 모양. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '사과 치즈 스틱')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '손으로 집어먹기 좋은 형태', '아기 손가락 크기의 작은 스틱 모양', '질식 위험이 없도록 부드럽게 조리한다', '아기 손가락 크기의 작은 스틱 모양. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '우유 감자수프')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '냉동베리 요거트볼')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '닭고기 애호박 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '연어 감자 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '두부 시금치죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '소고기 브로콜리덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '닭고기 양파 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '참치 애호박덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '돼지고기 감자조림')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 조림 요리', '한입 크기로 잘게 썰어서 제공', '푹 조려 부드럽게 만든다', '한입 크기로 잘게 썰어서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '연어 시금치 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '소고기 콩나물국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '흰살생선 브로콜리 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '두부 브로콜리 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '바나나 오트밀')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '감자 당근 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '치즈 계란말이')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 계란 요리', '한입 크기로 잘라서 제공', '완전히 익혀서 제공한다', '한입 크기로 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '참치 두부덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '사과 요거트')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '미역 계란국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '냉동만두 감자수프')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '국수 애호박볶음')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 면 요리', '면을 1~2cm 길이로 짧게 잘라서 제공', '푹 삶아 부드럽게 만든다', '면을 1~2cm 길이로 짧게 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '콩나물 두부무침밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '무 배추 두부국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '숙주나물 무침밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '오이 그릭요거트무침')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '파프리카 채소볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '단호박 진밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '옥수수 감자수프')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '양송이버섯 계란볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '가지 두부덮밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '마늘생강 소고기볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 24~36개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '대파 계란국밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 국물 요리', '건더기를 잘게 썰어 목에 걸리지 않게', '간을 최소화해서 조리한다', '건더기를 잘게 썰어 목에 걸리지 않게. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '셀러리 닭죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '케일 사과 그릭요거트볼')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '배 사과 퓨레')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 6, 8, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 6~8개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '딸기 그릭요거트')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '키위 매시')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '망고 그릭요거트볼')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 간식 형태', '숟가락으로 떠먹기 좋은 크기', '덩어리 없이 곱게 으깬다', '숟가락으로 떠먹기 좋은 크기. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '보리 새우볶음밥')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '부드러운 밥 형태', '재료를 잘게 다지거나 잘라서 제공', '재료를 푹 익혀 작게 썰어 밥과 섞는다', '재료를 잘게 다지거나 잘라서 제공. 24~36개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '퀴노아 채소죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 9, 11, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 9~11개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '병아리콩 채소스튜')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 18, 23, '부드러운 조림 요리', '한입 크기로 잘게 썰어서 제공', '푹 조려 부드럽게 만든다', '한입 크기로 잘게 썰어서 제공. 18~23개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '렌틸콩 야채죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 12, 17, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 12~17개월 기준으로 조절하세요.', '소량'
from r;

with r as (select id from recipes where name = '굴 야채죽')
insert into recipe_age_variants (recipe_id, age_from_month, age_to_month, texture, size_guide, cooking_method, serving_note, oil_level)
select r.id, 24, 36, '부드러운 죽 농도', '건더기를 잘게 다져서 제공', '물을 조금 더 넣어 농도를 부드럽게 조절한다', '건더기를 잘게 다져서 제공. 24~36개월 기준으로 조절하세요.', '소량'
from r;
