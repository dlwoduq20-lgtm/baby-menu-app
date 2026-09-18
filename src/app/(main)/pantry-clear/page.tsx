import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchAllRecipesWithDetails } from "@/lib/data/recipes";
import { fetchAgeRules } from "@/lib/data/ageRules";
import { fetchIngredientSafetyRules } from "@/lib/data/ingredientSafety";
import { Ingredient } from "@/lib/types/ingredient";
import { PantryClearClient } from "./PantryClearClient";

function PantryClearSkeleton() {
  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-[22px] pb-12 pt-10">
      <div className="mb-4 h-9 w-40 animate-pulse rounded-pill bg-white shadow-xs" />
      <div className="mb-4 h-24 animate-pulse rounded-2xl bg-white border border-line" />
      <div className="mb-5 h-10 animate-pulse rounded-xl bg-white border border-line" />
      <div className="space-y-3">
        <div className="h-36 animate-pulse rounded-2xl bg-white border border-line" />
        <div className="h-36 animate-pulse rounded-2xl bg-white border border-line" />
      </div>
    </div>
  );
}

async function PantryClearContent() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: babies } = await supabase
    .from("babies")
    .select("id, name, birth_date")
    .eq("user_id", user.id)
    .limit(1);
  const baby = babies?.[0];
  if (!baby) redirect("/onboarding/baby");

  const [
    { data: allergyRows },
    { data: ownedRows },
    { data: allIngredientsRows },
    allRecipes,
    ageRules,
    ingredientSafetyRules,
  ] = await Promise.all([
    supabase.from("baby_allergies").select("allergen").eq("baby_id", baby.id),
    supabase
      .from("user_ingredients")
      .select("ingredient_id")
      .eq("user_id", user.id)
      .eq("is_owned", true),
    supabase.from("ingredients").select("*").order("name"),
    fetchAllRecipesWithDetails(supabase),
    fetchAgeRules(supabase),
    fetchIngredientSafetyRules(supabase),
  ]);

  const allergies = (allergyRows ?? []).map((r) => r.allergen);
  const initialOwnedIds = (ownedRows ?? []).map((r) => r.ingredient_id);
  const allIngredients = (allIngredientsRows ?? []) as Ingredient[];

  return (
    <PantryClearClient
      userId={user.id}
      baby={baby}
      allergies={allergies}
      allIngredients={allIngredients}
      initialOwnedIds={initialOwnedIds}
      allRecipes={allRecipes}
      ageRules={ageRules}
      ingredientSafetyRules={ingredientSafetyRules}
    />
  );
}

export default function PantryClearPage() {
  return (
    <Suspense fallback={<PantryClearSkeleton />}>
      <PantryClearContent />
    </Suspense>
  );
}
