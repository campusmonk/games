import Image from "next/image";
import { Smartphone } from "lucide-react";

const AppDownloadSection = () => {
  return (
    <section className="bg-background px-4 py-14 text-foreground sm:px-8 sm:py-18 lg:px-12 lg:py-20">
      <div className="mx-auto flex max-w-7xl flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 rounded-lg border-4 border-foreground bg-primary px-5 py-2 font-inter text-base font-extrabold text-primary-foreground shadow-solid-md sm:text-lg">
          <Smartphone className="size-5" aria-hidden="true" />
          Mobile Access
        </div>

        <h2 className="mt-6 font-game text-5xl leading-none text-foreground drop-shadow-pop-md sm:text-4xl lg:text-5xl">
          Download Our App
        </h2>
        <div className="mt-4 h-0.5 w-full max-w-3xl rounded-full bg-border shadow-[0_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_88%)]" />

        <p className="mt-8 max-w-5xl font-inter text-lg font-semibold leading-relaxed text-muted-foreground sm:text-xl lg:text-2xl">
          Take your learning on the go. Download our app from the App Store or Google Play and access free resources, courses, and updates anytime, anywhere.
        </p>

        <div className="mt-10 flex w-full max-w-4xl flex-col gap-5 sm:flex-row sm:justify-center">
          <a
            href="https://play.google.com/store/apps/details?id=co.lynde.bfwhv"
            aria-label="Get it on Google Play"
            className="group flex min-h-24 items-center justify-center gap-4 rounded-lg border-4 border-foreground bg-card px-6 py-4 text-card-foreground shadow-solid-lg transition-transform hover:-translate-y-1 hover:bg-muted sm:min-w-80"
          >
            <Image
              src="/playstore.png"
              alt=""
              width={64}
              height={64}
              className="size-12 object-contain sm:size-14 hover:scale-102"
            />
            <span className="text-left">
              <span className="block font-inter text-sm font-black uppercase leading-none tracking-normal">
                Get it on
              </span>
              <span className="mt-1 block font-inter text-2xl font-black leading-none sm:text-2xl">
                Google Play
              </span>
            </span>
          </a>

          <a
            href="https://apps.apple.com/in/app/myinstitute/id1472483563"
            aria-label="Download on the App Store"
            className="group flex min-h-24 items-center justify-center gap-4 rounded-lg border-4 border-foreground bg-card px-6 py-4 text-card-foreground shadow-solid-lg transition-transform hover:-translate-y-1 hover:bg-muted sm:min-w-80"
          >
                      <Image
              src="/app-store.png"
              alt=""
              width={64}
              height={64}
              className="size-12 object-contain sm:size-14 hover:scale-102"
            />
            <span className="text-left">
              <span className="block font-inter text-sm font-black uppercase leading-none tracking-normal">
                Download on the
              </span>
              <span className="mt-1 block font-inter text-2xl font-black leading-none sm:text-2xl">
                App Store
              </span>
            </span>
          </a>
        </div>

        {/* <div className="mt-8 flex items-center gap-2 font-inter text-sm font-bold text-white/60">
          <Download className="size-4" aria-hidden="true" />
          <span>Free download for learners</span>
        </div> */}
      </div>
    </section>
  );
};

export default AppDownloadSection;
