-- STEP 7: 월령별 안전 규칙을 하드코딩이 아닌 DB로 관리 (스펙 14, 15, 23장)

create table if not exists age_rules (
  id uuid primary key default gen_random_uuid(),
  stage text not null unique check (
    stage in ('0-5', '6-8', '9-11', '12-17', '18-23', '24+')
  ),
  recommended_food_groups text[] not null default '{}',  -- 권장 식품군
  texture text not null,                                  -- 식감
  food_size_guide text not null,                          -- 음식 크기 가이드
  cooking_method text not null,                            -- 조리 방법
  avoid_foods text[] not null default '{}',                -- 피해야 하는 음식
  caution_foods text[] not null default '{}',              -- 주의해야 하는 음식
  allergy_caution text,                                    -- 알레르기 주의 설명
  choking_hazard_foods text[] not null default '{}',       -- 질식 위험 음식
  updated_at timestamptz not null default now()
);

alter table age_rules enable row level security;

-- 모든 로그인 사용자는 읽을 수 있지만, 쓰기는 관리자(서비스 롤)만 가능 (스펙 23장: 관리자에서만 수정)
create policy "age_rules_read_all" on age_rules for select using (auth.role() = 'authenticated');

-- ---------- 시드 데이터 ----------
insert into age_rules (stage, recommended_food_groups, texture, food_size_guide, cooking_method, avoid_foods, caution_foods, allergy_caution, choking_hazard_foods)
values
  (
    '0-5',
    '{}',
    '이유식 대상 아님',
    '해당 없음',
    '해당 없음',
    '{}', '{}',
    '이 서비스는 만 6개월 이상을 기준으로 추천합니다. 그 이전 시기의 수유·이유식 시작은 소아과 상담을 먼저 받아보세요.',
    '{}'
  ),
  (
    '6-8',
    array['곡류(쌀미음)', '으깬 채소', '으깬 과일', '살코기 소량'],
    '완전히 으깬 형태 (퓨레/미음 수준)',
    '입자 없이 곱게 으깬 상태',
    '푹 삶아서 곱게 으깨거나 갈아서 조리',
    array['꿀', '날계란', '덜 익힌 육류/생선', '간이 강한 음식', '우유(음료 대체용)'],
    array['새로운 알레르기 유발 식품은 한 번에 하나씩만 시도'],
    '계란, 우유, 밀, 대두, 견과류, 갑각류 등은 소량씩 단독으로 먼저 시도하고 반응을 관찰하세요.',
    array['통포도', '견과류(통알)', '팝콘', '생당근']
  ),
  (
    '9-11',
    array['곡류', '잘게 다진 채소', '잘게 다진 육류/생선', '두부/달걀'],
    '잘게 다진 형태',
    '3~5mm 크기로 다짐',
    '푹 삶거나 쪄서 잘게 다지기',
    array['꿀', '날계란', '덜 익힌 육류/생선', '과도한 나트륨/당류'],
    array['질식 위험 재료는 반드시 다진 형태로만 제공'],
    '이미 확인된 알레르기 식품은 완전히 제외. 새로운 식품은 여전히 소량부터 시작하세요.',
    array['통포도', '견과류(통알)', '팝콘', '큰 고기 덩어리']
  ),
  (
    '12-17',
    array['일반 곡류', '채소', '육류/생선/두부', '유제품(소량)'],
    '잘게 썬 진밥 수준',
    '5~8mm 크기로 썰기',
    '부드럽게 조리, 간은 최소화',
    array['과도한 나트륨/당류', '날계란'],
    array['질식 위험 식품은 잘게 썰어서만 제공'],
    '반응이 확인된 알레르기 식품 외에는 다양한 식품군을 조금씩 넓혀가도 좋습니다.',
    array['통포도', '견과류(통알)', '팝콘']
  ),
  (
    '18-23',
    array['가족식과 유사한 일반 식품군 전반'],
    '부드러운 일반식에 가까운 형태',
    '한 입 크기(1~1.5cm)로 자르기',
    '일반 조리, 다만 간은 성인보다 약하게',
    array['과도한 나트륨/당류'],
    array['통포도, 방울토마토 등은 4등분 이상으로 잘라서 제공'],
    '확인된 알레르기 식품은 계속 제외하세요.',
    array['통포도(자르지 않은 경우)', '단단한 생채소', '견과류(통알)']
  ),
  (
    '24+',
    array['가족식 응용 가능'],
    '가족식과 거의 동일, 크기만 조절',
    '아기 한 입 크기 유지',
    '가족식 조리법을 그대로 응용 가능',
    '{}',
    array['단단한 생채소나 견과류는 잘게 잘라서 제공'],
    '확인된 알레르기 식품은 계속 제외하세요.',
    array['단단한 생채소(큼직하게 썬 경우)', '견과류(통알)']
  )
on conflict (stage) do nothing;
