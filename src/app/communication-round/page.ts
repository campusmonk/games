import { createElement } from "react";

import GameCard from "@/components/reuseable-components/gameCard";
import Welcome from "@/components/reuseable-components/Welcome";

const h = createElement;

const communicationRounds = [
  {
    png: "/human.png",
    heading: "Read Aloud",
    p: "Read workplace sentences clearly and get pronunciation-style feedback.",
    href: "/communication-round/read-aloud",
    imageAlt: "Read aloud practice",
  },
  {
    png: "/youtube.png",
    heading: "Listen & Repeat",
    p: "Listen to business sentences, repeat them, and review accuracy scores.",
    href: "/communication-round/listen-repeat",
    imageAlt: "Listen and repeat practice",
  },
  {
    png: "/globe.svg",
    heading: "Grammar",
    p: "Choose the correct sentence form in timed grammar correction drills.",
    href: "/communication-round/grammar",
    imageAlt: "Grammar correction practice",
  },
  {
    png: "/globe.svg",
    heading: "Comprehension",
    p: "Play short spoken passages and answer listening comprehension questions.",
    href: "/communication-round/comprehension",
    imageAlt: "Listening comprehension practice",
  },
  {
    png: "/globe.svg",
    heading: "Open Response",
    p: "Record your answers to workplace questions and get feedback on clarity and style.",
    href: "/communication-round/open-response",
    imageAlt: "Open response practice",
  },
];

export default function CommunicationRoundPage() {
  return h(
    "main",
    {
      className:
        "mt-2 min-h-screen overflow-hidden bg-background text-foreground md:mt-10",
    },
    h(Welcome, { companyName: "Communication Round" }),
    h(
      "section",
      {
        className: "mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-8 lg:px-12",
      },
      h(
        "div",
        {
          className: "mb-8 flex flex-col gap-3 sm:mb-10",
        },
        h(
          "h1",
          {
            className:
              "font-game text-3xl leading-none text-foreground drop-shadow-[4px_4px_0_color-mix(in_oklch,var(--background),var(--foreground)_12%)] sm:text-4xl",
          },
          "Explore Rounds",
        ),
      ),
      h(
        "div",
        {
          className: "grid gap-5 md:grid-cols-2",
        },
        communicationRounds.map((round) =>
          h(GameCard, {
            key: round.href,
            png: round.png,
            heading: round.heading,
            p: round.p,
            href: round.href,
            imageAlt: round.imageAlt,
            className: "max-w-none",
          }),
        ),
      ),
    ),
  );
}
