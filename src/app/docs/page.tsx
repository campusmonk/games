import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  Building2,
  Gamepad2,
  ListChecks,
  Sparkles,
  Target,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Company Cognitive Games Documentation | Campus Monk",
  description:
    "Short documentation for Accenture, Capgemini, and Cognizant cognitive game practice on Campus Monk.",
};

type GameDoc = {
  title: string;
  skill: string;
  description: string;
  steps: string[];
  href?: string;
};

type CompanyDoc = {
  name: string;
  tagline: string;
  detail: string;
  note: string;
  games: GameDoc[];
};

const capgeminiCognizantGames: GameDoc[] = [
  {
    title: "Switch Challenge",
    skill: "Pattern recognition, reverse logic, and cognitive flexibility",
    description:
      "A sequence changes after passing through a switch. Your job is to identify which switch rule or operator produced the output.",
    steps: [
      "Compare the input and output sequence position by position.",
      "Work backwards to find how each item moved.",
      "Choose the switch code that matches the same movement pattern.",
    ],
    href: "/capgemini/switch-challenge",
  },
  {
    title: "Deductive Challenge",
    skill: "Deductive reasoning, symbol logic, and elimination",
    description:
      "A grid contains symbols with one missing cell. Use row and column rules to decide which symbol fits logically.",
    steps: [
      "Scan the row and column of the missing cell.",
      "Remove symbols that already break the row or column rule.",
      "Select the only symbol that keeps the grid consistent.",
    ],
    href: "/capgemini/deductive-challenge",
  },
  {
    title: "Digit Challenge / Quick Math",
    skill: "Mental arithmetic, number sense, and fast calculation",
    description:
      "A timed number puzzle where you solve arithmetic equations or place digits correctly under pressure.",
    steps: [
      "Read the equation and identify the missing digit or operation.",
      "Calculate mentally before selecting an answer.",
      "Use each available digit carefully and avoid rushed guesses.",
    ],
    href: "/capgemini/quick-math",
  },
  {
    title: "Grid Challenge",
    skill: "Working memory, spatial attention, and multitasking",
    description:
      "A grid-based memory task where you remember highlighted positions while solving quick visual checks.",
    steps: [
      "Memorize each highlighted grid position.",
      "Answer the visual comparison task shown between grid prompts.",
      "Recall the marked positions accurately at the end.",
    ],
  },
  {
    title: "Motion Challenge",
    skill: "Planning, movement logic, and optimization",
    description:
      "A board puzzle where you move an object toward a target while handling blocks, barriers, and limited space.",
    steps: [
      "Study the board before moving.",
      "Plan the shortest route to the target.",
      "Move blocks only when they help clear the path.",
    ],
    href: "/capgemini/motion-challenge",
  },
];

const accentureGames: GameDoc[] = [
  {
    title: "Grid Puzzle",
    skill: "Visual memory, symmetry checking, and attention control",
    description:
      "A fast grid challenge where you track positions and respond to visual pattern prompts.",
    steps: [
      "Watch the highlighted grid location carefully.",
      "Answer the mirror or pattern question quickly.",
      "Recall the saved grid positions when asked.",
    ],
    href: "/accenture/grid-puzzle",
  },
  {
    title: "Bubble Math",
    skill: "Arithmetic ordering, calculation speed, and accuracy",
    description:
      "A number game where expression bubbles must be solved and selected in the correct order.",
    steps: [
      "Calculate each bubble expression.",
      "Compare the values from lowest to highest or highest to lowest.",
      "Pop the bubbles in the requested order before time runs out.",
    ],
    href: "/accenture/bubble-math",
  },
  {
    title: "Path Finder",
    skill: "Spatial reasoning, path building, and route planning",
    description:
      "A tile route puzzle where you connect a start point to an end point by arranging the path correctly.",
    steps: [
      "Find the start and destination points.",
      "Rotate or adjust path tiles to create one connected route.",
      "Check that every turn points toward the final target.",
    ],
    href: "/accenture/path-finder",
  },
  {
    title: "Key & Door",
    skill: "Memory, route recall, and decision making",
    description:
      "A compact memory game where you collect a key and reach the door while remembering blocked or failed directions.",
    steps: [
      "Move toward the key first.",
      "Remember which directions are blocked.",
      "Use the learned route to reach the door efficiently.",
    ],
    href: "/accenture/key-and-door",
  },
];

const companies: CompanyDoc[] = [
  {
    name: "Accenture",
    tagline: "Gamified assessment practice for speed, logic, and working memory.",
    detail:
      "Accenture assessment preparation often includes online aptitude, problem-solving, and role-based evaluation practice. These games help students train the kind of focus, memory, and fast reasoning commonly discussed in gamified placement prep.",
    note: "Practice formats are inspired by publicly discussed assessment styles and are not official Accenture exam questions.",
    games: accentureGames,
  },
  {
    name: "Capgemini",
    tagline: "Cognitive game practice for placement aptitude preparation.",
    detail:
      "Capgemini placement preparation is commonly associated with game-based aptitude formats such as switch, digit, grid, motion, and deductive reasoning challenges. The goal is to improve speed, accuracy, pattern recognition, and logical thinking before the real assessment.",
    note: "Game names and mechanics are based on public prep resources and student-facing practice patterns, not guaranteed live-test content.",
    games: capgeminiCognizantGames,
  },
  {
    name: "Cognizant",
    tagline: "Shared cognitive game practice for Capgemini-style and Cognizant prep.",
    detail:
      "Cognizant preparation can benefit from the same cognitive game practice set used for Capgemini-style game-based aptitude prep. These exercises build transferable reasoning skills for aptitude, attention, and problem-solving rounds.",
    note: "This section intentionally mirrors the Capgemini game set for shared practice, as requested.",
    games: capgeminiCognizantGames,
  },
];

export default function DocsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background px-4 pb-20 pt-24 text-foreground sm:px-8 sm:pt-32 lg:px-12 lg:pt-36">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground),transparent_94%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground),transparent_94%)_1px,transparent_1px)] bg-[size:34px_34px]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-[linear-gradient(to_bottom,var(--secondary),transparent)]" />

      <section className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div className="max-w-4xl">
          <p className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 font-inter text-sm font-semibold uppercase tracking-[0.16em] text-muted-foreground shadow-[4px_4px_0_0_color-mix(in_oklch,var(--foreground),transparent_88%)]">
            <BookOpenCheck className="size-4 text-primary" aria-hidden="true" />
            Campus Monk Docs
          </p>
          <h1 className="mt-5 font-game text-5xl leading-none text-foreground drop-shadow-[5px_5px_0_color-mix(in_oklch,var(--background),var(--foreground)_14%)] sm:text-6xl lg:text-7xl">
            Company Cognitive Games Guide
          </h1>
          <p className="mt-6 max-w-3xl font-inter text-base leading-8 text-muted-foreground sm:text-lg">
            Short, student-friendly documentation for Accenture, Capgemini, and
            Cognizant game practice. Use it to understand what each game trains,
            how to play, and where to start practicing.
          </p>
          </div>

          <div className="rounded-lg border-4 border-foreground bg-primary p-5 text-primary-foreground shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_18%)]">
            <Sparkles className="size-7" aria-hidden="true" />
            <p className="mt-4 font-game text-4xl leading-none">13 Practice Notes</p>
            <p className="mt-3 font-inter text-sm font-semibold leading-6 text-primary-foreground/80">
              Quick guides for what each game tests, how to approach it, and
              where to begin practice.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {companies.map((company) => (
            <a
              key={company.name}
              href={`#${company.name.toLowerCase()}`}
              className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-[5px_5px_0_0_color-mix(in_oklch,var(--foreground),transparent_90%)] transition-all hover:-translate-y-1 hover:border-primary hover:shadow-[7px_7px_0_0_color-mix(in_oklch,var(--primary),transparent_28%)]"
            >
              <Building2 className="size-6 text-primary" aria-hidden="true" />
              <h2 className="mt-4 font-game text-3xl leading-none text-card-foreground">
                {company.name}
              </h2>
              <p className="mt-3 font-inter text-sm leading-6 text-muted-foreground">
                {company.tagline}
              </p>
            </a>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl space-y-14">
        {companies.map((company) => (
          <article
            key={company.name}
            id={company.name.toLowerCase()}
            className="scroll-mt-28"
          >
            <div className="border-y border-border py-8">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-4xl">
                  <p className="font-inter text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                    Company Details
                  </p>
                  <h2 className="mt-3 font-game text-4xl leading-none text-foreground sm:text-5xl">
                    {company.name} Games
                  </h2>
                  <p className="mt-5 font-inter text-base leading-8 text-muted-foreground">
                    {company.detail}
                  </p>
                </div>
                <p className="max-w-md rounded-lg border border-primary/35 bg-primary/10 p-4 font-inter text-sm font-medium leading-6 text-foreground">
                  {company.note}
                </p>
              </div>
            </div>

            <div className="mt-8 grid gap-5 lg:grid-cols-2">
              {company.games.map((game) => (
                <div
                  key={`${company.name}-${game.title}`}
                  className="rounded-lg border border-border bg-card p-5 text-card-foreground shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_90%)] sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-md border border-border bg-secondary text-primary">
                      <Gamepad2 className="size-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0">
                      <h3 className="font-game text-3xl leading-none text-card-foreground">
                        {game.title}
                      </h3>
                      <p className="mt-2 font-inter text-sm font-semibold leading-6 text-primary">
                        Tests: {game.skill}
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 font-inter text-sm leading-7 text-muted-foreground sm:text-base">
                    {game.description}
                  </p>

                  <div className="mt-6">
                    <div className="flex items-center gap-2 font-inter text-sm font-semibold text-card-foreground">
                      <ListChecks className="size-5 text-primary" aria-hidden="true" />
                      How to play
                    </div>
                    <ol className="mt-3 space-y-2 font-inter text-sm leading-6 text-muted-foreground">
                      {game.steps.map((step, index) => (
                        <li key={step} className="flex gap-3">
                          <span className="font-semibold text-primary">
                            {index + 1}.
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="mt-6 flex min-h-11 items-center">
                    {game.href ? (
                      <Link
                        href={game.href}
                        className="inline-flex items-center gap-2 rounded-md border-2 border-foreground bg-primary px-4 py-2.5 font-inter text-sm font-bold text-primary-foreground shadow-[4px_4px_0_0_color-mix(in_oklch,var(--foreground),transparent_20%)] transition-transform hover:translate-x-0.5 hover:translate-y-0.5"
                      >
                        Play practice
                        <ArrowRight className="size-4" aria-hidden="true" />
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary px-4 py-2.5 font-inter text-sm font-semibold text-muted-foreground">
                        <Target className="size-4" aria-hidden="true" />
                        Practice route coming soon
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
