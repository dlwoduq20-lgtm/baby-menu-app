import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const { recipeId, type } = (await request.json()) as {
    recipeId: string;
    type: "like" | "dislike" | "cooked" | "reroll";
  };

  const { error } = await supabase
    .from("recommendation_feedback")
    .insert({ user_id: user.id, recipe_id: recipeId, feedback_type: type });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
