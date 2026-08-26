import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AgeRuleEditForm } from "@/components/admin/AgeRuleEditForm";

export default async function AdminAgeRuleEditPage({ params }: { params: { stage: string } }) {
  const supabase = createClient();
  const { data: rule } = await supabase.from("age_rules").select("*").eq("stage", params.stage).single();
  if (!rule) notFound();

  return (
    <div>
      <h2 className="mb-4 font-display text-lg">{rule.stage}개월 안전 규칙</h2>
      <AgeRuleEditForm rule={rule} />
    </div>
  );
}
