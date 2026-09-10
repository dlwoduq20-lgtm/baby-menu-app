-- 기능 업데이트: 레시피 실제 사진 업로드 지원

alter table recipes add column if not exists image_url text;

-- 레시피 사진 저장용 공개 버킷 (읽기는 누구나, 쓰기는 서비스 롤/관리자 API 경유로만)
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;
