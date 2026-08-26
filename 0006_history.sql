-- STEP 11: 추천 기록 / 피드백 / 즐겨찾기 (스펙 18, 19장)

-- 매일 어떤 레시피가 "오늘의 추천" / "초간편"으로 나갔는지 기록.
-- 스펙 8장 "최근 추천되지 않은 메뉴 우선"을 계산할 때 이 테이블을 조회한다.
create table if not exists recommendations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_id uuid not null references babies (id) on delete cascade,
  recipe_id uuid not null references recipes (id),
  recommendation_type text not null check (recommendation_type in ('main', 'quick')),
  recommended_date date not null,
  created_at timestamptz not null default now(),
  unique (baby_id, recommendation_type, recommended_date)
);

-- 좋아요 / 별로예요 / 만들어봤어요 / 다시추천 (스펙 18장)
create table if not exists recommendation_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references recipes (id),
  feedback_type text not null check (feedback_type in ('like', 'dislike', 'cooked', 'reroll')),
  created_at timestamptz not null default now()
);

create table if not exists favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id uuid not null references recipes (id),
  created_at timestamptz not null default now(),
  unique (user_id, recipe_id)
);

alter table recommendations enable row level security;
alter table recommendation_feedback enable row level security;
alter table favorites enable row level security;

create policy "recommendations_owner_all" on recommendations
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "recommendation_feedback_owner_all" on recommendation_feedback
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "favorites_owner_all" on favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists idx_recommendations_baby_date on recommendations (baby_id, recommended_date desc);
create index if not exists idx_feedback_user_recipe on recommendation_feedback (user_id, recipe_id);
create index if not exists idx_favorites_user on favorites (user_id);
