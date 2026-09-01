-- 기능 업데이트 #2, #4: 재료별로 "이 재료가 주로 채워주는 영양소"를 태그로 관리.
-- 의료적 수치가 아니라 일반적으로 알려진 대표 영양소를 안내용으로만 표시한다 (스펙 13, 15장 원칙 유지).

alter table ingredients add column if not exists primary_nutrients text[] not null default '{}';

update ingredients set primary_nutrients = v.nutrients
from (values
  ('밥', array['탄수화물']),
  ('현미밥', array['탄수화물', '식이섬유']),
  ('오트밀', array['식이섬유', '철분']),
  ('국수', array['탄수화물']),
  ('소고기', array['단백질', '철분', '아연']),
  ('닭가슴살', array['단백질']),
  ('돼지고기', array['단백질', '비타민B1']),
  ('흰살생선', array['단백질', 'DHA']),
  ('연어', array['단백질', '오메가-3']),
  ('참치', array['단백질', '오메가-3']),
  ('계란', array['단백질', '콜린']),
  ('두부', array['단백질', '칼슘']),
  ('콩나물', array['식이섬유', '비타민C']),
  ('애호박', array['비타민A', '식이섬유']),
  ('당근', array['비타민A']),
  ('양파', array['식이섬유']),
  ('브로콜리', array['비타민C', '식이섬유']),
  ('시금치', array['철분', '비타민A']),
  ('감자', array['탄수화물', '비타민C']),
  ('고구마', array['탄수화물', '식이섬유']),
  ('바나나', array['칼륨', '식이섬유']),
  ('사과', array['식이섬유', '비타민C']),
  ('블루베리', array['비타민C', '항산화물질']),
  ('플레인요거트', array['칼슘', '단백질']),
  ('우유', array['칼슘', '단백질']),
  ('치즈', array['칼슘', '단백질']),
  ('미역', array['칼슘', '요오드']),
  ('김', array['요오드', '식이섬유']),
  ('국간장', array['나트륨(소량만 사용)']),
  ('참기름', array['불포화지방']),
  ('냉동만두', array['탄수화물', '단백질']),
  ('냉동베리', array['비타민C', '항산화물질'])
) as v(name, nutrients)
where ingredients.name = v.name;
