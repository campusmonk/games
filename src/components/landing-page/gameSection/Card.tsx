import Image from "next/image"
import Link from "next/link"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { GameCardConfig } from "./Config"

type GameCardProps = {
  game: GameCardConfig
}

const GameCard = ({ game }: GameCardProps) => {
  return (
    <Link href={game.href} className="group block h-full">
      <Card className="h-full gap-0 rounded-xl border border-border bg-card py-0 text-card-foreground shadow-[6px_6px_0_0_color-mix(in_oklch,var(--foreground),transparent_85%)] ring-0 transition-transform duration-200 hover:shadow-[8px_8px_0_0_color-mix(in_oklch,var(--primary),transparent_35%)]">
        <CardHeader className="px-4 pt-4 pb-0">
          <div className="flex min-h-14 items-center justify-between gap-4">
            <CardTitle className="font-game text-2xl leading-none text-card-foreground sm:text-3xl">
              {game.title}
            </CardTitle>
            {game.logo ? (
              <div className="relative h-12 w-16 shrink-0">
                <Image
                  src={game.logo}
                  alt={game.logoAlt ?? `${game.title} logo`}
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="flex min-h-44 flex-1 items-center justify-center px-4 py-5 sm:min-h-56">
          <div className="relative h-36 w-full overflow-hidden rounded-lg sm:h-64">
            <Image
              src={game.image}
              alt={game.imageAlt}
              fill
              unoptimized
              className="object-cover opacity-80 transition duration-200 group-hover:scale-105 group-hover:opacity-100"
            />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default GameCard
