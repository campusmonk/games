import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, Lock } from "lucide-react";

import Welcome from "@/components/reuseable-components/Welcome";
import { requireUserAccess } from "@/lib/access/allowlist";
import {
  getAiAssistLabel,
  getAiAssistProgress,
  getPreviousAiAssist,
  isAiAssistUnlocked,
  type AiAssistId,
} from "@/lib/access/ai-assist-progress";

export const metadata: Metadata = {
  title: "AI Assist Rounds | Campusmonk",
  description:
    "Practice Capgemini-style AI-assisted coding assessments with a guided assistant, unlocked one round at a time.",
};

const aiAssistRounds: Array<{ id: AiAssistId; png: string; p: string }> = [
  {
    id: "assist-1",
    png: "/game-console.png",
    p: "Subarray sums, sliding windows, circular next-greater, platform scheduling, and trapping rain water with a guided AI assistant.",
  },
  {
    id: "assist-2",
    png: "/window.svg",
    p: "Longest consecutive sequence, 3Sum, daily temperatures, merging intervals, and largest rectangle in a histogram.",
  },
  {
    id: "assist-3",
    png: "/globe.svg",
    p: "Kth largest element, rotated array search, longest valid parentheses, first missing positive, and word ladder.",
  },
];

const cardClassName =
  "flex w-full items-center gap-5 rounded-2xl border border-border bg-card px-6 py-5 text-card-foreground shadow-pop-md";

export default async function AiAssistPage() {
  const session = await requireUserAccess();
  const progress = await getAiAssistProgress(session.email);

  return (
    <main className="mt-2 min-h-screen overflow-hidden bg-background text-foreground md:mt-10">
      <Welcome companyName="AI Assist" mascotSrc="/game-console.png" />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10">
          <h1 className="font-game text-3xl leading-none text-foreground drop-shadow-pop-md sm:text-4xl">
            AI-Assisted Coding
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Rounds unlock in order. Finish AI Assist 1 to open AI Assist 2, then
            finish AI Assist 2 to open AI Assist 3.
          </p>
        </div>

        {progress.storageError ? (
          <div className="mb-6 rounded-md border border-primary/35 bg-primary/10 px-4 py-3 text-sm text-foreground">
            {progress.storageError}
          </div>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          {aiAssistRounds.map((round) => {
            const label = getAiAssistLabel(round.id);
            const isCompleted = progress.completed.includes(round.id);
            const previous = getPreviousAiAssist(round.id);

            const content = (
              <>
                <div className="relative h-14 w-14 shrink-0">
                  <Image src={round.png} alt={label} fill sizes="56px" className="object-contain" />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-game text-2xl leading-none text-card-foreground sm:text-3xl">{label}</h2>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                        <CheckCircle2 className="size-3.5" />
                        Completed
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-md">{round.p}</p>
                </div>
              </>
            );

            if (!isAiAssistUnlocked(round.id, progress.completed)) {
              return (
                <div key={round.id} aria-disabled="true" className={`${cardClassName} cursor-not-allowed opacity-60`}>
                  {content}
                  <span className="ml-auto inline-flex shrink-0 flex-col items-center gap-1 text-center text-xs font-semibold text-muted-foreground">
                    <Lock className="size-5" />
                    {previous ? `Finish ${getAiAssistLabel(previous)}` : "Locked"}
                  </span>
                </div>
              );
            }

            return (
              <Link
                key={round.id}
                href={`/AI-assist/${round.id}`}
                className={`${cardClassName} transition hover:-translate-y-1 hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
