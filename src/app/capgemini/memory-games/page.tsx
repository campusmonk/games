import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Memory Games | Capgemini Cognitive Game",
  description:
    "Practice recall and attention for Capgemini-style cognitive game preparation.",
};

export default function MemoryGamesPage() {
  return (
    <main className="min-h-screen bg-background px-4 pb-16 pt-24 text-foreground sm:px-8 lg:px-12">
      <section className="mx-auto max-w-3xl rounded-lg border border-border bg-card p-6 text-card-foreground shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_88%)] sm:p-8">
        <p className="font-game text-xl leading-none text-primary">
          Capgemini Game
        </p>
        <h1 className="mt-4 font-game text-3xl leading-none text-card-foreground sm:text-5xl">
          Memory Games
        </h1>
        <p className="mt-5 text-base leading-7 text-muted-foreground">
          Train recall and attention with fast visual memory challenges.
        </p>
        <Link
          href="/capgemini"
          className="mt-8 inline-flex rounded-md border border-border px-4 py-2 text-sm font-medium text-card-foreground transition hover:bg-muted"
        >
          Back to Capgemini games
        </Link>
      </section>
    </main>
  );
}
