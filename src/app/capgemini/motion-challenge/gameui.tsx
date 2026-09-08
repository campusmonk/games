"use client";

import {
  CheckCircle2,
  CircleDot,
  GripHorizontal,
  RotateCcw,
  SkipForward,
  Sparkles,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MotionChallengeBoard from "./board";
import type {
  MotionEntity,
  MotionGameStatus,
  MotionLevel,
  MoveDirection,
} from "./logic";

type Props = {
  levelNumber: number;
  totalLevels: number;
  level: MotionLevel;
  timer: string;
  entities: MotionEntity[];
  selectedId: string | null;
  moves: number;
  score: number;
  correct: number;
  wrong: number;
  gameStatus: MotionGameStatus;
  isLevelWon: boolean;
  onStart: () => void;
  onSelect: (id: string | null) => void;
  onMove: (id: string, direction: MoveDirection) => void;
  onResetLevel: () => void;
  onSkipLevel: () => void;
  onNextLevel: () => void;
  onResetGame: () => void;
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

function GameShell({
  children,
  phaseLabel,
  levelNumber,
  totalLevels,
  timer,
  score,
  correct,
  wrong,
}: {
  children: React.ReactNode;
  phaseLabel: string;
  levelNumber: number;
  totalLevels: number;
  timer: string;
  score: number;
  correct: number;
  wrong: number;
}) {
  const progress = Math.min(100, Math.round(((levelNumber - 1) / totalLevels) * 100));

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 lg:gap-5">
      <div className="flex flex-col gap-2 text-center sm:gap-3">
        <p className="font-game text-xl leading-none text-primary sm:text-2xl">
          Capgemini Game
        </p>
        <h1 className="font-game text-4xl leading-none text-foreground drop-shadow-[4px_4px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-5xl lg:text-6xl lg:[@media(max-height:800px)]:text-5xl">
          Motion Challenge
        </h1>
        <p className="font-inter text-sm font-semibold text-muted-foreground">{phaseLabel}</p>

        {/* Level progress bar */}
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-1 flex items-center justify-between">
            <span className="font-inter text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Level {levelNumber} of {totalLevels}
            </span>
            <span className="font-inter text-xs font-bold text-primary">{progress}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full border border-border bg-muted">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#f4a01d] to-[#ffc516] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3">
        <StatPill label="Level" value={`${levelNumber}/${totalLevels}`} />
        <StatPill label="Session" value={timer} />
        <StatPill label="Score" value={score} />
        <StatPill label="Solved" value={correct} className="border-[#14532d]" />
        <StatPill label="Skipped" value={wrong} className="border-[#881337]" />
      </div>
      {children}
    </div>
  );
}

function LevelCard({
  level,
  moves,
  levelNumber,
  totalLevels,
}: {
  level: MotionLevel;
  moves: number;
  levelNumber: number;
  totalLevels: number;
}) {
  const overPar = moves > level.par;

  return (
    <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
            Board · {levelNumber}/{totalLevels}
          </p>
          <p className="mt-1 font-game text-2xl leading-none text-card-foreground sm:text-3xl">
            {level.name}
          </p>
        </div>
        <div className="text-right">
          <p className="font-inter text-[10px] font-black uppercase tracking-wide text-muted-foreground">
            Moves / Par
          </p>
          <p
            className={cn(
              "mt-1 font-game text-3xl leading-none",
              overPar ? "text-[#fb7185]" : "text-primary"
            )}
          >
            {moves}/{level.par}
          </p>
        </div>
      </div>
    </div>
  );
}

function PreviewBoard() {
  return (
    <section className="rounded-lg border-4 border-border bg-card p-4 shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
      <div className="grid aspect-square min-h-[320px] grid-cols-6 grid-rows-6 overflow-hidden rounded-md border-2 border-border bg-background">
        {Array.from({ length: 36 }).map((_, index) => {
          const x = index % 6;
          const y = Math.floor(index / 6);
          const isHole = x === 5 && y === 5;

          return (
            <div
              key={`${x}-${y}`}
              className={cn(
                "relative border border-border bg-card",
                (x + y) % 2 === 0 && "bg-muted",
                isHole && "flex items-center justify-center bg-background"
              )}
            >
              {x === 0 && y === 5 && (
                <div className="absolute inset-[12%] rounded-full border-4 border-[#7f1d1d] bg-[#ef4444] shadow-[inset_-5px_-7px_0_rgba(127,29,29,0.34)]" />
              )}
              {x === 1 && y === 4 && (
                <div className="absolute inset-x-[10%] top-[8%] z-10 flex h-[190%] items-center justify-center rounded-md border-4 border-[#14532d] bg-[#22c55e] text-black shadow-[inset_-5px_-7px_0_rgba(20,83,45,0.24)]">
                  <GripHorizontal className="size-6 opacity-65" />
                </div>
              )}
              {x === 2 && y === 3 && (
                <div className="absolute inset-y-[10%] left-[8%] z-10 flex w-[290%] items-center justify-center rounded-md border-4 border-[#92400e] bg-[#f59e0b] text-black shadow-[inset_-5px_-7px_0_rgba(146,64,14,0.26)]">
                  <GripHorizontal className="size-6 opacity-65" />
                </div>
              )}
              {x === 4 && y === 4 && (
                <div className="absolute inset-x-[10%] top-[8%] z-10 flex h-[190%] items-center justify-center rounded-md border-4 border-[#1d4ed8] bg-[#38bdf8] text-black shadow-[inset_-5px_-7px_0_rgba(29,78,216,0.22)]">
                  <GripHorizontal className="size-6 opacity-65" />
                </div>
              )}
              {(x === 0 && y === 0) || (x === 0 && y === 1) ? (
                <div className="absolute inset-[10%] rounded-md border-4 border-[#52525b] bg-[#a1a1aa]" />
              ) : null}
              {isHole && (
                <div className="flex size-[62%] items-center justify-center rounded-full border-4 border-[#52525b] bg-black">
                  <CircleDot className="size-6 text-muted-foreground/45" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function MotionChallengeUI({
  levelNumber,
  totalLevels,
  level,
  timer,
  entities,
  selectedId,
  moves,
  score,
  correct,
  wrong,
  gameStatus,
  isLevelWon,
  onStart,
  onSelect,
  onMove,
  onResetLevel,
  onSkipLevel,
  onNextLevel,
  onResetGame,
}: Props) {
  if (gameStatus === "start") {
    return (
      <div className="mx-auto grid w-full max-w-5xl items-center gap-6 lg:grid-cols-[1fr_1.1fr]">
        <section className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <p className="font-game text-xl leading-none text-primary sm:text-2xl">
            Movement + Planning
          </p>
          <h1 className="mt-3 font-game text-5xl leading-[0.9] text-foreground drop-shadow-[5px_5px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-6xl lg:text-7xl">
            Motion Challenge
          </h1>
          <p className="mt-5 max-w-xl font-inter text-base font-semibold leading-7 text-muted-foreground">
            Slide movable pieces, clear a route, and guide the red ball into the hole before the session ends.
          </p>
          <div className="mt-7 grid w-full max-w-xl grid-cols-3 gap-3">
            {["Drag or Tap", "Slide", "Score"].map((label, index) => (
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
    const accuracy = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;

    return (
      <GameShell
        phaseLabel="Session complete"
        levelNumber={levelNumber}
        totalLevels={totalLevels}
        timer={timer}
        score={score}
        correct={correct}
        wrong={wrong}
      >
        <section className="mx-auto grid w-full max-w-3xl gap-4 rounded-lg border-4 border-border bg-card p-5 text-center text-card-foreground shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:grid-cols-3">
          <div className="sm:col-span-3">
            <Trophy className="mx-auto size-10 fill-[#ffc516] text-[#ffc516]" />
            <h2 className="mt-3 font-game text-4xl leading-none text-card-foreground drop-shadow-[3px_3px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)]">
              Results
            </h2>
          </div>
          <StatPill label="Final Score" value={score} />
          <StatPill label="Boards Solved" value={correct} className="border-[#14532d]" />
          <StatPill label="Accuracy" value={`${accuracy}%`} />
          <Button
            variant="pixel"
            size="lg"
            onClick={onResetGame}
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
      phaseLabel={isLevelWon ? "Board cleared — move to the next!" : "Move the red ball into the hole"}
      levelNumber={levelNumber}
      totalLevels={totalLevels}
      timer={timer}
      score={score}
      correct={correct}
      wrong={wrong}
    >
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-3 sm:gap-4">
        <div className="grid gap-3 lg:grid-cols-[1fr_250px] lg:gap-4">
          <LevelCard level={level} moves={moves} levelNumber={levelNumber} totalLevels={totalLevels} />
          <div className="rounded-lg border-4 border-border bg-card p-3 text-card-foreground shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)]">
            <div className="flex items-center justify-between gap-3">
              <p className="flex items-center gap-2 font-inter text-xs font-black uppercase tracking-wide text-muted-foreground">
                <Timer className="size-4" />
                Session
              </p>
              <p className="font-game text-3xl leading-none text-primary">{timer}</p>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button
                variant="pixel"
                size="sm"
                onClick={onResetLevel}
                className="h-10 rounded-lg border-4 font-game text-lg"
                aria-label="Reset board"
              >
                <RotateCcw className="size-4" />
                Reset
              </Button>
              <Button
                variant="pixel"
                size="sm"
                onClick={onSkipLevel}
                className="h-10 rounded-lg border-4 bg-[#fb7185] font-game text-lg shadow-[2px_2px_0_0_#881337] hover:shadow-[1px_1px_0_0_#881337]"
                aria-label="Skip board"
              >
                <SkipForward className="size-4" />
                Skip
              </Button>
            </div>
          </div>
        </div>

        {isLevelWon && (
          <div className="flex flex-col items-center gap-3 rounded-lg border-4 border-[#14532d] bg-card p-4 shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2 font-inter text-sm font-black text-[#22c55e]">
              <CheckCircle2 className="size-5" />
              Cleared in {moves} moves
            </div>
            {levelNumber < totalLevels && (
              <Button
                variant="pixel"
                size="sm"
                onClick={onNextLevel}
                className="h-10 rounded-lg border-4 border-[#14532d] bg-[#22c55e] font-game text-lg text-black shadow-[2px_2px_0_0_#14532d] hover:shadow-[1px_1px_0_0_#14532d]"
                aria-label="Next level"
              >
                Next Level
                <SkipForward className="size-4" />
              </Button>
            )}
          </div>
        )}

        <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-4">
          <MotionChallengeBoard
            level={level}
            entities={entities}
            selectedId={selectedId}
            disabled={isLevelWon}
            onSelect={onSelect}
            onMove={onMove}
          />
          <aside className="grid gap-3 rounded-lg border-4 border-border bg-card p-4 shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_82%)] lg:content-start">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-[#7f1d1d] bg-[#ef4444] text-white">
                <Target className="size-5" />
              </div>
              <p className="font-inter text-sm font-semibold leading-6 text-muted-foreground">
                Drag a piece to any eligible cell, or tap it and use the arrow buttons.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-md border-2 border-[#92400e] bg-[#ffc516] text-black">
                <Zap className="size-5" />
              </div>
              <p className="font-inter text-sm font-semibold leading-6 text-muted-foreground">
                Horizontal and vertical blocks only slide along their own track.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </GameShell>
  );
}
