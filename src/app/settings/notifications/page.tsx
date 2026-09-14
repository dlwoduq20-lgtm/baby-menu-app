"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export default function NotificationSettingsPage() {
  const supabase = createClient();
  const [enabled, setEnabled] = useState(false);
  const [notifyTime, setNotifyTime] = useState("16:00");
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [permState, setPermState] = useState<string>("checking");

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermState(Notification.permission);
    }
  }, []);

  useEffect(() => {
    async function loadExisting() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("notification_settings")
        .select("enabled, notify_time")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setEnabled(data.enabled);
        setNotifyTime(data.notify_time.slice(0, 5));
      }
    }
    loadExisting();
  }, [supabase]);

  async function registerSubscription() {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      throw new Error("이 기기 브라우저는 푸시 알림을 지원하지 않아요.");
    }

    const permission = await Notification.requestPermission();
    setPermState(permission);
    if (permission !== "granted") {
      throw new Error("스마트폰 알림 권한이 허용되지 않았어요. 기기 설정에서 알림을 허용해 주세요.");
    }

    const registration = await navigator.serviceWorker.ready;

    // 만료된 구 토큰이 남아있을 수 있으므로 기존 구독 해제 후 새로 발급
    const existing = await registration.pushManager.getSubscription();
    if (existing) {
      try {
        await existing.unsubscribe();
      } catch (unsubErr) {
        console.warn("기존 구독 해제 실패(무시가능):", unsubErr);
      }
    }

    const vapidKey =
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
      "BLehk59Ldm5rR6UTzNDFOwgG842VuMWtvrjVKzLYFZinlrV0xQ4uK3MS6nBLJyJ-5LdzG9I1ah0ho1buPmBLGME";

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey),
    });

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription, enabled: true, notifyTime }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || "알림 정보 저장 중 문제가 발생했어요.");
    }

    setEnabled(true);
    return subscription;
  }

  async function handleEnable() {
    setStatus("loading");
    setMessage("기기 알림 등록 중...");
    try {
      await registerSubscription();
      setStatus("saved");
      setMessage("오후 4시 알림이 켜졌어요! 아래 '지금 받기'를 눌러 테스트해 보세요.");
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "알림 등록에 실패했어요.");
    }
  }

  async function handleDisable() {
    setStatus("loading");
    setMessage(null);

    try {
      if ("serviceWorker" in navigator) {
        const registration = await navigator.serviceWorker.ready;
        const existing = await registration.pushManager.getSubscription();
        if (existing) {
          await existing.unsubscribe();
        }
      }
    } catch (e) {
      console.warn("Unsubscribe failed:", e);
    }

    const res = await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: false, notifyTime }),
    });

    setStatus(res.ok ? "saved" : "error");
    setEnabled(false);
    setMessage(res.ok ? "알림을 껐어요." : "저장 중 문제가 발생했어요.");
  }

  async function handleTimeChange(newTime: string) {
    setNotifyTime(newTime);
    if (!enabled) return; // 알림이 꺼져있으면 시간만 로컬에 반영, 켤 때 같이 저장됨
    await fetch("/api/push/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled: true, notifyTime: newTime }),
    });
  }

  async function handleTestPush() {
    setStatus("loading");
    setMessage("테스트 알림 발송 중...");

    if (typeof window !== "undefined" && "Notification" in window) {
      if (Notification.permission === "denied") {
        setStatus("error");
        setPermState("denied");
        setMessage("스마트폰 설정에서 알림 권한이 차단되어 있어 알림창에 뜨지 않아요. 휴대폰 설정 > 애플리케이션 > '오늘 뭐 먹이지' > 알림 허용을 켜주세요.");
        return;
      }
    }

    try {
      let res = await fetch("/api/push/test", { method: "POST" });
      let data = await res.json();

      // 기존 토큰 만료 또는 기기 정보 미등록 시 자동 갱신 및 1회 재시도
      if (!res.ok && (data.needsReenable || res.status === 410 || res.status === 400)) {
        setMessage("기기 알림 토큰 갱신 중... 잠시만 기다려주세요.");
        try {
          await registerSubscription();
          res = await fetch("/api/push/test", { method: "POST" });
          data = await res.json();
        } catch (regErr: any) {
          setStatus("error");
          setMessage(`알림 토큰 갱신 실패: ${regErr.message}`);
          return;
        }
      }

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "테스트 알림 발송 중 문제가 발생했어요.");
      } else {
        setStatus("saved");
        setMessage("🎉 테스트 알림을 발송했어요! 스마트폰 상단 바를 내려 확인해 보세요.");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage("네트워크 오류가 발생했어요: " + (err.message || ""));
    }
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream px-6 pb-10 pt-11">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/home" className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-sm shadow-sm">
          ←
        </Link>
        <h1 className="font-display text-lg">알림 설정</h1>
      </div>

      {permState === "denied" && (
        <div className="mb-4 rounded-2xl border border-coral/30 bg-coral/10 p-3.5 text-xs text-coral-deep leading-relaxed">
          <div className="font-bold text-[13px] mb-1">⚠️ 기기 알림이 차단되어 있습니다</div>
          스마트폰 <strong>[설정] &gt; [애플리케이션] &gt; [오늘 뭐 먹이지] &gt; [알림]</strong>에서 알림 허용을 켜주셔야 상단 바에 알림이 표시됩니다.
        </div>
      )}

      {permState === "granted" && (
        <div className="mb-4 rounded-2xl border border-[#2E8F5D]/20 bg-[#2E8F5D]/5 px-4 py-2.5 text-xs text-[#2E8F5D] flex items-center justify-between">
          <span>스마트폰 알림 권한</span>
          <span className="font-bold">허용됨 ✅</span>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between rounded-2xl border border-line bg-white p-4">
        <div>
          <div className="font-display text-[15px]">오후 저녁 메뉴 알림</div>
          <div className="mt-0.5 text-xs text-ink-soft">매일 설정한 시간에 오늘의 메뉴를 알려드려요.</div>
        </div>
        <button
          onClick={enabled ? handleDisable : handleEnable}
          disabled={status === "loading"}
          className={`rounded-pill px-4 py-2 text-[13px] font-bold ${
            enabled ? "bg-mint-pale text-[#2E8F5D]" : "bg-ink text-white"
          }`}
        >
          {enabled ? "켜짐" : "꺼짐 · 켜기"}
        </button>
      </div>

      <div className="mb-2 text-[13px] font-bold text-ink-soft">알림 시간</div>
      <input
        type="time"
        value={notifyTime}
        onChange={(e) => handleTimeChange(e.target.value)}
        className="mb-4 w-full rounded-2xl border border-line bg-white px-3.5 py-3 text-[14.5px]"
      />

      <div className="mb-4 rounded-2xl border border-line bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-display text-[15px]">테스트 알림 즉시 발송</div>
            <div className="mt-0.5 text-xs text-ink-soft">스마트폰으로 알림이 오는지 지금 테스트해요.</div>
          </div>
          <button
            onClick={handleTestPush}
            disabled={status === "loading" || !enabled}
            className={`rounded-pill px-4 py-2 text-[13px] font-bold ${
              enabled ? "bg-coral text-white" : "bg-line text-ink-soft cursor-not-allowed"
            }`}
          >
            지금 받기
          </button>
        </div>
      </div>

      {message && (
        <div className={`rounded-xl p-3 text-[12.5px] font-medium leading-relaxed ${status === "error" ? "bg-coral/10 text-coral-deep" : "bg-mint/10 text-[#2E8F5D]"}`}>
          {message}
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-white/70 p-4 text-xs text-ink-soft space-y-1.5 leading-relaxed">
        <div className="font-bold text-ink">💡 알림 수신 안내</div>
        <div>• <strong>매일 오후 4:00 (16:00)</strong>에 오늘의 이유식 저녁 메뉴가 스마트폰으로 도착합니다.</div>
        <div>• <strong>[지금 받기]</strong>를 누르면 1~2초 내에 즉시 테스트 알림이 상단 바에 도착합니다.</div>
        <div>• 스마트폰의 <strong>방해금지 모드</strong>나 <strong>절전 모드</strong>가 켜져 있으면 화면이 꺼진 동안 알림이 지연될 수 있습니다.</div>
      </div>
    </div>
  );
}
