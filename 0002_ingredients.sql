-- STEP 5: 식재료 관리 관련 테이블

-- 공용 식재료 마스터 목록 (스펙 7장 카테고리 기준)
create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null check (
    category in ('곡류', '육류', '생선', '달걀', '두부/콩', '채소', '과일', '유제품', '해조류', '조미료', '냉동식품', '기타')
  ),
  created_at timestamptz not null default now()
);

-- 사용자가 "현재 집에 가지고 있는" 재료 (스펙 7장)
create table if not exists user_ingredients (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  ingredient_id uuid not null references ingredients (id) on delete cascade,
  is_owned boolean not null default true,
  expiry_date date,
  usage_count integer not null default 0,
  registered_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, ingredient_id)
);

alter table ingredients enable row level security;
alter table user_ingredients enable row level security;

-- 마스터 재료 목록은 로그인한 모든 사용자가 조회만 가능 (수정은 관리자 화면/서비스 롤에서만, 스펙 23장)
create policy "ingredients_read_all" on ingredients
  for select
  using (auth.role() = 'authenticated');

create policy "user_ingredients_owner_all" on user_ingredients
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_ingredients_category on ingredients (category);
create index if not exists idx_user_ingredients_user_id on user_ingredients (user_id);

-- ---------- 시드 데이터 ----------
insert into ingredients (name, category) values
  ('밥', '곡류'), ('현미밥', '곡류'), ('오트밀', '곡류'), ('국수', '곡류'),
  ('소고기', '육류'), ('닭가슴살', '육류'), ('돼지고기', '육류'),
  ('흰살생선', '생선'), ('연어', '생선'), ('참치', '생선'),
  ('계란', '달걀'),
  ('두부', '두부/콩'), ('콩나물', '두부/콩'),
  ('애호박', '채소'), ('당근', '채소'), ('양파', '채소'), ('브로콜리', '채소'),
  ('시금치', '채소'), ('감자', '채소'), ('고구마', '채소'),
  ('바나나', '과일'), ('사과', '과일'), ('블루베리', '과일'),
  ('플레인요거트', '유제품'), ('우유', '유제품'), ('치즈', '유제품'),
  ('미역', '해조류'), ('김', '해조류'),
  ('국간장', '조미료'), ('참기름', '조미료'),
  ('냉동만두', '냉동식품'), ('냉동베리', '냉동식품')
on conflict (name) do nothing;
