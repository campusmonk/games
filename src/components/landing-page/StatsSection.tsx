import Image from "next/image";
import { Star } from "lucide-react";

const stats = [
  {
    value: "158,000+",
    label: "Subscribers",
    image: "/youtube.png",
    alt: "YouTube",
  },
  {
    value: "1.4M+",
    label: "Watch Time (Hrs) in YouTube",
    image: "/human.png",
    alt: "Learners watching lessons",
  },
  {
    value: "40,000+",
    label: "App Downloads",
    image: "/playstore.png",
    alt: "Google Play",
    rating: "4.6",
  },
  {
    value: "50,000+",
    label: "Telegram Users",
    image: "/telegram.png",
    alt: "Telegram",
  },
];

const StatsSection = () => {
  return (
    <section className="relative overflow-hidden bg-secondary px-4 py-14 text-foreground sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="absolute inset-x-0 top-0 h-24 " />
      <div className="absolute inset-x-0 bottom-0 h-20 " />

      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-5xl text-center">
             <p className="font-game text-4xl leading-none text-foreground drop-shadow-[3px_3px_0_color-mix(in_oklch,var(--background),transparent_15%)] sm:text-4xl lg:text-5xl">
         Trusted by Thousands of Learners Nationwide
        </p>
          <div className="mx-auto mt-4 h-0.5 max-w-4xl rounded-full bg-border shadow-[0_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_88%)]" />
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => (
            <article
              key={stat.label}
              className="group flex min-h-48 items-center gap-5 rounded-lg border-4 border-foreground bg-primary p-5 text-primary-foreground shadow-[7px_7px_0_0_color-mix(in_oklch,var(--foreground),transparent_20%)] transition-transform hover:-translate-y-1 sm:min-h-52 sm:p-6 lg:flex-col lg:justify-center lg:text-center"
            >
              <div className="relative flex size-20 shrink-0 items-center justify-center rounded-lg bg-background/75 shadow-[4px_4px_0_0_color-mix(in_oklch,var(--foreground),transparent_15%)] sm:size-24">
                <Image
                  src={stat.image}
                  alt={stat.alt}
                  width={96}
                  height={96}
                  className="size-16 object-contain sm:size-20"
                />
              </div>

              <div className="min-w-0">
                <p className="font-game text-5xl leading-none text-primary-foreground sm:text-6xl">
                  {stat.value}
                </p>
                <p className="mt-2 font-inter text-lg font-semibold leading-snug text-primary-foreground/90 sm:text-xl">
                  {stat.label}
                </p>
                {stat.rating ? (
                  <div className="mt-2 flex items-center gap-1.5 font-inter text-base font-bold text-primary-foreground lg:justify-center">
                    <Star className="size-5 fill-yellow-300 text-primary-foreground" aria-hidden="true" />
                    <span>{stat.rating}</span>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
