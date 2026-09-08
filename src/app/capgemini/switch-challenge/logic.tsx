"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SwitchChallengeUI from "@/components/games-ui/SwitchChallengeUI";

export type SwitchGameStatus = "start" | "playing" | "results";

export type SwitchPuzzle = {
  id: number;
  input: string[];
  output: string[];
  operators: string[];
  layers: 1 | 2;
  answer: string;
  options: string[];
};

type SwitchState = {
  level: number;
  correct: number;
  wrong: number;
  puzzle: SwitchPuzzle | null;
  selected: string | null;
  isAnswered: boolean;
  isCorrect: boolean | null;
  timeLeft: number;
  sessionTime: number;
  gameStatus: SwitchGameStatus;
};

const TIME_PER_QUESTION = 20;
const SESSION_TIME = 180;
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const BASE_OPERATORS = ["1234", "1243", "1324", "1432", "2134", "2143", "2314", "2413", "3124", "3214", "3412", "4123", "4213", "4312", "4321"];
const ADVANCED_OPERATORS = ["12345", "12435", "13254", "14325", "15432", "21345", "23154", "25413", "31245", "32154", "34512", "41235", "43125", "45123", "51234", "54321"];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(items: T[]) {
  const output = [...items];

  for (let index = output.length - 1; index > 0; index -= 1) {
    const swapIndex = randomInt(0, index);
    [output[index], output[swapIndex]] = [output[swapIndex], output[index]];
  }

  return output;
}

function makeInput(length: number) {
  return shuffle(LETTERS).slice(0, length);
}

function applyOperator(input: string[], operator: string) {
  return operator.split("").map((position) => input[Number(position) - 1]);
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function makeOptions(answer: string, bank: string[], count: number) {
  const distractors = shuffle(bank.filter((operator) => operator !== answer)).slice(0, count - 1);
  return shuffle([answer, ...distractors]);
}

function generateSwitchPuzzle(level: number): SwitchPuzzle {
  const length = level < 7 ? 4 : 5;
  const bank = length === 4 ? BASE_OPERATORS : ADVANCED_OPERATORS;
  const optionCount = level < 6 ? 4 : 6;
  const layers: 1 | 2 = level >= 8 && level % 3 === 0 ? 2 : 1;
  const input = makeInput(length);
  const answer = bank[randomInt(0, bank.length - 1)];
  const options = makeOptions(answer, bank, optionCount);
  const firstOutput = applyOperator(input, answer);

  if (layers === 1) {
    return {
      id: Date.now() + randomInt(1, 9999),
      input,
      output: firstOutput,
      operators: [],
      layers,
      answer,
      options,
    };
  }

  const knownOperator = shuffle(bank.filter((operator) => operator !== answer))[0];

  return {
    id: Date.now() + randomInt(1, 9999),
    input,
    output: applyOperator(firstOutput, knownOperator),
    operators: [knownOperator],
    layers,
    answer,
    options,
  };
}

function checkSwitchAnswer(puzzle: SwitchPuzzle, selected: string) {
  const firstOutput = applyOperator(puzzle.input, selected);
  const finalOutput =
    puzzle.layers === 2 && puzzle.operators[0]
      ? applyOperator(firstOutput, puzzle.operators[0])
      : firstOutput;

  return finalOutput.join("") === puzzle.output.join("");
}

function makeInitialState(): SwitchState {
  return {
    level: 1,
    correct: 0,
    wrong: 0,
    puzzle: null,
    selected: null,
    isAnswered: false,
    isCorrect: null,
    timeLeft: TIME_PER_QUESTION,
    sessionTime: SESSION_TIME,
    gameStatus: "start",
  };
}

function startGameState(): SwitchState {
  return {
    ...makeInitialState(),
    puzzle: generateSwitchPuzzle(1),
    gameStatus: "playing",
  };
}

function nextPuzzleState(current: SwitchState) {
  const nextLevel = current.level + 1;

  return {
    ...current,
    level: nextLevel,
    puzzle: generateSwitchPuzzle(nextLevel),
    selected: null,
    isAnswered: false,
    isCorrect: null,
    timeLeft: TIME_PER_QUESTION,
  };
}

export default function SwitchChallengeGame() {
  const [state, setState] = useState<SwitchState>(makeInitialState);
  const transitionRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const timer = useMemo(() => formatTime(state.sessionTime), [state.sessionTime]);

  const queueNextPuzzle = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    transitionRef.current = setTimeout(() => {
      setState((current) => {
        if (current.gameStatus !== "playing") return current;
        return nextPuzzleState(current);
      });
    }, 1200);
  }, []);

  useEffect(() => {
    if (state.gameStatus !== "playing" || state.isAnswered) return;

    const timeout = setTimeout(() => {
      setState((current) => {
        if (current.gameStatus !== "playing" || current.isAnswered) return current;

        if (current.timeLeft <= 1) {
          if (transitionRef.current) clearTimeout(transitionRef.current);
          transitionRef.current = setTimeout(() => {
            setState((latest) => {
              if (latest.gameStatus !== "playing") return latest;
              return nextPuzzleState(latest);
            });
          }, 1200);

          return {
            ...current,
            isAnswered: true,
            isCorrect: false,
            wrong: current.wrong + 1,
            timeLeft: 0,
          };
        }

        return { ...current, timeLeft: current.timeLeft - 1 };
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state.gameStatus, state.isAnswered, state.timeLeft]);

  useEffect(() => {
    if (state.gameStatus !== "playing") return;

    const timeout = setTimeout(() => {
      setState((current) => {
        if (current.gameStatus !== "playing") return current;

        if (current.sessionTime <= 1) {
          return { ...current, gameStatus: "results", sessionTime: 0 };
        }

        return { ...current, sessionTime: current.sessionTime - 1 };
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [state.gameStatus, state.sessionTime]);

  useEffect(() => {
    return () => {
      if (transitionRef.current) clearTimeout(transitionRef.current);
    };
  }, []);

  const handleSelect = useCallback(
    (option: string) => {
      setState((current) => {
        if (current.gameStatus !== "playing" || current.isAnswered || !current.puzzle) return current;

        const correctAnswer = checkSwitchAnswer(current.puzzle, option);

        return {
          ...current,
          selected: option,
          isAnswered: true,
          isCorrect: correctAnswer,
          correct: current.correct + (correctAnswer ? 1 : 0),
          wrong: current.wrong + (correctAnswer ? 0 : 1),
        };
      });

      queueNextPuzzle();
    },
    [queueNextPuzzle]
  );

  const resetGame = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState(makeInitialState());
  }, []);

  const handleStart = useCallback(() => {
    if (transitionRef.current) clearTimeout(transitionRef.current);
    setState(startGameState());
  }, []);

  return (
    <SwitchChallengeUI
      level={state.level}
      timer={timer}
      puzzle={state.puzzle}
      isAnswered={state.isAnswered}
      isCorrect={state.isCorrect}
      selected={state.selected}
      handleSelect={handleSelect}
      timeLeft={state.timeLeft}
      timeLimit={TIME_PER_QUESTION}
      gameStatus={state.gameStatus}
      correct={state.correct}
      wrong={state.wrong}
      onStart={handleStart}
      resetGame={resetGame}
    />
  );
}
