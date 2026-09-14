import Link from "next/link";
import { Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getAiAssistLabel, type AiAssistId } from "@/lib/access/ai-assist-progress";

type AiAssistLockedProps = {
  assistId: AiAssistId;
  previousAssistId: AiAssistId | null;
  storageError?: string;
};

export default function AiAssistLocked({ assistId, previousAssistId, storageError }: AiAssistLockedProps) {
  const previousLabel = previousAssistId ? getAiAssistLabel(previousAssistId) : "the previous assist";

  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-28 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto max-w-xl rounded-lg border border-border bg-card p-6 text-center text-card-foreground shadow-pop-lg sm:p-8">
        <div className="mx-auto flex size-12 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
          <Lock className="size-6" />
        </div>
        <p className="mt-5 font-game text-2xl leading-none text-primary">{getAiAssistLabel(assistId)} is locked</p>
        <h1 className="mt-3 font-game text-4xl leading-none text-card-foreground sm:text-5xl">
          Finish {previousLabel} first
        </h1>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          {storageError ??
            `AI Assist rounds unlock in order. Complete ${previousLabel} and click "Finish assessment" to open this one.`}
        </p>
        <Button className="mt-7" variant="outline" nativeButton={false} render={<Link href="/AI-assist" />}>
          Back to AI Assist
        </Button>
      </section>
    </main>
  );
}
