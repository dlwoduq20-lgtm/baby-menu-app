-- STEP 4: 아기 프로필 관련 테이블
-- Supabase 대시보드 SQL Editor에 붙여넣거나 `supabase db push`로 적용하세요.

create extension if not exists "pgcrypto";

-- 아기 프로필 (스펙 6장)
create table if not exists babies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  birth_date date not null,
  gender text not null default 'unspecified' check (gender in ('female', 'male', 'unspecified')),
  created_at timestamptz not null default now()
);

-- 알레르기 식품 (스펙 6, 15장) — 여러 개 등록 가능하도록 별도 테이블로 분리
create table if not exists baby_allergies (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references babies (id) on delete cascade,
  allergen text not null,
  created_at timestamptz not null default now(),
  unique (baby_id, allergen)
);

-- 못 먹는 음식 / 피하고 싶은 음식 / 선호 음식 / 싫어하는 음식 (스펙 6장)
create table if not exists baby_preferences (
  id uuid primary key default gen_random_uuid(),
  baby_id uuid not null references babies (id) on delete cascade,
  food_name text not null,
  preference_type text not null check (preference_type in ('not_eaten', 'avoid', 'favorite', 'disliked')),
  created_at timestamptz not null default now(),
  unique (baby_id, food_name, preference_type)
);

-- ---------- Row Level Security ----------
-- 로그인한 사용자는 자신의 아기 데이터만 읽고 쓸 수 있다 (스펙 5장: "사용자별 데이터가 분리되어야 한다").

alter table babies enable row level security;
alter table baby_allergies enable row level security;
alter table baby_preferences enable row level security;

create policy "babies_owner_all" on babies
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "baby_allergies_owner_all" on baby_allergies
  for all
  using (exists (select 1 from babies b where b.id = baby_allergies.baby_id and b.user_id = auth.uid()))
  with check (exists (select 1 from babies b where b.id = baby_allergies.baby_id and b.user_id = auth.uid()));

create policy "baby_preferences_owner_all" on baby_preferences
  for all
  using (exists (select 1 from babies b where b.id = baby_preferences.baby_id and b.user_id = auth.uid()))
  with check (exists (select 1 from babies b where b.id = baby_preferences.baby_id and b.user_id = auth.uid()));

create index if not exists idx_babies_user_id on babies (user_id);
create index if not exists idx_baby_allergies_baby_id on baby_allergies (baby_id);
create index if not exists idx_baby_preferences_baby_id on baby_preferences (baby_id);
