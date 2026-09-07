"use client";

import { useState } from "react";
import Link from "next/link";

export type CalendarDayItem = {
  id: string;
  name: string;
  cook_minutes: number;
  difficulty: number;
  min_age_stage: string;
};

export type CalendarDay = {
  dayOffset: number;
  date: string;
  dow: string;
  main?: CalendarDayItem;
  quick?: CalendarDayItem;
};

function MenuRow({ item, badgeLabel, badgeClass }: { item: CalendarDayItem; badgeLabel: string; badgeClass: string }) {
  return (
    <Link
      href={`/recipe/${item.id}`}
      className="flex items-center justify-between rounded-2xl border border-line bg-white p-4"
    >
      <div>
        <span className={`mb-1.5 inline-block rounded-pill px-2.5 py-1 text-[10.5px] font-bold ${badgeClass}`}>
          {badgeLabel}
        </span>
        <div className="font-display text-[15px]">{item.name}</div>
        <div className="mt-1 text-[11.5px] text-ink-soft">
          ⏱ {item.cook_minutes}분 · 난이도 {"●".repeat(item.difficulty)}
          {"○".repeat(3 - item.difficulty)}
        </div>
      </div>
      <span className="text-ink-soft">→</span>
    </Link>
  );
}

export function WeeklyCalendarView({ days, todayISO }: { days: CalendarDay[]; todayISO: string }) {
  const defaultIndex = Math.max(
    0,
    days.findIndex((d) => d.date === todayISO)
  );
  const [selected, setSelected] = useState(defaultIndex === -1 ? 0 : defaultIndex);
  const day = days[selected];

  return (
    <div>
      {/* 날짜 스트립 */}
      <div className="mb-4 grid grid-cols-7 gap-1.5">
        {days.map((d, i) => {
          const dateNum = new Date(d.date).getDate();
          const isToday = d.date === todayISO;
          const active = i === selected;
          return (
            <button
              key={d.dayOffset}
              onClick={() => setSelected(i)}
              className={`flex flex-col items-center gap-1 rounded-2xl border py-2.5 text-[11px] ${
                active
                  ? "border-coral bg-coral-deep text-white"
                  : isToday
                  ? "border-coral-pale bg-coral-pale text-coral-deep"
                  : "border-line bg-white text-ink-soft"
              }`}
            >
              <span>{d.dow}</span>
              <span className="font-display text-[13px]">{dateNum}</span>
              {(d.main || d.quick) && (
                <span className={`h-1 w-1 rounded-full ${active ? "bg-white" : "bg-coral"}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* 선택된 날의 메뉴 */}
      <div className="flex flex-col gap-2.5">
        {day?.main && <MenuRow item={day.main} badgeLabel="오늘의 추천" badgeClass="bg-coral-pale text-coral-deep" />}
        {day?.quick && <MenuRow item={day.quick} badgeLabel="초간편" badgeClass="bg-mint-pale text-[#2E8F5D]" />}
        {!day?.main && !day?.quick && (
          <div className="rounded-2xl border border-line bg-white p-4 text-center text-[13px] text-ink-soft">
            이 날짜엔 준비된 메뉴가 없어요.
          </div>
        )}
      </div>
    </div>
  );
}
