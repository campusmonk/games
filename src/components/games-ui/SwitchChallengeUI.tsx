"use client";

import {
  CheckCircle2,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SwitchGameStatus, SwitchPuzzle } from "@/app/capgemini/switch-challenge/logic";

type Props = {
  level: number;
  timer: string;
  puzzle: SwitchPuzzle | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selected: string | null;
  handleSelect: (option: string) => void;
  timeLeft: number;
  timeLimit: number;
  gameStatus: SwitchGameStatus;
  correct: number;
  wrong: number;
  onStart: () => void;
  resetGame: () => void;
};

function StatPill({
  label,
  value,
  className,
}: {
  label: string;
  value: string | number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "min-w-0 rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-[3px_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:px-4",
        className
      )}
    >
      <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate font-game text-2xl leading-none text-card-foreground sm:text-3xl">
        {value}
      </p>
    </div>
  );
}

function Hud({
  level,
  timer,
  correct,
  wrong,
}: Pick<Props, "level" | "timer" | "correct" | "wrong">) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatPill label="Level" value={level} />
      <StatPill label="Session" value={timer} />
      <StatPill label="Correct" value={correct} className="border-[#14532d]" />
      <StatPill label="Wrong" value={wrong} className="border-[#881337]" />
    </div>
  );
}

function GameShell({
  children,
  phaseLabel,
  level,
  timer,
  correct,
  wrong,
}: {
  children: React.ReactNode;
  phaseLabel: string;
  level: number;
  timer: string;
  correct: number;
  wrong: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div className="flex flex-col gap-3 text-center">
        <p className="font-game text-xl leading-none text-primary sm:text-2xl">
          Capgemini Game
        </p>
        <h1 className="font-game text-4xl leading-none text-foreground drop-shadow-[4px_4px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-5xl lg:text-6xl">
          Switch Challenge
        </h1>
        <p className="font-inter text-sm font-semibold text-muted-foreground">{phaseLabel}</p>
      </div>
      <Hud level={level} timer={timer} correct={correct} wrong={wrong} />
      {children}
    </div>
  );
}

function TimerBar({ timeLeft, timeLimit }: Pick<Props, "timeLeft" | "timeLimit">) {
  const progress = Math.max(0, timeLeft / timeLimit);

  return (
    <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
      <div className="flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-inter text-xs font-black uppercase tracking-wide text-muted-foreground">
          <Timer className="size-4" />
          Puzzle Timer
        </p>
        <p
          className={cn(
            "font-game text-3xl leading-none",
            timeLeft <= 5 ? "text-[#fb7185]" : "text-[#ffc516]"
          )}
        >
          {timeLeft}s
        </p>
      </div>
      <div className="mt-3 h-3 overflow-hidden rounded-full border-2 border-border bg-muted">
        <div
          className={cn(
            "h-full transition-all duration-500",
            progress > 0.5 ? "bg-[#22c55e]" : progress > 0.25 ? "bg-[#ffc516]" : "bg-[#f43f5e]"
          )}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}

function SymbolRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <p className="font-inter text-sm font-black uppercase tracking-[0.22em] text-muted-foreground sm:text-base">
        {label}
      </p>
      <div className="flex h-24 w-full min-w-0 items-center justify-center rounded-[26px] border-2 border-border bg-background px-6 shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground),transparent_90%)] sm:h-28 sm:px-8">
        <span className="font-inter text-2xl font-black leading-none text-foreground sm:text-3xl">
          {value}
        </span>
      </div>
    </div>
  );
}

function PuzzleCard({
  puzzle,
  isAnswered,
  isCorrect,
}: Pick<Props, "puzzle" | "isAnswered" | "isCorrect">) {
  if (!puzzle) return null;

  return (
    <div
      className={cn(
        "rounded-lg border-4 border-border bg-card p-5 text-card-foreground shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] transition sm:p-7",
        isAnswered && isCorrect && "border-[#14532d]",
        isAnswered && isCorrect === false && "border-[#881337] animate-[grid-shake_0.38s_ease-in-out]"
      )}
    >
      <div className="grid gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <SymbolRow label="Input" value={puzzle.input.join(" ")} />
          <SymbolRow label="Output" value={puzzle.output.join(" ")} />
        </div>
        {puzzle.layers === 2 && (
          <div className="mx-auto flex w-full max-w-sm flex-col items-center gap-2 rounded-[22px] border-2 border-border bg-background px-5 py-4">
            <p className="font-inter text-[10px] font-black uppercase tracking-[0.22em] text-muted-foreground">
              Known Operator
            </p>
            <p className="font-inter text-3xl font-black leading-none text-[#ffc516]">
              {puzzle.operators[0]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function OptionsGrid({
  puzzle,
  selected,
  isAnswered,
  isCorrect,
  handleSelect,
}: Pick<Props, "puzzle" | "selected" | "isAnswered" | "isCorrect" | "handleSelect">) {
  if (!puzzle) return null;

  return (
    <div className="rounded-lg border-4 border-border bg-card p-5 text-card-foreground shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:p-7">
      <p className="mb-6 text-center font-inter text-2xl font-black leading-tight text-muted-foreground sm:text-3xl">
        Which operator produces this output?
      </p>
      <div className="grid grid-cols-2 gap-4">
        {puzzle.options.map((option) => {
          const isSelected = selected === option;

          return (
            <button
              key={option}
              type="button"
              disabled={isAnswered}
              onClick={() => handleSelect(option)}
              className={cn(
                "flex min-h-24 items-center justify-center rounded-[26px] border-2 px-4 text-center shadow-[inset_0_0_0_1px_rgba(0,0,0,0.22)] transition sm:min-h-28",
                !isAnswered && "border-border bg-background text-foreground hover:-translate-y-0.5 hover:border-ring hover:bg-muted",
                isAnswered && "border-border bg-muted text-muted-foreground/40",
                isSelected && isCorrect && "border-[#14532d] bg-[#22c55e] text-black",
                isSelected && isCorrect === false && "border-[#881337] bg-[#fb7185] text-black"
              )}
            >
              <span className="font-inter text-2xl font-black leading-none sm:text-3xl">
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PreviewBoard() {
  return (
    <section className="mx-auto w-full max-w-xl rounded-lg border-4 border-border bg-card p-3 shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:p-4">
      <div className="flex flex-col gap-5 rounded-md border-2 border-border bg-background p-4 sm:gap-6 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <SymbolRow label="Input" value="C H E F" />
          <SymbolRow label="Output" value="F E C H" />
        </div>
        <p className="text-center font-inter text-base font-black leading-tight text-muted-foreground sm:text-lg">
          Which operator produces this output?
        </p>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {["4312", "2134", "1243", "4123"].map((option) => (
            <div
              key={option}
              className="flex h-16 items-center justify-center rounded-[20px] border-2 border-border bg-card font-inter text-2xl font-black text-card-foreground sm:h-20 sm:rounded-[24px]"
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function SwitchChallengeUI({
  level,
  timer,
  puzzle,
  isAnswered,
  isCorrect,
  selected,
  handleSelect,
  timeLeft,
  timeLimit,
  gameStatus,
  correct,
  wrong,
  onStart,
  resetGame,
}: Props) {
  if (gameStatus === "start") {
    return (
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="font-game text-xl leading-none text-primary sm:text-2xl">
            Positions + Pattern
          </p>
          <h1 className="mt-3 font-game text-5xl leading-[0.9] text-foreground drop-shadow-[5px_5px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-6xl lg:text-7xl">
            Switch Challenge
          </h1>
          <p className="mt-5 max-w-xl font-inter text-base font-semibold leading-7 text-muted-foreground">
            Match the input to the output by choosing the numbered operator order before each puzzle timer runs out.
          </p>
          <div className="mt-7 grid w-full max-w-xl grid-cols-3 gap-3">
            {["Read", "Map", "Choose"].map((label, index) => (
              <div
                key={label}
                className="rounded-md border-2 border-border bg-card p-3 text-center text-card-foreground shadow-[3px_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]"
              >
                <p className="font-game text-3xl leading-none text-primary">{index + 1}</p>
                <p className="mt-1 font-inter text-xs font-black uppercase tracking-wide text-card-foreground">
                  {label}
                </p>
              </div>
            ))}
          </div>
          <Button
            variant="pixel"
            size="lg"
            onClick={onStart}
            className="mt-8 h-14 rounded-lg border-4 px-9 font-game text-3xl shadow-[5px_5px_0_0_#8a6200]"
          >
            <Sparkles className="size-5" />
            Start Game
          </Button>
        </section>

        <PreviewBoard />
      </div>
    );
  }

  if (gameStatus === "results") {
    return (
      <GameShell
        phaseLabel="Session complete"
        level={level}
        timer={timer}
        correct={correct}
        wrong={wrong}
      >
        <section className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border-4 border-border bg-card p-5 text-center text-card-foreground shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Trophy className="mx-auto size-10 fill-[#ffc516] text-[#ffc516]" />
            <h2 className="mt-3 font-game text-4xl leading-none text-card-foreground drop-shadow-[3px_3px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)]">
              Results
            </h2>
          </div>
          <StatPill label="Correct" value={correct} className="border-[#14532d]" />
          <StatPill label="Wrong" value={wrong} className="border-[#881337]" />
          <Button
            variant="pixel"
            size="lg"
            onClick={resetGame}
            className="h-12 rounded-lg border-4 font-game text-2xl sm:col-span-2"
          >
            <RotateCcw className="size-5" />
            Play Again
          </Button>
        </section>
      </GameShell>
    );
  }

  if (!puzzle) {
    return (
      <GameShell
        phaseLabel="Loading puzzle"
        level={level}
        timer={timer}
        correct={correct}
        wrong={wrong}
      >
        <PreviewBoard />
      </GameShell>
    );
  }

  return (
    <GameShell
      phaseLabel={
        isAnswered
          ? isCorrect
            ? "Correct answer"
            : "Wrong answer"
          : "Which operator produces this output?"
      }
      level={level}
      timer={timer}
      correct={correct}
      wrong={wrong}
    >
      <section className="mx-auto grid w-full max-w-4xl gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
            <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
              Challenge
            </p>
            <div className="mt-2 flex items-center gap-3 font-game text-2xl leading-none text-[#ffc516] sm:text-3xl">
              <Zap className="size-5 fill-[#ffc516]" />
              {puzzle.layers === 2 ? "Two Layer Switch" : "Single Switch"}
            </div>
          </div>
          <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />
        </div>

        {isAnswered && (
          <div
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border-4 bg-card p-3 font-inter text-sm font-black shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]",
              isCorrect
                ? "border-[#14532d] text-[#22c55e]"
                : "border-[#881337] text-[#fb7185]"
            )}
          >
            {isCorrect ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {isCorrect ? "Correct, next puzzle loading" : "Wrong, next puzzle loading"}
          </div>
        )}

        <PuzzleCard puzzle={puzzle} isAnswered={isAnswered} isCorrect={isCorrect} />
        <OptionsGrid
          puzzle={puzzle}
          selected={selected}
          isAnswered={isAnswered}
          isCorrect={isCorrect}
          handleSelect={handleSelect}
        />
      </section>
    </GameShell>
  );
}
