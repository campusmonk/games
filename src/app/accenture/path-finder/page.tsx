import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import PathFinderGame from "./logic";

export const metadata: Metadata = {
  title: "Path Finder | Accenture Cognitive Game",
  description:
    "Practice a timed 3x3 block path builder for Accenture-style cognitive challenges.",
  openGraph: {
    title: "Path Finder",
    description:
      "Rotate and re-route 3x3 arrow blocks to guide the rocket to the destination planet under time pressure.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Path Finder",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Path Finder",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "A timed 3x3 block manipulation path puzzle where players connect a directed route from rocket to planet.",
};

export default async function PathFinderPage() {
  const quota = await claimDailyAttempt("game", "path-finder");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 pb-14 pt-24 text-foreground sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PathFinderGame />
    </main>
  );
}
