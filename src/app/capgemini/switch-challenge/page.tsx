import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import ShapeSwitchGame from "./logic2";

export const metadata: Metadata = {
  title: "Switch Challenge | Capgemini Cognitive Game",
  description:
    "Practice operator switching puzzles for Capgemini-style cognitive game preparation.",
  openGraph: {
    title: "Switch Challenge",
    description:
      "Choose the operator that makes each equation true before the timer runs out.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Switch Challenge",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Switch Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "A timed operator selection game for Capgemini cognitive game practice.",
};

export default async function SwitchChallengePage() {
  const quota = await claimDailyAttempt("game", "switch-challenge");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4 py-16 text-foreground">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ShapeSwitchGame />
    </main>
  );
}
