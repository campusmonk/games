import type { Metadata } from "next";

import GameCard from "@/components/reuseable-components/gameCard";
import Welcome from "@/components/reuseable-components/Welcome";

export const metadata: Metadata = {
  title: "Debugging Assessments | Campusmonk",
  description:
    "Practice Capgemini-style debugging assessments with timed code review and validation prompts.",
};

const debugAssessments = [
  {
    png: "/game-console.png",
    heading: "Debugging Assessment 1",
    p: "Solve five timed DSA debugging prompts covering trees, graphs, dynamic programming, prefix sums, and shortest paths.",
    href: "/debug/assessment-1",
    imageAlt: "Debugging assessment one",
  },
  {
    png: "/window.svg",
    heading: "Debugging Assessment 2",
    p: "Practice pointer, stack, Kadane, interval, and rotated-array debugging prompts in an assessment-style editor.",
    href: "/debug/assessment-2",
    imageAlt: "Debugging assessment two",
  },
];

export default function DebugPage() {
  return (
    <main className="mt-2 min-h-screen overflow-hidden bg-background text-foreground md:mt-10">
      <Welcome companyName="Debugging Assessment" mascotSrc="/game-console.png" />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10">
          <h1 className="font-game text-3xl leading-none text-foreground drop-shadow-pop-md sm:text-4xl">
            Debugging Practice
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
            Pick an assessment, review each faulty solution, fix the logic, and
            submit when the simulator accepts the test cases.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {debugAssessments.map((assessment) => (
            <GameCard
              key={assessment.href}
              png={assessment.png}
              heading={assessment.heading}
              p={assessment.p}
              href={assessment.href}
              imageAlt={assessment.imageAlt}
              className="max-w-none"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
