"use client";

import { useMemo, useState } from "react";
import { Ingredient, INGREDIENT_CATEGORIES } from "@/lib/types/ingredient";

export function IngredientPicker({
  ingredients,
  selectedIds,
  onToggle,
}: {
  ingredients: Ingredient[];
  selectedIds: Set<string>;
  onToggle: (ingredient: Ingredient) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("전체");

  const filtered = useMemo(() => {
    return ingredients.filter((i) => {
      const matchesCategory = category === "전체" || i.category === category;
      const matchesQuery = i.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [ingredients, query, category]);

  return (
    <div>
      <div className="mb-3.5 flex items-center gap-2 rounded-pill border border-line bg-white px-4 py-2.5 text-[13.5px] text-ink-soft">
        🔍
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="재료 검색하기"
          className="w-full bg-transparent outline-none"
        />
      </div>

      <div className="mb-3 flex gap-2 overflow-x-auto pb-2">
        {["전체", ...INGREDIENT_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 whitespace-nowrap rounded-pill border px-3.5 py-2 text-[12.5px] ${
              category === c ? "border-ink bg-ink text-white" : "border-line bg-white text-ink-soft"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2.5">
        {filtered.map((ing) => {
          const on = selectedIds.has(ing.id);
          return (
            <button
              key={ing.id}
              onClick={() => onToggle(ing)}
              className={`flex items-center gap-2.5 rounded-2xl border px-3 py-2.5 text-left text-[13.5px] ${
                on ? "border-mint bg-mint-pale" : "border-line bg-white"
              }`}
            >
              <span
                className={`flex h-[19px] w-[19px] shrink-0 items-center justify-center rounded-md border-2 text-xs text-white ${
                  on ? "border-mint bg-mint" : "border-line"
                }`}
              >
                {on ? "✓" : ""}
              </span>
              {ing.name}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-2 py-6 text-center text-[13px] text-ink-soft">검색 결과가 없어요.</div>
        )}
      </div>

      <div className="sticky bottom-0 bg-cream pb-1 text-center text-[12.5px] text-ink-soft">
        <b className="text-coral-deep">{selectedIds.size}개</b> 선택됨 · 언제든 재료 관리에서 수정 가능
      </div>
    </div>
  );
}
