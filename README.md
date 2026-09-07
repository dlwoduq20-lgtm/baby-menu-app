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
6. `npm run build && npm run start` 후 모바일 브라우저에서 접속 → "홈 화면에 추가"로 설치 테스트 가능

## 🎉 STEP 1~12 + 잔여 과제 전부 완료

### 이번에 추가로 완료한 것
- **하단 4탭 네비게이션** : `src/components/BottomNav.tsx` + `src/app/(main)/layout.tsx` 라우트 그룹으로 `/home`, `/ingredients`, `/history`, `/mypage`에 공통 적용 (URL은 그대로 유지됨)
- **`/mypage`(마이) 화면** 신규 추가 : 계정 정보, 아기 프로필 수정/식재료 관리/즐겨찾기/알림 설정 바로가기, 로그아웃 (스펙 20장 화면 12)
- **네이버 로그인** : `/api/auth/naver/login` → 네이버 인가 화면 → `/api/auth/naver/callback`에서 토큰 교환 + 프로필 조회 → Supabase Admin API로 매직링크 발급해 세션 생성하는 OAuth2 브릿지 구현. 카카오/구글과 동일한 `auth.users`/`babies` 흐름에 합류됨
- **관리자 화면** (`/admin`, 스펙 23장) : `ADMIN_EMAILS` 허용목록에 있는 계정만 접근 가능
  - `/admin/recipes` : 레시피 목록 + 월령/난이도/조리시간/초간편여부/알레르기/안전 안내 수정
  - `/admin/age-rules` : 6개 월령 구간별 권장 식품군/식감/조리방법/피해야 할 음식/질식위험 음식 수정
  - 두 화면 모두 세션 클라이언트로 관리자 여부를 먼저 확인한 뒤, `src/lib/supabase/admin.ts`(서비스 롤)로 실제 쓰기를 수행 — 저장 즉시 추천 알고리즘(`applySafetyFilter`, `scoreRecipes`)에 반영됨

### 전체 구조 요약 (STEP 1~12)
- `tailwind.config.ts` : 목업(HTML)에서 쓴 색상/폰트 토큰
- `src/lib/babyAge.ts`, `src/lib/safetyRules.ts`, `src/lib/recommend.ts`, `src/lib/ai/pickTodaysMenu.ts`, `src/lib/service/dailyMenu.ts` : 월령 계산 → 검증 레이어 → AI 최종 선택까지 이어지는 추천 파이프라인
- `src/lib/supabase/{client,server,admin}.ts`, `src/middleware.ts` : 세션/서비스 롤 클라이언트
- `supabase/migrations/0001` ~ `0006` : babies·ingredients·recipes·age_rules·notifications·history 전 테이블 + RLS + 시드 데이터
- `src/app/landing`, `/login`, `/api/auth/naver/*`, `/auth/callback` : 카카오/구글/네이버 로그인
- `src/app/onboarding/*` : 최초 가입 플로우
- `src/app/(main)/{home,ingredients,history,mypage}` + `BottomNav` : 4탭 메인 화면
- `src/app/recipe/[id]`, `/favorites`, `/settings/notifications` : 상세/즐겨찾기/알림 설정
- `src/app/api/push/*`, `/api/cron/send-dinner-push`, `vercel.json` : 오후 4시 알림
- `src/app/admin/*`, `/api/admin/*` : 관리자 화면

## 남은 잔여 과제 (스펙 24장에서 이미 MVP 범위 밖으로 명시한 항목들)
결제, 커뮤니티, 전문가 상담, 냉장고 사진 인식/OCR, 가족 계정 공유, 복잡한 영양 리포트, 쇼핑몰 연동 — 이번 프로젝트에서는 의도적으로 구현하지 않았습니다.

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

---

## 🆕 기능 업데이트 (2026-09-01)

1. **매주 토요일 오전 10시 주간 식단 + 푸시** — `supabase/migrations/0010_weekly_plan.sql`(`weekly_meal_plans`/`weekly_meal_plan_items`), `src/lib/service/weeklyPlan.ts`(7일치 오늘의 추천+초간편을 한 번에 계산, 같은 주는 재사용), `src/app/api/cron/send-weekly-plan/route.ts` + `vercel.json`에 `0 1 * * 6`(=KST 토 10:00) 크론 추가.
2. **영양 커버리지 강조** — `supabase/migrations/0007_ingredient_nutrients.sql`(재료별 `primary_nutrients` 태그), `0008_nutrition_targets.sql`(월령별 하루 권장 섭취 목표, **초안 값이니 반드시 관리자 화면에서 검증 후 사용**), `/weekly`에서 이번 주 전체 커버리지를, `/recipe/[id]`에서 끼니별 커버리지를 %로 표시.
3. **장보기 리스트** — `/shopping-list`, 이번 주 식단에 필요한데 안 가진 재료를 카테고리·수량과 함께 집계.
4. **일별 식단(레시피 상세)에도 영양 강조** — 재료가 채워주는 영양소 칩 + 하루 권장량 대비 % 추가.
5. **폰트 표준화** — `globals.css`에서 Jua/Gowun Dodum(장식 폰트) 제거, `-apple-system` 기반 표준 시스템 폰트 스택으로 전면 교체.
6. 레시피 다양성을 위해 `0009_more_recipes.sql`로 5개 레시피 추가 (총 8종).
7. `/admin/nutrition-targets` 관리자 화면 추가 — 영양 목표치를 언제든 검증된 값으로 교체 가능.

**새 마이그레이션 실행 순서**: 기존 `0001~0006`을 이미 실행했다면, 이어서 `0007_ingredient_nutrients.sql` → `0008_nutrition_targets.sql` → `0009_more_recipes.sql` → `0010_weekly_plan.sql` 순서로 SQL Editor에서 실행하면 됩니다.

⚠️ **`nutrition_targets`의 시드 값은 실제 소아영양 기준으로 검증되지 않은 초안**입니다. 실서비스 배포 전 반드시 `/admin/nutrition-targets`에서 신뢰할 수 있는 출처의 수치로 교체해 주세요.
