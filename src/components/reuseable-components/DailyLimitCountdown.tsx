"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

type DailyLimitCountdownProps = {
  resetAt: number;
};

function getRemainingParts(resetAt: number, now: number) {
  const totalSeconds = Math.max(0, Math.floor((resetAt - now) / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
}

function formatPart(value: number) {
  return String(value).padStart(2, "0");
}

export default function DailyLimitCountdown({ resetAt }: DailyLimitCountdownProps) {
  const router = useRouter();
  const [now, setNow] = useState(() => Date.now());
  const remaining = useMemo(() => getRemainingParts(resetAt, now), [now, resetAt]);
  const isExpired = now >= resetAt;
  const hasRefreshedRef = useRef(false);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isExpired && !hasRefreshedRef.current) {
      hasRefreshedRef.current = true;
      router.refresh();
    }
  }, [isExpired, router]);

  return (
    <div className="mt-6 rounded-lg border border-border bg-background p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Next play opens in</p>
      <p className="mt-3 font-game text-5xl leading-none text-primary sm:text-6xl">
        {formatPart(remaining.hours)}:{formatPart(remaining.minutes)}:{formatPart(remaining.seconds)}
      </p>
      {isExpired ? (
        <Button className="mt-4" onClick={() => router.refresh()}>
          Play Now
        </Button>
      ) : null}
    </div>
  );
}
