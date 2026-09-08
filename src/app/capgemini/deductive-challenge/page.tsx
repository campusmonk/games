import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import DeductiveChallengeGame from "./logic";

export const metadata: Metadata = {
  title: "Deductive Challenge | Capgemini Cognitive Game",
  description:
    "Practice symbol-based deduction puzzles for Capgemini-style cognitive game preparation.",
  openGraph: {
    title: "Gap Challenge",
    description:
      "Find the missing symbol in timed grid puzzles with increasing difficulty.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Gap Challenge",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Gap Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "A timed symbol deduction game for Capgemini cognitive game practice.",
};

export default async function DeductiveChallengePage() {
  const quota = await claimDailyAttempt("game", "deductive-challenge");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 pb-14 pt-24 text-foreground sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <DeductiveChallengeGame />
    </main>
  );
}
