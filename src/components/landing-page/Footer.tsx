import Image from "next/image";
import Link from "next/link";
import {
  BookOpenText,
  BriefcaseBusiness,
  Camera,
  Mail,
  MapPin,
  Phone,
  Send,
} from "lucide-react";

const mainMenuLinks = [
  { href: "/", label: "Home" },
  { href: "/capgemini", label: "Capgemini" },
  { href: "/cognizant", label: "Cognizant" },
  { href: "/accenture", label: "Accenture" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/profile", label: "Profile" },
  { href: "/docs", label: "Documentation" },
];

const socialLinks = [
  {
    href: "https://campusmonk.in/articles/",
    label: "Campusmonk Blogs",
    icon: BookOpenText,
  },
  {
    href: "https://www.instagram.com/hustlewithcampusmonk/",
    label: "Instagram",
    icon: Camera,
  },
  {
    href: "https://t.me/Campusmonk2025",
    label: "Telegram",
    icon: Send,
  },
  {
    href: "https://www.linkedin.com/company/campusmonk",
    label: "LinkedIn",
    icon: BriefcaseBusiness,
  },
];

const Footer = () => {
  return (
    <footer className="bg-secondary text-foreground">
      <div className="mx-auto grid max-w-8xl gap-10 px-4 py-12 sm:px-8 lg:grid-cols-[1.25fr_0.8fr_1fr] lg:px-10 lg:py-16">
        <section className="space-y-5">
          <Link href="/" className="inline-flex">
            <Image
              src="/fulllogo.png"
              alt="Campus Monk"
              width={260}
              height={84}
              className="h-auto w-52 object-contain sm:w-84"
            />
          </Link>
        <div className="mt-1 h-0.5 w-full max-w-2xl rounded-full bg-border shadow-[0_3px_0_0_color-mix(in_oklch,var(--foreground),transparent_88%)]" />
          <p className="max-w-xl font-inter text-sm leading-7 text-muted-foreground sm:text-base">
            Campus Monk is a dynamic learning platform empowering students and
            job seekers to confidently navigate placements, crack government
            exams, and accelerate their career journey.
          </p>
        </section>

        <section>
          <h2 className="font-game text-3xl leading-none text-foreground">
            Main Menu
          </h2>
          <nav className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 font-inter text-sm sm:text-base lg:grid-cols-1">
            {mainMenuLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>

        <section className="space-y-7">
          <div>
            <h2 className="font-game text-3xl leading-none text-foreground">
              Contact Info
            </h2>
            <div className="mt-5 space-y-4 font-inter text-sm text-muted-foreground sm:text-base">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
                <address className="not-italic leading-7">
                  Dehradun,
                  <br />
                  Uttarakhand, India - 248001
                </address>
              </div>
              <Link
                href="tel:+917500056600"
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Phone className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span>+91-7500056600</span>
              </Link>
              <Link
                href="mailto:team@campusmonk.in"
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Mail className="size-5 shrink-0 text-primary" aria-hidden="true" />
                <span>team@campusmonk.in</span>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="font-game text-3xl leading-none text-foreground">
              Join our community
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="inline-flex size-11 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/60 hover:text-primary"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="border-t border-border px-4 py-5 text-center font-inter text-sm text-muted-foreground sm:px-8">
        © {new Date().getFullYear()} Campus Monk. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
