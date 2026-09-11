-- 기능 업데이트: 레시피 실제 사진 업로드 지원

alter table recipes add column if not exists image_url text;

-- 레시피 사진 저장용 공개 버킷
insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

-- 48개 레시피 일러스트 이미지 URL 일괄 등록
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/7368e63b-b4d6-47da-9acd-482846fcab65.png' where id = '7368e63b-b4d6-47da-9acd-482846fcab65';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/7363b9cb-2b7b-4a33-9417-fa8603df1e6a.png' where id = '7363b9cb-2b7b-4a33-9417-fa8603df1e6a';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/3727cc4c-051b-48b6-854c-20c595828566.png' where id = '3727cc4c-051b-48b6-854c-20c595828566';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/96120652-03f2-4cc4-82cb-eb6b33c8aa1b.png' where id = '96120652-03f2-4cc4-82cb-eb6b33c8aa1b';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/30de5d4c-4ae8-4797-b8ed-6e134ae7e691.png' where id = '30de5d4c-4ae8-4797-b8ed-6e134ae7e691';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/3db49865-d596-4cbb-aa2c-cb75fe16a7ba.png' where id = '3db49865-d596-4cbb-aa2c-cb75fe16a7ba';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/24f74b09-6443-449a-a860-7aa12c5be6b7.png' where id = '24f74b09-6443-449a-a860-7aa12c5be6b7';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/f9bd8f66-e468-4ac6-9502-fcdd81b737b4.png' where id = 'f9bd8f66-e468-4ac6-9502-fcdd81b737b4';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/a8e878d5-4639-4d7b-8791-784dcecc1027.png' where id = 'a8e878d5-4639-4d7b-8791-784dcecc1027';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/82797931-ee78-4bcf-b511-530cde76ce7d.png' where id = '82797931-ee78-4bcf-b511-530cde76ce7d';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/05f62b1a-265c-447e-97f0-ca7a86bc07de.png' where id = '05f62b1a-265c-447e-97f0-ca7a86bc07de';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/804b8dc9-9edc-40e5-877e-d45a903069a2.png' where id = '804b8dc9-9edc-40e5-877e-d45a903069a2';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/92195487-4721-4f68-be20-05ccc3c1fb05.png' where id = '92195487-4721-4f68-be20-05ccc3c1fb05';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/4f1e2550-3628-4034-b110-ecd5cb3915e6.png' where id = '4f1e2550-3628-4034-b110-ecd5cb3915e6';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/1df7eb5c-2c46-49e2-af87-18c880c93ed9.png' where id = '1df7eb5c-2c46-49e2-af87-18c880c93ed9';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/e6a36d2b-2e35-47b6-a715-0d8a0d405983.png' where id = 'e6a36d2b-2e35-47b6-a715-0d8a0d405983';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/93fc825f-aeab-4c1c-aba4-4fddb68712b9.png' where id = '93fc825f-aeab-4c1c-aba4-4fddb68712b9';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/7ef8da3d-f5b5-424d-900f-3b67d59eff87.png' where id = '7ef8da3d-f5b5-424d-900f-3b67d59eff87';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/c50b084e-05c7-461c-8fe6-c2fde6bcf26a.png' where id = 'c50b084e-05c7-461c-8fe6-c2fde6bcf26a';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/3081763d-e983-407e-b16c-72b2377fc1e3.png' where id = '3081763d-e983-407e-b16c-72b2377fc1e3';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/41406373-4fd3-4583-8162-a33c9cf4972a.png' where id = '41406373-4fd3-4583-8162-a33c9cf4972a';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/cfa2a104-8159-495e-9eb9-917dbec03cd1.png' where id = 'cfa2a104-8159-495e-9eb9-917dbec03cd1';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/8b842eb3-d7a2-46bc-a331-a8f4ab248f3b.png' where id = '8b842eb3-d7a2-46bc-a331-a8f4ab248f3b';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/62ba0e8c-dfa9-4dd6-91e9-d6875b4fb199.png' where id = '62ba0e8c-dfa9-4dd6-91e9-d6875b4fb199';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/d2f8e405-6fda-4064-865b-dfec42f1c856.png' where id = 'd2f8e405-6fda-4064-865b-dfec42f1c856';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/99de86a7-5a0a-46ac-9e82-3e92cbe12253.png' where id = '99de86a7-5a0a-46ac-9e82-3e92cbe12253';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/11c70ce1-2914-4105-9912-dd6a9878388d.png' where id = '11c70ce1-2914-4105-9912-dd6a9878388d';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/08066d05-abdc-44c4-9919-49461e767862.png' where id = '08066d05-abdc-44c4-9919-49461e767862';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/36fe8031-e9f9-4f6f-a55f-bb55072eb016.png' where id = '36fe8031-e9f9-4f6f-a55f-bb55072eb016';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/ce69aa72-8ddb-440b-b591-cd64daa9b809.png' where id = 'ce69aa72-8ddb-440b-b591-cd64daa9b809';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/8d80b9b0-7ec5-43b2-9884-ecfbbd6fd751.png' where id = '8d80b9b0-7ec5-43b2-9884-ecfbbd6fd751';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/80388aa6-931b-4b51-b9f5-f9fef5d56263.png' where id = '80388aa6-931b-4b51-b9f5-f9fef5d56263';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/0f8fc198-7534-4958-9019-a9bcb3710399.png' where id = '0f8fc198-7534-4958-9019-a9bcb3710399';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/46c3385d-fae9-402d-965f-3f8f5578ee96.png' where id = '46c3385d-fae9-402d-965f-3f8f5578ee96';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/4fd8f050-2f7e-40ae-84d2-aa800c484967.png' where id = '4fd8f050-2f7e-40ae-84d2-aa800c484967';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/a3fcd87d-8136-42cb-8524-85abb6b8b841.png' where id = 'a3fcd87d-8136-42cb-8524-85abb6b8b841';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/29b72bbb-5390-4f72-b11e-f8d77a566c93.png' where id = '29b72bbb-5390-4f72-b11e-f8d77a566c93';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/4a5665b1-91d3-469f-a034-3cd4f719a547.png' where id = '4a5665b1-91d3-469f-a034-3cd4f719a547';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/b9d1b760-6c72-4525-a611-872208c3f7b9.png' where id = 'b9d1b760-6c72-4525-a611-872208c3f7b9';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/864b3d61-fffb-49a7-b294-24c95a8d37ae.png' where id = '864b3d61-fffb-49a7-b294-24c95a8d37ae';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/07fd8192-7379-4eb2-8807-1ba344355104.png' where id = '07fd8192-7379-4eb2-8807-1ba344355104';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/15712da2-f190-4d61-9ead-b5690dc9bcbd.png' where id = '15712da2-f190-4d61-9ead-b5690dc9bcbd';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/61568432-19bb-4779-874a-ed6bdd95a380.png' where id = '61568432-19bb-4779-874a-ed6bdd95a380';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/ac1c1c3e-633b-41b4-b495-fc9d6076b5f8.png' where id = 'ac1c1c3e-633b-41b4-b495-fc9d6076b5f8';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/2f19ed46-b775-441f-b8a5-0828161f9a53.png' where id = '2f19ed46-b775-441f-b8a5-0828161f9a53';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/67cf26c7-9805-4729-a8e8-5eed627f80f6.png' where id = '67cf26c7-9805-4729-a8e8-5eed627f80f6';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/1c9376f4-99de-4799-a9e9-253dbb6952df.png' where id = '1c9376f4-99de-4799-a9e9-253dbb6952df';
update recipes set image_url = 'https://aoeuzyftcesrciqkoygg.supabase.co/storage/v1/object/public/recipe-images/3c2f4660-efa9-4243-af46-58841112a22c.png' where id = '3c2f4660-efa9-4243-af46-58841112a22c';
