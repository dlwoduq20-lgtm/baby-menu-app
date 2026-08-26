import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const body = await request.json();
  const { subscription, enabled, notifyTime } = body as {
    subscription?: { endpoint: string; keys: { p256dh: string; auth: string } };
    enabled: boolean;
    notifyTime: string; // "HH:MM"
  };

  const row: Record<string, unknown> = {
    user_id: user.id,
    enabled,
    notify_time: `${notifyTime}:00`,
    updated_at: new Date().toISOString(),
  };

  if (subscription) {
    row.push_endpoint = subscription.endpoint;
    row.push_p256dh = subscription.keys.p256dh;
    row.push_auth = subscription.keys.auth;
  }

  const { error } = await supabase.from("notification_settings").upsert(row, { onConflict: "user_id" });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
