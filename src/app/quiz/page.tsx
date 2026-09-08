import type { Metadata } from "next";

import GameCard from "@/components/reuseable-components/gameCard";
import Welcome from "@/components/reuseable-components/Welcome";

export const metadata: Metadata = {
  title: "Practice Quizzes | Campusmonk",
  description:
    "Attempt Accenture-style technical practice quizzes with timed sections, instant explanations, and section-wise answer keys.",
};

const quizzes = [
  {
    png: "/calculate.png",
    heading: "Accenture Technical",
    p: "150 scenario-based questions across 10 sections with a 45 minute timer and instant explanations.",
    href: "/quiz/accenture-technical",
    imageAlt: "Accenture technical practice quiz",
  },
];

export default function QuizPage() {
  return (
    <main className="mt-2 min-h-screen overflow-hidden bg-background text-foreground md:mt-10">
      <Welcome companyName="Practice Quiz" mascotSrc="/game-console.png" />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10">
          <h1 className="font-game text-3xl leading-none text-foreground drop-shadow-[4px_4px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-4xl">
            Explore Quizzes
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Pick a quiz, work through each section, and unlock the answer key
            once every question in that section is attempted.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {quizzes.map((quiz) => (
            <GameCard
              key={quiz.href}
              png={quiz.png}
              heading={quiz.heading}
              p={quiz.p}
              href={quiz.href}
              imageAlt={quiz.imageAlt}
              className="max-w-none"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
