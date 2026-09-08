"use client";

import { useActionState } from "react";
import { Bug, Gamepad2, ListChecks, MessageSquare, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { GlobalDailyLimits } from "@/lib/access/daily-limits";

import {
  updateCommunicationLimitAction,
  updateDebugLimitAction,
  updateGameLimitAction,
  updateQuizLimitAction,
  type AdminActionState,
} from "./actions";

type LimitSettingsFormsProps = {
  limits: GlobalDailyLimits;
};

export default function LimitSettingsForms({ limits }: LimitSettingsFormsProps) {
  const [gameState, gameAction, gamePending] = useActionState<AdminActionState, FormData>(
    updateGameLimitAction,
    {},
  );
  const [communicationState, communicationAction, communicationPending] = useActionState<
    AdminActionState,
    FormData
  >(updateCommunicationLimitAction, {});
  const [debugState, debugAction, debugPending] = useActionState<AdminActionState, FormData>(
    updateDebugLimitAction,
    {},
  );
  const [quizState, quizAction, quizPending] = useActionState<AdminActionState, FormData>(
    updateQuizLimitAction,
    {},
  );

  return (
    <div className="grid gap-3">
      <form action={gameAction} className="grid min-w-0 gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Gamepad2 className="size-4 text-primary" />
          <p className="text-sm font-semibold text-card-foreground">Plays per game per day</p>
        </div>
        <Input
          name="gamesPerDay"
          type="number"
          min={0}
          max={999}
          defaultValue={limits.gamesPerDay ?? ""}
          placeholder="Unlimited"
          aria-label="Daily plays-per-game limit"
          className="border-input bg-background text-foreground"
        />
        {gameState.message ? (
          <p className="break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">{gameState.message}</p>
        ) : null}
        <Button type="submit" disabled={gamePending} className="gap-2">
          <Save className="size-4" />
          {gamePending ? "Saving Games" : "Save Games"}
        </Button>
      </form>

      <form action={communicationAction} className="grid min-w-0 gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="size-4 text-primary" />
          <p className="text-sm font-semibold text-card-foreground">Attempts per communication round per day</p>
        </div>
        <Input
          name="communicationPerDay"
          type="number"
          min={0}
          max={999}
          defaultValue={limits.communicationPerDay ?? ""}
          placeholder="Unlimited"
          aria-label="Daily attempts-per-communication-round limit"
          className="border-input bg-background text-foreground"
        />
        {communicationState.message ? (
          <p className="break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">
            {communicationState.message}
          </p>
        ) : null}
        <Button type="submit" disabled={communicationPending} className="gap-2">
          <Save className="size-4" />
          {communicationPending ? "Saving Communication" : "Save Communication"}
        </Button>
      </form>

      <form action={debugAction} className="grid min-w-0 gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <Bug className="size-4 text-primary" />
          <p className="text-sm font-semibold text-card-foreground">Attempts per debug assessment per day</p>
        </div>
        <Input
          name="debugPerDay"
          type="number"
          min={0}
          max={999}
          defaultValue={limits.debugPerDay ?? ""}
          placeholder="Unlimited"
          aria-label="Daily attempts-per-debug-assessment limit"
          className="border-input bg-background text-foreground"
        />
        {debugState.message ? (
          <p className="break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">{debugState.message}</p>
        ) : null}
        <Button type="submit" disabled={debugPending} className="gap-2">
          <Save className="size-4" />
          {debugPending ? "Saving Debug" : "Save Debug"}
        </Button>
      </form>

      <form action={quizAction} className="grid min-w-0 gap-3 rounded-lg border border-border bg-card p-4">
        <div className="flex items-center gap-2">
          <ListChecks className="size-4 text-primary" />
          <p className="text-sm font-semibold text-card-foreground">Attempts per quiz per day</p>
        </div>
        <Input
          name="quizPerDay"
          type="number"
          min={0}
          max={999}
          defaultValue={limits.quizPerDay ?? ""}
          placeholder="Unlimited"
          aria-label="Daily attempts-per-quiz limit"
          className="border-input bg-background text-foreground"
        />
        {quizState.message ? (
          <p className="break-words text-sm text-muted-foreground [overflow-wrap:anywhere]">{quizState.message}</p>
        ) : null}
        <Button type="submit" disabled={quizPending} className="gap-2">
          <Save className="size-4" />
          {quizPending ? "Saving Quiz" : "Save Quiz"}
        </Button>
      </form>
    </div>
  );
}
