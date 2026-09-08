import Image from "next/image";
import Link from "next/link";

type GameCardProps = {
  png: string;
  heading: string;
  p: string;
  href: string;
  imageAlt?: string;
  className?: string;
};

export default function GameCard({
  png,
  heading,
  p,
  href,
  imageAlt = "",
  className = "",
}: GameCardProps) {
  return (
    <Link
      href={href}
      className={`flex w-full max-w-[460px] items-center gap-5 rounded-2xl border border-border bg-card px-6 py-5 text-card-foreground shadow-pop-md transition hover:-translate-y-1 hover:border-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${className}`}
    >
      <div className="relative h-14 w-14 shrink-0">
        <Image
          src={png}
          alt={imageAlt}
          fill
          sizes="56px"
          className="object-contain"
        />
      </div>

      <div className="min-w-0">
        <h2 className="font-game text-2xl leading-none text-card-foreground sm:text-3xl">
          {heading}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-md">
          {p}
        </p>
      </div>
    </Link>
  );
}
