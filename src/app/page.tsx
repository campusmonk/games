import Hero from "@/components/landing-page/Hero";
import GameSection from "@/components/landing-page/gameSection";
import StatsSection from "@/components/landing-page/StatsSection";
import AppDownloadSection from "@/components/landing-page/AppDownloadSection";

export default function Home() {
  return (
    <div>


      {/*  Hero */}
      <Hero />

      {/* Games */}
      <GameSection />

      {/* Stats */}
      <StatsSection />

      {/* App Download */}
      <AppDownloadSection />

    </div>
  );
}
