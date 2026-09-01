import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NutritionTargetEditForm } from "@/components/admin/NutritionTargetEditForm";

export default async function AdminNutritionTargetEditPage({ params }: { params: { stage: string } }) {
  const supabase = createClient();
  const { data: target } = await supabase.from("nutrition_targets").select("*").eq("stage", params.stage).single();
  if (!target) notFound();

  return (
    <div>
      <h2 className="mb-4 font-display text-lg">{target.stage}개월 영양 목표치</h2>
      <NutritionTargetEditForm target={target} />
    </div>
  );
}
