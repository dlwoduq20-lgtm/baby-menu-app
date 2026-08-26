-- STEP 10: 오후 4시 알림 (스펙 10, 19장)

create table if not exists notification_settings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  enabled boolean not null default true,
  notify_time time not null default '16:00:00',  -- 기본값 16:00 (스펙 10장), 추후 변경 가능
  push_endpoint text,
  push_p256dh text,
  push_auth text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table notification_settings enable row level security;

create policy "notification_settings_owner_all" on notification_settings
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists idx_notification_settings_enabled_time on notification_settings (enabled, notify_time);
