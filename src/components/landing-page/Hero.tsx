"use client"

import { Button } from '../ui/button';

const Hero = () => {
  const scrollToGames = () => {
    document.getElementById("all-games")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-svh w-full overflow-hidden bg-background text-foreground">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklch,var(--foreground),transparent_92%)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--foreground),transparent_92%)_1px,transparent_1px)] bg-[size:32px_32px]" />
      <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--background),var(--foreground)_18%),transparent)] dark:bg-[linear-gradient(to_bottom,color-mix(in_oklch,var(--background),black_24%),transparent)]" />
      <div className="absolute left-6 top-28 hidden h-24 w-24 rotate-6 rounded-lg border-4 border-foreground bg-primary shadow-solid-xl md:block" />
      <div className="absolute right-8 top-32 hidden h-16 w-16 -rotate-12 rounded-lg border-4 border-foreground bg-card shadow-primary-lg lg:block" />
      <div className="absolute bottom-10 left-8 hidden h-16 w-28 rounded-lg border-4 border-foreground bg-accent shadow-solid-lg lg:block" />
      <div className="absolute bottom-20 right-10 hidden h-24 w-24 rotate-12 rounded-lg border-4 border-foreground bg-secondary shadow-primary-xl md:block" />

      <div className="relative z-10 mx-auto flex min-h-svh max-w-6xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:py-28">
        <p className="font-game text-4xl leading-none text-muted-foreground drop-shadow-pop-sm sm:text-6xl lg:text-7xl">
          Start Now
        </p>
        <h1 className="mt-1 max-w-full rounded-lg border-4 border-foreground bg-card px-4 py-3 font-game text-5xl leading-[0.9] text-primary shadow-solid-xl sm:text-6xl lg:text-7xl">
          <span className="block sm:inline">Cognitive</span>
          <span className="block sm:inline"> Adventure</span>
        </h1>
        <p className="mt-6 max-w-[42rem] font-game text-2xl leading-tight text-foreground drop-shadow-pop-sm sm:text-4xl">
            Sharpen your mind with our engaging cognitive games!
        </p>
        
        <Button
          variant="pixel"
          size="lg"
          onClick={scrollToGames}
          className="mt-6 h-14 rounded-xl border-4 px-9 font-game text-2xl shadow-pixel-lg sm:h-16 sm:px-12 sm:text-3xl"
        >
          GET STARTED
        </Button>
      </div>
    </section>
  )
}

export default Hero
