import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });

  const { recipeId } = (await request.json()) as { recipeId: string };

  const { data: existing } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_id", recipeId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase.from("favorites").delete().eq("id", existing.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ favorited: false });
  }

  const { error } = await supabase.from("favorites").insert({ user_id: user.id, recipe_id: recipeId });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ favorited: true });
}
