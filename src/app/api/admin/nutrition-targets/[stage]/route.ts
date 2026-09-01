import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

export async function PATCH(request: Request, { params }: { params: { stage: string } }) {
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
    .from("nutrition_targets")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("stage", params.stage);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
