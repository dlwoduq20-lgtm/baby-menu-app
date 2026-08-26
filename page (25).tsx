"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Ingredient } from "@/lib/types/ingredient";
import { IngredientPicker } from "@/components/IngredientPicker";

// STEP 5: 온보딩의 마지막 단계. 선택한 재료를 user_ingredients 테이블에 저장하고 홈으로 이동한다.
function OnboardingIngredientsForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const babyId = searchParams.get("babyId"); // 현재 단계에서는 사용하지 않지만 추후 아기별 초기 추천 트리거에 쓸 수 있어 유지

  const supabase = createClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error: fetchError } = await supabase.from("ingredients").select("*").order("name");
      if (fetchError) {
        setError(`재료 목록을 불러오지 못했어요: ${fetchError.message}`);
      } else {
        setIngredients(data as Ingredient[]);
      }
      setLoading(false);
    }
    load();
  }, [supabase]);

  function toggle(ing: Ingredient) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(ing.id) ? next.delete(ing.id) : next.add(ing.id);
      return next;
    });
  }

  async function handleFinish() {
    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("로그인이 만료됐어요. 다시 로그인해 주세요.");
      setSubmitting(false);
      router.push("/login");
      return;
    }

    if (selectedIds.size > 0) {
      const rows = Array.from(selectedIds).map((ingredient_id) => ({
        user_id: user.id,
        ingredient_id,
        is_owned: true,
      }));
      const { error: insertError } = await supabase.from("user_ingredients").upsert(rows, {
        onConflict: "user_id,ingredient_id",
      });
      if (insertError) {
        setError(`저장 중 문제가 발생했어요: ${insertError.message}`);
        setSubmitting(false);
        return;
      }
    }

    setSubmitting(false);
    router.push("/home");
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-6 flex gap-1.5">
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
      </div>

      <h1 className="mb-1.5 font-display text-xl leading-snug">
        지금 집에
        <br />
        어떤 재료가 있나요?
      </h1>
      <p className="mb-5 text-[13.5px] text-ink-soft">
        가지고 있는 재료만 체크해 주세요. 나중에 언제든 바꿀 수 있어요.
      </p>

      {loading ? (
        <div className="py-10 text-center text-[13.5px] text-ink-soft">재료 목록을 불러오는 중...</div>
      ) : (
        <IngredientPicker ingredients={ingredients} selectedIds={selectedIds} onToggle={toggle} />
      )}

      {error && <div className="mb-3 text-xs text-coral-deep">{error}</div>}

      <button
        onClick={handleFinish}
        disabled={submitting || loading}
        className="mt-2 w-full rounded-pill bg-coral-deep py-3.5 text-[15px] font-bold text-white disabled:opacity-60"
      >
        {submitting ? "저장 중..." : "시작하기"}
      </button>
    </div>
  );
}

export default function OnboardingIngredientsPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingIngredientsForm />
    </Suspense>
  );
}
