import Link from "next/link";
import { Ban } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { DailyLimitStatus } from "@/lib/access/daily-limits";
import DailyLimitCountdown from "./DailyLimitCountdown";

type DailyLimitReachedProps = {
  status: DailyLimitStatus;
};

export default function DailyLimitReached({ status }: DailyLimitReachedProps) {
  const labelByKind = {
    game: "plays for this game",
    communication: "attempts for this communication round",
    debug: "attempts for this debug assessment",
  } satisfies Record<DailyLimitStatus["kind"], string>;
  const label = labelByKind[status.kind];
  const hasStorageError = Boolean(status.storageError);

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto max-w-xl rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_88%)] sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-destructive/30 bg-destructive/10 text-destructive">
          <Ban className="size-6" />
        </div>
        <p className="mt-5 font-game text-2xl leading-none text-primary">
          {hasStorageError ? "Daily Limit Setup Needed" : "Daily Limit Reached"}
        </p>
        <h1 className="mt-3 font-game text-4xl leading-none text-card-foreground sm:text-5xl">
          {hasStorageError ? "Update Supabase schema" : "Continue after the timer"}
        </h1>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          {hasStorageError
            ? status.storageError
            : `${status.email} has used ${status.used} of ${status.limit} daily ${label}. You can continue once the timer below reaches zero.`}
        </p>
        {hasStorageError ? null : <DailyLimitCountdown resetAt={status.resetAt} />}
        <Button className="mt-7" variant="outline" nativeButton={false} render={<Link href="/moreGames" />}>
          Back to games
        </Button>
      </section>
    </main>
  );
}
