"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Ingredient } from "@/lib/types/ingredient";
import { IngredientPicker } from "@/components/IngredientPicker";

export default function IngredientsManagementPage() {
  const supabase = createClient();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const [{ data: allIngredients }, { data: owned }] = await Promise.all([
        supabase.from("ingredients").select("*").order("name"),
        supabase.from("user_ingredients").select("ingredient_id").eq("user_id", user.id).eq("is_owned", true),
      ]);

      setIngredients((allIngredients ?? []) as Ingredient[]);
      setSelectedIds(new Set((owned ?? []).map((r) => r.ingredient_id)));
      setLoading(false);
    }
    load();
  }, [supabase]);

  async function toggle(ing: Ingredient) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const isOwned = selectedIds.has(ing.id);
    setSavingId(ing.id);

    // 낙관적 업데이트: 화면부터 바꾸고 실패하면 되돌린다.
    setSelectedIds((prev) => {
      const next = new Set(prev);
      isOwned ? next.delete(ing.id) : next.add(ing.id);
      return next;
    });

    const { error } = isOwned
      ? await supabase.from("user_ingredients").delete().eq("user_id", user.id).eq("ingredient_id", ing.id)
      : await supabase
          .from("user_ingredients")
          .upsert(
            { user_id: user.id, ingredient_id: ing.id, is_owned: true },
            { onConflict: "user_id,ingredient_id" }
          );

    if (error) {
      // 실패 시 원상복구
      setSelectedIds((prev) => {
        const next = new Set(prev);
        isOwned ? next.add(ing.id) : next.delete(ing.id);
        return next;
      });
    }
    setSavingId(null);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-5 flex items-center gap-3">
        <Link
          href="/home"
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm"
        >
          ←
        </Link>
        <h1 className="font-display text-lg">식재료 관리</h1>
        {savingId && <span className="ml-auto text-[11px] text-ink-soft">저장 중...</span>}
      </div>

      {loading ? (
        <div className="py-10 text-center text-[13.5px] text-ink-soft">불러오는 중...</div>
      ) : (
        <IngredientPicker ingredients={ingredients} selectedIds={selectedIds} onToggle={toggle} />
      )}
    </div>
  );
}
