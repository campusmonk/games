"use client";

import {
  CheckCircle2,
  Heart,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  GridDot,
  GridPhase,
  SymmetryChallenge,
} from "@/app/accenture/grid-puzzle/logic";

type Props = {
  phase: GridPhase;
  level: number;
  lives: number;
  score: number;
  dots: GridDot[];
  memoryDotIds: number[];
  blinkDotId: number | null;
  currentDotIndex: number;
  dotsToRemember: number;
  symmetryChallenge: SymmetryChallenge | null;
  symmetryTimeLeft: number;
  symmetryTimeMax: number;
  symmetryAnswered: boolean;
  lastSymmetryCorrect: boolean | null;
  recallClicks: number[];
  recallShake: boolean;
  symCorrect: number;
  symWrong: number;
  streak: number;
  highestLevel: number;
  onStart: () => void;
  onAnswer: (isSymmetric: boolean) => void;
  onDotClick: (dotId: number) => void;
  onReset: () => void;
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

function Hud({ lives, level, score, streak }: Pick<Props, "lives" | "level" | "score" | "streak">) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatPill label="Level" value={level} />
      <StatPill label="Score" value={score} />
      <div className="rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-[3px_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:px-4">
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Lives
        </p>
        <div className="mt-1 flex h-7 items-center gap-1.5">
          {Array.from({ length: 3 }).map((_, index) => (
            <Heart
              key={index}
              className={cn(
                "size-5",
                index < lives ? "fill-[#f43f5e] text-[#f43f5e]" : "text-muted-foreground/35"
              )}
            />
          ))}
        </div>
      </div>
      <div className="rounded-md border-2 border-border bg-card px-3 py-2 text-card-foreground shadow-[3px_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:px-4">
        <p className="font-inter text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
          Streak
        </p>
        <p className="mt-0.5 flex items-center gap-1 font-game text-2xl leading-none text-primary sm:text-3xl">
          <Zap className="size-4 fill-[#ffc516]" />
          {streak}
        </p>
      </div>
    </div>
  );
}

function DotField({
  dots,
  blinkDotId,
  recallClicks,
  phase,
  onDotClick,
  shake,
}: {
  dots: GridDot[];
  blinkDotId: number | null;
  recallClicks: number[];
  phase: GridPhase;
  onDotClick: (id: number) => void;
  shake: boolean;
}) {
  const clickedIds = new Set(recallClicks);
  const isRecall = phase === "recall";

  return (
    <div
      className={cn(
        "relative aspect-[16/9] w-full overflow-hidden rounded-lg border-4 border-border bg-card shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]",
        "bg-[linear-gradient(rgba(244,160,29,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,160,29,0.08)_1px,transparent_1px)] bg-[size:34px_34px]",
        shake && "animate-[grid-shake_0.38s_ease-in-out]"
      )}
    >
      {dots.map((dot) => {
        const isBlinking = dot.id === blinkDotId;
        const recallIndex = recallClicks.indexOf(dot.id);
        const isClicked = clickedIds.has(dot.id);
        const isClickable = isRecall && !isClicked;

        return (
          <button
            key={dot.id}
            type="button"
            disabled={!isClickable}
            onClick={() => isClickable && onDotClick(dot.id)}
            className={cn(
              "absolute flex aspect-square w-[clamp(18px,3.8vw,30px)] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-[10px] font-black transition-all duration-200",
              isBlinking &&
                "animate-pulse border-[#fff3b0] bg-[#ffc516] text-black",
              isClicked && "border-[#86efac] bg-[#22c55e] text-black",
              isClickable && !isClicked && "border-foreground/35 bg-foreground/25 hover:scale-110 hover:bg-primary",
              !isClickable && !isBlinking && !isClicked && "border-border bg-muted"
            )}
            style={{ left: `${dot.x}%`, top: `${dot.y}%` }}
            aria-label={isRecall ? `Dot ${dot.id}` : "Memory dot"}
          >
            {isClicked ? recallIndex + 1 : ""}
          </button>
        );
      })}
    </div>
  );
}

function GridPattern({ grid }: { grid: boolean[][] }) {
  const size = grid.length;

  return (
    <div
      className="grid rounded-md border-2 border-border bg-card p-2 shadow-[3px_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]"
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`, gap: 4 }}
    >
      {grid.map((row, rowIndex) =>
        row.map((filled, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "size-6 rounded-[3px] border border-border sm:size-8",
              filled ? "bg-[#ffc516] shadow-[0_0_10px_rgba(255,197,22,0.35)]" : "bg-muted"
            )}
          />
        ))
      )}
    </div>
  );
}

function GameShell({
  children,
  phaseLabel,
  lives,
  level,
  score,
  streak,
}: {
  children: React.ReactNode;
  phaseLabel: string;
  lives: number;
  level: number;
  score: number;
  streak: number;
}) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <div className="flex flex-col gap-3 text-center">
        <p className="font-game text-xl leading-none text-primary sm:text-2xl">
          Grid Puzzle
        </p>
        <h1 className="font-game text-4xl leading-none text-foreground drop-shadow-[4px_4px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-5xl lg:text-6xl">
          Grid Challange
        </h1>
        <p className="font-inter text-sm font-semibold text-muted-foreground">{phaseLabel}</p>
      </div>
      <Hud lives={lives} level={level} score={score} streak={streak} />
      {children}
    </div>
  );
}

export default function GridChallangeUi({
  phase,
  level,
  lives,
  score,
  dots,
  blinkDotId,
  currentDotIndex,
  dotsToRemember,
  symmetryChallenge,
  symmetryTimeLeft,
  symmetryTimeMax,
  symmetryAnswered,
  lastSymmetryCorrect,
  recallClicks,
  recallShake,
  symCorrect,
  symWrong,
  streak,
  highestLevel,
  onStart,
  onAnswer,
  onDotClick,
  onReset,
}: Props) {
  const symTotal = symCorrect + symWrong;
  const symAccuracy = symTotal ? Math.round((symCorrect / symTotal) * 100) : 0;

  if (phase === "start") {
    return (
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="font-game text-xl leading-none text-primary sm:text-2xl">
            Memory + Symmetry
          </p>
          <h1 className="mt-3 font-game text-5xl leading-[0.9] text-foreground drop-shadow-[5px_5px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-6xl lg:text-7xl">
            Grid Challange
          </h1>
          <p className="mt-5 max-w-xl font-inter text-base font-semibold leading-7 text-muted-foreground">
            Watch the glowing dot, solve the mirror puzzle, then click every remembered
            position in the same order.
          </p>
          <div className="mt-7 grid w-full max-w-xl grid-cols-3 gap-3">
            {["Blink", "Mirror", "Recall"].map((label, index) => (
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

        <section className="rounded-lg border-4 border-border bg-card p-4 shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
          <DotField
            dots={[
              { id: 1, x: 18, y: 30 },
              { id: 2, x: 38, y: 65 },
              { id: 3, x: 58, y: 28 },
              { id: 4, x: 76, y: 55 },
              { id: 5, x: 50, y: 78 },
            ]}
            blinkDotId={3}
            recallClicks={[]}
            phase="blinking"
            onDotClick={() => undefined}
            shake={false}
          />
        </section>
      </div>
    );
  }

  if (phase === "results") {
    return (
      <GameShell
        phaseLabel="Run complete"
        lives={lives}
        level={level}
        score={score}
        streak={streak}
      >
        <section className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border-4 border-border bg-card p-5 text-center text-card-foreground shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Trophy className="mx-auto size-10 fill-[#ffc516] text-[#ffc516]" />
            <h2 className="mt-3 font-game text-4xl leading-none text-card-foreground drop-shadow-[3px_3px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)]">
              Game Over
            </h2>
          </div>
          <StatPill label="Final Score" value={score} />
          <StatPill label="Best Level" value={highestLevel} />
          <StatPill label="Accuracy" value={`${symAccuracy}%`} />
          <div className="sm:col-span-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border-2 border-border bg-card p-3 font-inter text-sm font-bold text-[#22c55e]">
              Correct symmetry: {symCorrect}
            </div>
            <div className="rounded-md border-2 border-border bg-card p-3 font-inter text-sm font-bold text-[#fb7185]">
              Wrong symmetry: {symWrong}
            </div>
          </div>
          <Button
            variant="pixel"
            size="lg"
            onClick={onReset}
            className="h-12 rounded-lg border-4 font-game text-2xl sm:col-span-3"
          >
            <RotateCcw className="size-5" />
            Play Again
          </Button>
        </section>
      </GameShell>
    );
  }

  if (phase === "symmetry" && symmetryChallenge) {
    const progress = Math.max(0, symmetryTimeLeft / symmetryTimeMax);

    return (
      <GameShell
        phaseLabel={`Symmetry Challenge - Dot ${Math.min(currentDotIndex + 1, dotsToRemember)} of ${dotsToRemember}`}
        lives={lives}
        level={level}
        score={score}
        streak={streak}
      >
        <section className="mx-auto w-full max-w-3xl rounded-lg border-4 border-border bg-card p-4 shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:p-5">
          <div className="h-3 overflow-hidden rounded-full border-2 border-border bg-muted">
            <div
              className={cn(
                "h-full transition-all duration-500",
                progress > 0.5 ? "bg-[#22c55e]" : progress > 0.25 ? "bg-[#ffc516]" : "bg-[#f43f5e]"
              )}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="font-inter text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Mirror test
            </p>
            <p className="font-game text-3xl leading-none text-primary">{symmetryTimeLeft}s</p>
          </div>
          <p className="mt-2 text-center font-inter text-sm font-semibold text-muted-foreground">
            {symmetryChallenge.label}
          </p>
          <div className="mt-5 flex items-center justify-center gap-4 sm:gap-8">
            <GridPattern grid={symmetryChallenge.gridA} />
            <span className="font-game text-2xl leading-none text-muted-foreground/45">VS</span>
            <GridPattern grid={symmetryChallenge.gridB} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button
              type="button"
              onClick={() => onAnswer(true)}
              disabled={symmetryAnswered}
              className="h-12 rounded-lg border-2 border-[#14532d] bg-[#22c55e] font-game text-2xl text-black hover:bg-[#16a34a]"
            >
              Symmetric
            </Button>
            <Button
              type="button"
              onClick={() => onAnswer(false)}
              disabled={symmetryAnswered}
              className="h-12 rounded-lg border-2 border-[#881337] bg-[#fb7185] font-game text-2xl text-black hover:bg-[#f43f5e]"
            >
              Not Symmetric
            </Button>
          </div>
          {symmetryAnswered && lastSymmetryCorrect !== null && (
            <div
              className={cn(
                "mt-4 flex items-center justify-center gap-2 font-inter text-sm font-black",
                lastSymmetryCorrect ? "text-[#22c55e]" : "text-[#fb7185]"
              )}
            >
              {lastSymmetryCorrect ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
              {lastSymmetryCorrect ? "Correct +3" : "Wrong -1"}
            </div>
          )}
        </section>
      </GameShell>
    );
  }

  return (
    <GameShell
      phaseLabel={
        phase === "blinking"
          ? `Remember dot ${currentDotIndex + 1} of ${dotsToRemember}`
          : `Recall ${recallClicks.length} of ${dotsToRemember}`
      }
      lives={lives}
      level={level}
      score={score}
      streak={streak}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border-4 border-border bg-card p-3 shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
          <p className="font-game text-2xl leading-none text-primary sm:text-3xl">
            {phase === "blinking" ? "Remember this dot!" : "Click in the same order"}
          </p>
          <div className="flex gap-2">
            {Array.from({ length: dotsToRemember }).map((_, index) => (
              <span
                key={index}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 font-game text-xl leading-none",
                  index < recallClicks.length
                    ? "border-[#22c55e] bg-[#22c55e] text-black"
                    : index === recallClicks.length && phase === "recall"
                      ? "animate-pulse border-[#ffc516] text-[#ffc516]"
                      : "border-border text-muted-foreground/50"
                )}
              >
                {index + 1}
              </span>
            ))}
          </div>
        </div>
        <DotField
          dots={dots}
          blinkDotId={blinkDotId}
          recallClicks={recallClicks}
          phase={phase}
          onDotClick={onDotClick}
          shake={recallShake}
        />
      </section>
    </GameShell>
  );
}
