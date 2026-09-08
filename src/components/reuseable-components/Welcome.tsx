import Image from "next/image";

type WelcomeProps = {
  companyName: string;
  userName?: string;
  mascotSrc?: string;
};

export default function Welcome({
  companyName,
  mascotSrc = "/machine.webp",
}: WelcomeProps) {
  return (
    <section className="w-full px-4 pt-20 text-foreground sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-6xl items-start gap-4 sm:gap-6">
        <div className="relative h-24 w-24 shrink-0 sm:h-32 sm:w-32">
          <Image
            src={mascotSrc}
            alt=""
            fill
            priority
            unoptimized
            sizes="(min-width: 640px) 128px, 96px"
            className="object-contain [image-rendering:pixelated]"
          />
        </div>

        <div className="mt-6 max-w-3xl rounded-lg border border-border bg-card px-4 py-3 text-card-foreground shadow-pop-sm sm:mt-8 sm:px-5">
          <h1 className="font-game text-2xl leading-none text-card-foreground sm:text-4xl">
            Welcome, and start practicing with cognitive{" "}
            <span className="text-primary">{companyName} Games...</span>
          </h1>
        </div>
      </div>
    </section>
  );
}
