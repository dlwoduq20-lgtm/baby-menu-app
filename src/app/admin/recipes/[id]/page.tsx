import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { RecipeEditForm } from "@/components/admin/RecipeEditForm";

export default async function AdminRecipeEditPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: recipe } = await supabase.from("recipes").select("*").eq("id", params.id).single();
  if (!recipe) notFound();

  return (
    <div>
      <h2 className="mb-4 font-display text-lg">{recipe.name}</h2>
      <RecipeEditForm recipe={recipe} />
    </div>
  );
}
