-- 기능 업데이트 #1, #3: 주간 식단 + 장보기 리스트의 기반 데이터

create table if not exists weekly_meal_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_id uuid not null references babies (id) on delete cascade,
  week_start_date date not null, -- 그 주 토요일 날짜
  created_at timestamptz not null default now(),
  unique (baby_id, week_start_date)
);

create table if not exists weekly_meal_plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references weekly_meal_plans (id) on delete cascade,
  day_offset integer not null check (day_offset between 0 and 6), -- week_start_date 기준 +N일
  meal_type text not null check (meal_type in ('main', 'quick')),
  recipe_id uuid not null references recipes (id),
  unique (plan_id, day_offset, meal_type)
);

alter table weekly_meal_plans enable row level security;
alter table weekly_meal_plan_items enable row level security;

create policy "weekly_meal_plans_owner_all" on weekly_meal_plans
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "weekly_meal_plan_items_owner_all" on weekly_meal_plan_items
  for all using (exists (select 1 from weekly_meal_plans p where p.id = weekly_meal_plan_items.plan_id and p.user_id = auth.uid()))
  with check (exists (select 1 from weekly_meal_plans p where p.id = weekly_meal_plan_items.plan_id and p.user_id = auth.uid()));

create index if not exists idx_weekly_plans_baby_week on weekly_meal_plans (baby_id, week_start_date desc);
create index if not exists idx_weekly_plan_items_plan on weekly_meal_plan_items (plan_id);
