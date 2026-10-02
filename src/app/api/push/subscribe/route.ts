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
  const { subscription, enabled, notifyTime, isTwa } = body as {
    subscription?: { endpoint: string; keys: { p256dh: string; auth: string } };
    enabled: boolean;
    notifyTime: string; // "HH:MM"
    isTwa?: boolean;
  };

  // 일반 웹 브라우저에서의 구독 등록 시도 차단
  if (subscription && isTwa === false) {
    return NextResponse.json(
      { error: "알림은 설치된 앱(TWA)에서만 등록할 수 있어요." },
      { status: 403 }
    );
  }

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

export async function DELETE(request: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  let endpointToDelete: string | null = null;
  try {
    const body = await request.json().catch(() => ({}));
    endpointToDelete = body.endpoint || null;
  } catch {
    // ignore
  }

  // 사용자의 현재 등록된 endpoint가 삭제 요청된 것과 일치하거나(또는 지정 없을 시) 제거
  if (endpointToDelete) {
    await supabase
      .from("notification_settings")
      .update({
        push_endpoint: null,
        push_p256dh: null,
        push_auth: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("push_endpoint", endpointToDelete);
  } else {
    await supabase
      .from("notification_settings")
      .update({
        push_endpoint: null,
        push_p256dh: null,
        push_auth: null,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
  }

  return NextResponse.json({ ok: true });
}
