import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import BubbleMathGame from "./logic";

export const metadata: Metadata = {
  title: "Bubble Math | Accenture Cognitive Game",
  description:
    "Practice a fast arithmetic ordering game for Accenture-style cognitive challenges.",
  openGraph: {
    title: "Bubble Math",
    description:
      "Solve expressions and pop bubbles from lowest to highest or highest to lowest before time runs out.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Bubble Math",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bubble Math",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "An arithmetic ordering bubble game for cognitive game practice.",
};

export default async function BubbleMathPage() {
  const quota = await claimDailyAttempt("game", "bubble-math");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 pb-14 pt-24 text-foreground sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <BubbleMathGame />
    </main>
  );
}
