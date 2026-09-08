import GameCard from "@/components/reuseable-components/gameCard";
import Welcome from "@/components/reuseable-components/Welcome";

const capgeminiGames = [
  {
    png: "/handheld-game-console.png",
    heading: "Quick Math",
    p: "Solve rapid number puzzles and sharpen calculation speed.",
    href: "/capgemini/quick-math",
    imageAlt: "Quick math",
  },
  {
    png: "/egg.png",
    heading: "Switch Challenge",
    p: "Practice mental flexibility by switching between tasks quickly.",
    href: "/capgemini/switch-challenge",
    imageAlt: "Switch challenge",
  },
  {
    png: "/game-console.png",
    heading: "Gap Challenge",
    p: "Use clues and logic to narrow choices under time pressure.",
    href: "/capgemini/deductive-challenge",
    imageAlt: "Deductive challenge",
  },
  {
    png: "/game.png",
    heading: "Motion Challenge",
    p: "Track movement patterns and react with sharper visual focus.",
    href: "/capgemini/motion-challenge",
    imageAlt: "Motion challenge",
  },
];

export default function CapgeminiPage() {
  return (
    <main className="mt-2 min-h-screen overflow-hidden bg-background text-foreground md:mt-10">
      <Welcome companyName="Capgemini" />

      <section className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-col gap-3 sm:mb-10">
          {/* <p className="font-game text-2xl leading-none text-arcade">
            Capgemini Games
          </p> */}
          <h1 className="font-game text-3xl leading-none text-foreground drop-shadow-pop-md sm:text-4xl">
            Explore Games
          </h1>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {capgeminiGames.map((game) => (
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
