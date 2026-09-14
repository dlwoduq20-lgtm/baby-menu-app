import { NextResponse } from "next/server";
import webpush from "web-push";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { computeDailyMenu } from "@/lib/service/dailyMenu";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");

  if (secret !== "diagnose_2026") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const userId = "75d853d1-b88a-4b97-9802-9c4e4bb30cd5"; // dlwoduq20@gmail.com
  const { data: sub, error: subError } = await adminClient
    .from("notification_settings")
    .select("push_endpoint, push_p256dh, push_auth, enabled, notify_time")
    .eq("user_id", userId)
    .single();

  if (!sub || !sub.push_endpoint) {
    return NextResponse.json({ error: "no subscription found", subError }, { status: 400 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const menu = await computeDailyMenu(adminClient, userId);
  const babyName = menu?.baby?.name ?? "아기";
  const mainName = menu?.main?.name ?? "소고기 진밥";

  const payload = JSON.stringify({
    title: "오늘 저녁 뭐 먹일지 정하셨나요? 🍽️",
    body: `${babyName}이에게 오늘의 저녁 메뉴를 준비했어요.\n🥕 ${mainName}`,
    url: "/home",
  });

  try {
    const res = await webpush.sendNotification(
      {
        endpoint: sub.push_endpoint,
        keys: { p256dh: sub.push_p256dh, auth: sub.push_auth },
      },
      payload,
      {
        TTL: 86400,
        urgency: "high",
      }
    );
    return NextResponse.json({
      ok: true,
      statusCode: res.statusCode,
      headers: res.headers,
      body: res.body,
      endpoint: sub.push_endpoint.slice(0, 45) + "...",
      time: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Diagnostic push test error:", err);
    return NextResponse.json(
      {
        ok: false,
        statusCode: err.statusCode,
        message: err.message,
        body: err.body,
        endpoint: sub.push_endpoint.slice(0, 45) + "...",
        vapidPublicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        vapidSubject: process.env.VAPID_SUBJECT,
        hasPrivateKey: Boolean(process.env.VAPID_PRIVATE_KEY),
        privateKeyLength: process.env.VAPID_PRIVATE_KEY?.length,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  const supabaseUser = createClient();
  const {
    data: { user },
  } = await supabaseUser.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "로그인이 필요해요." }, { status: 401 });
  }

  const adminClient = createAdminClient();
  const { data: sub } = await adminClient
    .from("notification_settings")
    .select("push_endpoint, push_p256dh, push_auth")
    .eq("user_id", user.id)
    .single();

  if (!sub || !sub.push_endpoint) {
    return NextResponse.json(
      { error: "등록된 기기 푸시 정보가 없어요. 먼저 '알림 켜기'를 눌러주세요.", needsReenable: true },
      { status: 400 }
    );
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const menu = await computeDailyMenu(adminClient, user.id);
  const babyName = menu?.baby?.name ?? "아기";
  const mainName = menu?.main?.name ?? "소고기 진밥";

  const payload = JSON.stringify({
    title: "오늘 저녁 뭐 먹일지 정하셨나요? 🍽️",
    body: `${babyName}이에게 오늘의 저녁 메뉴를 준비했어요.\n🥕 ${mainName}`,
    url: "/home",
  });

  try {
    await webpush.sendNotification(
      {
        endpoint: sub.push_endpoint,
        keys: { p256dh: sub.push_p256dh, auth: sub.push_auth },
      },
      payload,
      {
        TTL: 86400,
        urgency: "high",
      }
    );
    return NextResponse.json({ ok: true, message: "알림 발송 성공! 스마트폰 상단 바를 확인해 보세요." });
  } catch (err: any) {
    console.error("push test error:", err);
    const statusCode = err?.statusCode;
    const body = err?.body;

    if (statusCode === 410 || statusCode === 404) {
      // 기기 재설치 또는 만료로 무효화된 토큰 정리
      await adminClient
        .from("notification_settings")
        .update({ push_endpoint: null, push_p256dh: null, push_auth: null })
        .eq("user_id", user.id);

      return NextResponse.json(
        {
          error: "기존 알림 토큰이 만료되었습니다. 알림을 다시 켜서 새 기기를 등록해 주세요.",
          statusCode,
          needsReenable: true,
        },
        { status: 410 }
      );
    }

    if (statusCode === 401 || statusCode === 403) {
      return NextResponse.json(
        {
          error: `VAPID 서버 인증 실패 (코드: ${statusCode}). 서버 키 설정을 확인해 주세요.`,
          statusCode,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: `알림 전송 실패 (${statusCode || "unknown"}: ${body || err.message})`,
        statusCode,
        body,
      },
      { status: 500 }
    );
  }
}
