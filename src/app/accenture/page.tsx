import GameCard from "@/components/reuseable-components/gameCard";
import Welcome from "@/components/reuseable-components/Welcome";

const accentureGames = [
  {
    png: "/grid.png",
    heading: "Grid Puzzle",
    p: "Train focus and recall with fast visual memory challenges.",
    href: "/accenture/grid-puzzle",
    imageAlt: "Grid puzzle",
  },
  {
    png: "/video-game.png",
    heading: "Bubble Math",
    p: "Pop through number puzzles and build quick calculation flow.",
    href: "/accenture/bubble-math",
    imageAlt: "Bubble math",
  },
  {
    png: "/crossing-arrows.png",
    heading: "Path Finder",
    p: "Trace the right route through visual logic challenges.",
    href: "/accenture/path-finder",
    imageAlt: "Path finder",
  },
  {
    png: "/key (2).png",
    heading: "Key & Door",
    p: "Match clues, unlock patterns, and solve compact logic puzzles.",
    href: "/accenture/key-and-door",
    imageAlt: "Key and door",
  },
];

export default function AccenturePage() {
  return (
    <main className="mt-2 min-h-screen overflow-hidden bg-background text-foreground md:mt-10">
      <Welcome companyName="Accenture" />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10">
          {/* <p className="font-game text-2xl leading-none text-arcade">
            Accenture Games
          </p> */}
          <h1 className="font-game text-3xl leading-none text-foreground drop-shadow-pop-md sm:text-4xl">
            Explore Games
          </h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {accentureGames.map((game) => (
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
