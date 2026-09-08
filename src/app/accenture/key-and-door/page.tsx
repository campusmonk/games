import type { Metadata } from "next";
import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import KeyDoorGame from "./logic";

export const metadata: Metadata = {
  title: "Lock & Key Memory | Accenture Cognitive Game",
  description:
    "Practice a hidden-lock route memory game for Accenture-style cognitive challenges.",
  openGraph: {
    title: "Lock & Key Memory",
    description:
      "Collect the visible key, remember failed directions, and reach the exit through hidden one-way locks.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Lock and Key Memory",
      },
    ],
  },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Lock & Key Memory",
  operatingSystem: "Web",
  applicationCategory: "EducationalApplication",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
  },
  description:
    "A hidden directional lock memory game where players collect a key before escaping through the door.",
};

export default async function KeyDoorPage() {
  const quota = await claimDailyAttempt("game", "key-and-door");
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  return (
    <main className="min-h-screen overflow-hidden bg-background px-4 pb-14 pt-24 text-foreground sm:px-8 sm:pb-20 sm:pt-32 lg:px-12 lg:pt-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <KeyDoorGame />
    </main>
  );
}
