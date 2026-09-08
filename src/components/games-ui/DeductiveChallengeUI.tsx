"use client";

import {
  BrainCircuit,
  CheckCircle2,
  Heart,
  RotateCcw,
  Sparkles,
  Timer,
  Trophy,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  DeductivePhase,
  DeductivePuzzle,
  DeductiveSymbol,
} from "@/app/capgemini/deductive-challenge/logic";

type Props = {
  phase: DeductivePhase;
  level: number;
  lives: number;
  score: number;
  correctCount: number;
  wrongCount: number;
  streak: number;
  bestStreak: number;
  highestLevel: number;
  puzzle: DeductivePuzzle | null;
  grid: DeductiveSymbol[][];
  selected: DeductiveSymbol | null;
  timeLeft: number;
  timeLimit: number;
  onStart: () => void;
  onSelect: (symbol: DeductiveSymbol) => void;
  onReset: () => void;
};

const symbolStyles: Record<DeductiveSymbol, string> = {
  A: "text-[#1888f2]",
  B: "text-[#ffcc18]",
  C: "text-muted-foreground/40",
  D: "text-[#22c55e]",
  E: "text-[#fb7185]",
  F: "text-[#a78bfa]",
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
          Pattern Logic
        </p>
        <h1 className="font-game text-4xl leading-none text-foreground drop-shadow-[4px_4px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-5xl lg:text-6xl">
         Gap Challenge
        </h1>
        <p className="font-inter text-sm font-semibold text-muted-foreground">{phaseLabel}</p>
      </div>
      <Hud lives={lives} level={level} score={score} streak={streak} />
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
          Timer
        </p>
        <p className="font-game text-3xl leading-none text-primary">{timeLeft}s</p>
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

function DeductionBadge() {
  return (
    <div className="flex items-center gap-3 rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
      <div className="flex size-12 items-center justify-center rounded-md border-2 border-[#8a6200] bg-[#ffc516] text-black">
        <BrainCircuit className="size-7" />
      </div>
      <div>
        <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
          Objective
        </p>
        <p className="font-game text-2xl leading-none text-card-foreground sm:text-3xl">
          Missing Symbol
        </p>
      </div>
    </div>
  );
}

function isHiddenCell(puzzle: DeductivePuzzle, row: number, col: number) {
  return puzzle.emptyCells.some((cell) => cell.row === row && cell.col === col);
}

function isTargetCell(puzzle: DeductivePuzzle, row: number, col: number) {
  return puzzle.targetCell.row === row && puzzle.targetCell.col === col;
}

function SymbolTile({
  symbol,
  className,
}: {
  symbol: DeductiveSymbol;
  className?: string;
}) {
  if (symbol === "A") {
    return (
      <span
        className={cn(
          "block size-7 rotate-45 rounded-[3px] bg-linear-to-br from-[#54b9ff] via-[#1688f2] to-[#003f98] shadow-[0_0_12px_rgba(24,136,242,0.45)] sm:size-8",
          className
        )}
      />
    );
  }

  if (symbol === "B") {
    return (
      <span
        className={cn(
          "block size-8 rounded-full bg-linear-to-br from-[#fff47a] via-[#ffcc18] to-[#ff9f0a] shadow-[0_0_14px_rgba(255,204,24,0.5)] sm:size-9",
          className
        )}
      />
    );
  }

  if (symbol === "C") {
    return (
      <span
        className={cn(
          "font-inter text-4xl font-black leading-none text-muted-foreground/40 sm:text-5xl",
          className
        )}
      >
        +
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex size-8 items-center justify-center rounded-full border-2 border-current/50 font-game text-2xl leading-none sm:size-10 sm:text-3xl",
        symbolStyles[symbol],
        className
      )}
    >
      {symbol}
    </span>
  );
}

function PuzzleBoard({
  puzzle,
  grid,
  phase,
}: Pick<Props, "puzzle" | "grid" | "phase">) {
  if (!puzzle) return null;

  return (
    <div
      className={cn(
        "rounded-lg border-4 border-border bg-card p-5 text-card-foreground shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] transition",
        phase === "correct" && "border-[#14532d]",
        phase === "wrong" && "border-[#881337] animate-[grid-shake_0.38s_ease-in-out]"
      )}
    >
      <div className="mb-5 text-center">
        <h2 className="font-inter text-2xl font-black leading-tight text-card-foreground sm:text-3xl">
          Find the Missing Symbol
        </h2>
        <p className="mt-2 font-inter text-sm font-bold leading-6 text-muted-foreground sm:text-base">
          Analyze the pattern and choose the correct option
        </p>
      </div>
      <div
        className="mx-auto grid w-[min(72vw,348px)] gap-4 rounded-[24px] border border-border bg-background p-5 shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground),transparent_90%)] sm:gap-4"
        style={{ gridTemplateColumns: `repeat(${puzzle.size}, minmax(0, 1fr))` }}
      >
        {grid.map((row, rowIndex) =>
          row.map((symbol, colIndex) => {
            const hidden = isHiddenCell(puzzle, rowIndex, colIndex);
            const target = isTargetCell(puzzle, rowIndex, colIndex);

            if (target) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="flex aspect-square items-center justify-center rounded-[18px] border-4 border-foreground/70 bg-muted font-inter text-4xl font-black leading-none text-foreground"
                >
                  ?
                </div>
              );
            }

            if (hidden) {
              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="aspect-square rounded-[18px] bg-muted/60"
                />
              );
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="flex aspect-square items-center justify-center rounded-[18px] border border-border bg-card"
              >
                <SymbolTile symbol={symbol} />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function OptionsPad({
  puzzle,
  selected,
  phase,
  onSelect,
}: Pick<Props, "puzzle" | "selected" | "phase" | "onSelect">) {
  if (!puzzle) return null;

  const canPlay = phase === "playing";

  return (
    <div className="rounded-lg border-4 border-border bg-card p-3 shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:p-4">
      <div className="grid grid-cols-2 gap-3">
        {puzzle.options.map((symbol) => {
          const isSelected = selected === symbol;

          return (
            <button
              key={symbol}
              type="button"
              disabled={!canPlay}
              onClick={() => onSelect(symbol)}
              className={cn(
                "flex h-16 items-center justify-center rounded-[18px] border text-card-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklch,var(--foreground),transparent_94%)] transition sm:h-20 sm:rounded-[22px]",
                canPlay && "border-border bg-background hover:border-ring hover:bg-muted",
                !canPlay && "border-border bg-muted opacity-50",
                isSelected && phase === "correct" && "border-emerald-400/60 bg-emerald-400/10",
                isSelected && phase === "wrong" && "border-rose-400/60 bg-rose-400/10"
              )}
            >
              <SymbolTile symbol={symbol} />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PreviewBoard() {
  const previewGrid: DeductiveSymbol[][] = [
    ["A", "B", "C"],
    ["B", "C", "A"],
    ["C", "A", "B"],
  ];

  return (
    <section className="rounded-lg border-4 border-border bg-card p-4 shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
      <div className="flex aspect-[16/10] min-h-[320px] flex-col items-center justify-center gap-5 rounded-md border-2 border-border bg-background p-4">
        <BrainCircuit className="size-12 text-primary" />
        <div className="grid grid-cols-3 gap-2">
          {previewGrid.map((row, rowIndex) =>
            row.map((symbol, colIndex) => {
              const target = rowIndex === 2 && colIndex === 2;

              return target ? (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className="flex size-14 items-center justify-center rounded-[18px] border-4 border-foreground/70 bg-muted font-inter text-3xl font-black leading-none text-foreground"
                >
                  ?
                </div>
              ) : (
                <SymbolTile key={`${rowIndex}-${colIndex}`} symbol={symbol} />
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export default function DeductiveChallengeUI({
  phase,
  level,
  lives,
  score,
  correctCount,
  wrongCount,
  streak,
  bestStreak,
  highestLevel,
  puzzle,
  grid,
  selected,
  timeLeft,
  timeLimit,
  onStart,
  onSelect,
  onReset,
}: Props) {
  if (phase === "start") {
    return (
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="font-game text-xl leading-none text-primary sm:text-2xl">
            Pattern Logic
          </p>
          <h1 className="mt-3 font-game text-5xl leading-[0.9] text-foreground drop-shadow-[5px_5px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-6xl lg:text-7xl">
            Gap Challenge
          </h1>
          <p className="mt-5 max-w-xl font-inter text-base font-semibold leading-7 text-muted-foreground">
            Read the grid pattern, infer the hidden target, and choose the matching symbol before time runs out.
          </p>
          <div className="mt-7 grid w-full max-w-xl grid-cols-3 gap-3">
            {["Scan", "Infer", "Choose"].map((label, index) => (
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
          <StatPill label="Best Streak" value={bestStreak} />
          <StatPill label="Correct" value={correctCount} className="border-[#14532d]" />
          <StatPill label="Wrong" value={wrongCount} className="border-[#881337]" />
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

  return (
    <GameShell
      phaseLabel={
        phase === "correct"
          ? "Correct symbol"
          : phase === "wrong"
            ? "Pattern missed"
            : "Find the target symbol"
      }
      lives={lives}
      level={level}
      score={score}
      streak={streak}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <DeductionBadge />
          <TimerBar timeLeft={timeLeft} timeLimit={timeLimit} />
        </div>

        {(phase === "correct" || phase === "wrong") && (
          <div
            className={cn(
              "flex items-center justify-center gap-2 rounded-lg border-4 bg-card p-3 font-inter text-sm font-black shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]",
              phase === "correct"
                ? "border-[#14532d] text-[#22c55e]"
                : "border-[#881337] text-[#fb7185]"
            )}
          >
            {phase === "correct" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
            {phase === "correct" ? "Score added, next level loading" : "Life lost, next puzzle loading"}
          </div>
        )}

        <PuzzleBoard puzzle={puzzle} grid={grid} phase={phase} />
        <OptionsPad puzzle={puzzle} selected={selected} phase={phase} onSelect={onSelect} />
      </section>
    </GameShell>
  );
}
