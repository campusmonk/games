import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import MotionChallengeGame from "./logic";

export const metadata: Metadata = {
  title: "Motion Challenge | Capgemini Cognitive Game",
  description:
    "Practice a board-based motion puzzle for Capgemini-style cognitive game preparation.",
  openGraph: {
    title: "Motion Challenge",
    description:
      "Slide the ball and movable blocks through full board puzzles before the session timer ends.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Motion Challenge",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Motion Challenge",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "A sliding-board movement game for Capgemini cognitive game practice.",
};

export default async function MotionChallengePage() {
  const quota = await claimDailyAttempt("game", "motion-challenge");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="min-h-screen overflow-x-hidden bg-background px-4 pb-14 pt-20 text-foreground sm:px-8 sm:pb-20 sm:pt-28 lg:px-12 lg:pt-32">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <MotionChallengeGame />
    </main>
  );
}
