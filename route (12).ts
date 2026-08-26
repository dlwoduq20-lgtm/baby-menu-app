import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ error: "관리자만 수정할 수 있어요." }, { status: 403 });
  }

  const body = await request.json();
  const admin = createAdminClient();

  const { error } = await admin
    .from("recipes")
    .update({
      min_age_stage: body.min_age_stage,
      cook_minutes: body.cook_minutes,
      difficulty: body.difficulty,
      is_quick: body.is_quick,
      allergens: body.allergens,
      choking_hazard_note: body.choking_hazard_note || null,
      caution_note: body.caution_note || null,
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
