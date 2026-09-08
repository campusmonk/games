export type GameCardConfig = {
  title: string
  href: string
  image: string
  imageAlt: string
  logo?: string
  logoAlt?: string
}

export const gameCards: GameCardConfig[] = [
  {
    title: "Accenture Games",
    href: "/accenture",
    image: "/acc.png",
    imageAlt: "Accenture games preview",
    logo: "/accenture.png",
    logoAlt: "Accenture logo",
  },
  {
    title: "Capgemini & Cognizant  Games",
    href: "/capgemini",
    image: "/cap.png",
    imageAlt: "Capgemini games preview",
    logo: "/capgeminiLogo.png",
    logoAlt: "Capgemini logo",
  },
  {
    title: "More Games",
    href: "/moreGames",
    image: "/moregames.gif",
    imageAlt: "Practice games preview",
    logo: "/game.png",
    logoAlt: "Games icon",
  },
]
