import GameCard from "./Card"
import { gameCards } from "./Config"

const GameSection = () => {
  return (
    <section id="all-games" className="scroll-mt-20 bg-background px-4 py-12 text-foreground sm:scroll-mt-24 sm:px-8 sm:py-16 lg:scroll-mt-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mt-10 sm:mt-12">
          <h3 className="font-game text-4xl leading-none text-foreground sm:text-5xl">
            All Games
          </h3>

          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:gap-x-24 lg:gap-y-14">
            {gameCards.map((game) => (
              <GameCard key={game.title} game={game} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default GameSection
