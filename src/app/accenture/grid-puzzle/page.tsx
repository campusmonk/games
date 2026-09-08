import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import GridGame from "./logic";

export const metadata: Metadata = {
  title: "Grid Challange | Accenture Cognitive Game",
  description:
    "Practice a fast grid memory and symmetry game for Accenture-style cognitive challenges.",
  openGraph: {
    title: "Grid Challange",
    description:
      "Watch dots, solve mirror patterns, and recall the sequence in this arcade-style cognitive game.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Grid Challange",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Grid Challange",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "A memory and symmetry grid puzzle for cognitive game practice.",
};

export default async function GridChallangePage() {
  const quota = await claimDailyAttempt("game", "grid-puzzle");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 pb-14 pt-24 text-foreground sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <GridGame />
    </main>
  );
}
