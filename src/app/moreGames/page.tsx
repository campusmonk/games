import GameCard from "@/components/reuseable-components/gameCard";
import Image from "next/image";
import { Sparkles } from "lucide-react";

const gameCollections = [
  {
    png: "/logo.png",
    heading: "Accenture Games",
    p: "Practice visual recall, quick math, path finding, and logic puzzles in one focused set.",
    href: "/accenture",
    imageAlt: "Accenture games",
  },
  {
    png: "/logo.png",
    heading: "Capgemini Games",
    p: "Build placement-ready speed with bite-sized cognitive games and timed challenges.",
    href: "/capgemini",
    imageAlt: "Capgemini games",
  },
  {
    png: "/calculate.png",
    heading: "Practice Quizzes",
    p: "Attempt Accenture-style technical quizzes with timed sections and instant explanations.",
    href: "/quiz",
    imageAlt: "Practice quizzes",
  },
];

export default function MoreGamesPage() {
  return (
    <main className="mt-2 min-h-screen overflow-hidden bg-background text-foreground md:mt-10">
      <section className="w-full px-4 pt-20 text-foreground sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_280px] lg:items-end">
          <div>
            <p className="font-game text-xl leading-none text-primary sm:text-2xl">
              Practice Hub
            </p>
            <h1 className="mt-4 font-game text-4xl leading-none text-foreground drop-shadow-pop-md sm:text-6xl">
              More Games
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Explore company-wise cognitive practice sets and keep an eye out
              for fresh challenges as they are added.
            </p>
          </div>

          <div className="relative hidden h-44 justify-self-end lg:block">
            <Image
              src="/machine.webp"
              alt=""
              fill
              priority
              unoptimized
              sizes="280px"
              className="object-contain [image-rendering:pixelated]"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-10 sm:px-8 sm:pt-12 lg:px-12">
        <div className="mb-8 rounded-lg border border-primary/30 bg-primary/10 px-5 py-4 text-foreground shadow-pop-sm sm:mb-10 sm:flex sm:items-center sm:gap-4">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground sm:mb-0">
            <Sparkles className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-game text-2xl leading-none text-primary">
              New Challenges Coming Soon
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              More placement practice games are on the way. Start with the
              available collections below.
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-game text-3xl leading-none text-foreground drop-shadow-pop-md sm:text-4xl">
            Explore These Games
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {gameCollections.map((game) => (
            <GameCard
              key={game.href}
              png={game.png}
              heading={game.heading}
              p={game.p}
              href={game.href}
              imageAlt={game.imageAlt}
              className="max-w-none"
            />
          ))}
        </div>
      </section>
    </main>
  );
}
