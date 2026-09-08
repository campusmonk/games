import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import QuickMathGame from "./logic";

export const metadata: Metadata = {
  title: "Quick Math | Capgemini Cognitive Game",
  description:
    "Practice quick arithmetic digit puzzles for Capgemini-style cognitive game preparation.",
  openGraph: {
    title: "Quick Math",
    description:
      "Fill missing digits in arithmetic equations under a timer with three lives.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Quick Math",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Quick Math",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "A timed arithmetic digit puzzle game for Capgemini cognitive game practice.",
};

export default async function QuickMathPage() {
  const quota = await claimDailyAttempt("game", "quick-math");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 pb-14 pt-24 text-foreground sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <QuickMathGame />
    </main>
  );
}
