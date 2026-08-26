# 오늘 뭐 먹이지 — 아기 월령 기반 저녁 식단 추천 서비스

## 실행 방법
```bash
cp .env.local.example .env.local   # Supabase URL/anon key 채우기
npm install
npm run dev
```
`http://localhost:3000` 접속 시 세션 유무에 따라 `/landing`(비로그인) 또는 `/home`(로그인)으로 이동합니다.

### Supabase 설정 (STEP 3~4)
1. supabase.com에서 프로젝트 생성 → `.env.local`에 URL/anon key 입력
2. Authentication → Providers에서 **Google**, **Kakao** 활성화 (각 콘솔에서 발급받은 Client ID/Secret 입력)
3. Authentication → URL Configuration → Redirect URLs에 `http://localhost:3000/auth/callback` 추가
4. 네이버는 Supabase 기본 제공 provider가 아니라서 이번 STEP에서는 버튼만 두고 비활성화 처리했습니다. (Custom OIDC 또는 별도 브릿지 서버 필요 — 다음 과제)
5. SQL Editor에서 `0001_babies.sql` → `0002_ingredients.sql` → `0003_recipes.sql` → `0004_age_rules.sql` 순서대로 실행

### Web Push 설정 (STEP 10)
1. `npx web-push generate-vapid-keys` 실행 → `.env.local`에 `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` 입력
2. Supabase 프로젝트 설정 → API → `service_role` 키를 `.env.local`의 `SUPABASE_SERVICE_ROLE_KEY`에 입력 (절대 클라이언트에 노출 금지)
3. `CRON_SECRET`에 임의의 랜덤 문자열 입력 (크론 엔드포인트 보호용)
4. Vercel에 배포하면 `vercel.json`의 크론 설정에 따라 매일 UTC 07:00(KST 16:00)에 `/api/cron/send-dinner-push`가 자동 호출됨. 다른 호스팅을 쓴다면 동일 URL을 16:00 KST에 호출하는 외부 스케줄러(GitHub Actions cron 등)를 붙이면 됨
5. SQL Editor에서 `0001` ~ `0006_history.sql`까지 순서대로 실행

## 지금까지 만든 것 (STEP 1~11)
- `tailwind.config.ts` : 목업(HTML)에서 쓴 색상/폰트 토큰을 그대로 이식
- `src/lib/babyAge.ts` : 생년월일 → 정확한 개월 수 계산 (달력 기준, 30일 나눗셈 아님)
- `src/lib/supabase/{client,server,admin}.ts`, `src/middleware.ts` : 세션 클라이언트 + 서비스 롤(관리자) 클라이언트
- `src/app/landing/page.tsx`, `src/app/login/page.tsx`, `src/app/auth/callback/route.ts` : 카카오/구글 로그인
- `supabase/migrations/0001_babies.sql` ~ `0004_age_rules.sql` : 아기/알레르기, 식재료, 레시피, 월령별 안전규칙 테이블 + RLS + 시드 데이터
- `src/app/onboarding/*`, `src/app/ingredients/page.tsx` : 온보딩 및 식재료 관리
- `src/lib/recommend.ts`, `src/lib/safetyRules.ts` : 검증 레이어(월령/알레르기/보유재료/안전규칙) 파이프라인
- `src/lib/ai/pickTodaysMenu.ts` : 검증 통과 후보 중 Claude가 최종 우선순위를 정하는 STEP 9 로직
- `src/lib/service/dailyMenu.ts` : "오늘의 메뉴 계산" 통합 파이프라인 — 홈 화면과 알림 크론이 재사용
- `supabase/migrations/0005_notifications.sql`, `public/sw.js`, `/settings/notifications`, `/api/push/subscribe`, `/api/cron/send-dinner-push`, `vercel.json` : 오후 4시 Web Push 알림
- **`supabase/migrations/0006_history.sql`** : `recommendations`(일자별 추천 기록) / `recommendation_feedback`(좋아요·별로예요·만들어봤어요·다시추천) / `favorites` 테이블 + RLS
- **`src/lib/recommend.ts` 확장** : `scoreRecipes`가 이제 `recentRecipeIds`(최근 3일 내 추천된 메뉴는 감점, 스펙 8장) 와 `preferenceWeights`(좋아요/만들어봤어요는 가점, 별로예요는 감점, 스펙 18장)를 받아 반영
- **`src/lib/service/dailyMenu.ts` 확장** : 매번 호출될 때마다 `recommendations` 테이블에 오늘 추천한 메뉴를 기록(같은 날 재계산 시 upsert로 덮어씀), 최근 추천/피드백 데이터를 조회해 스코어링에 반영
- `src/components/FeedbackBar.tsx` : 레시피 상세 화면의 ❤️/👎/🍳/🔄/⭐ 버튼 — `/api/feedback`, `/api/favorites`에 실제 저장
- `src/app/favorites/page.tsx`, `src/app/history/page.tsx` : 즐겨찾기 목록 / 추천 기록(날짜별) 화면 (스펙 20장 화면 10, 11)
- 홈 화면에 "즐겨찾기"·"추천 기록" 바로가기 추가

## 아직 안 한 것 (다음 STEP)
| STEP | 내용 | 상태 |
|---|---|---|
| 12 | PWA manifest + service worker 확장(오프라인 캐싱, 홈 화면 설치) | `sw.js` 기초만 존재 |

네이버 로그인 정식 지원, 하단 4개 탭 네비게이션 컴포넌트(현재는 화면 간 링크로만 연결)는 잔여 과제로 남아 있습니다.

## 폴더 구조
```
src/
  app/
    layout.tsx        # 전역 레이아웃, 폰트 로드
    page.tsx           # "/" → "/home" 리다이렉트 (임시)
    home/page.tsx       # 홈 화면 (오늘의 추천 / 초간편 추천)
    globals.css
  components/
    RecommendCard.tsx   # 추천 카드 (재료 매칭 링 포함)
  lib/
    babyAge.ts          # 월령 계산
    recommend.ts        # 추천 스코어링
    safetyRules.ts       # 월령별 안전 규칙
```

## 데이터베이스 설계 (스펙 19장) — 다음 단계에서 Supabase에 옮길 테이블
`users, babies, baby_allergies, baby_preferences, ingredients, user_ingredients, recipes,
recipe_ingredients, nutrition_data, age_rules, recommendations, recommendation_feedback,
favorites, notification_settings`
