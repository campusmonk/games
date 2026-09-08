"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MenuIcon, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const gameLinks = [
  { href: "/accenture", label: "Accenture" },
  { href: "/capgemini", label: "Capgemini" },
  { href: "/moreGames", label: "More-games" },
];

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/leaderboard", label: "Leaderboard" },
  // { href: "/profile", label: "Profile" },
  { href: "/docs", label: "Documentation" },
  { href: "/communication-round", label: "Communication" },
  { href: "/debug", label: "Debugging" },
  { href: "/quiz", label: "Quiz" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const themeToggleLabel = isMounted
    ? `Switch to ${isDark ? "light" : "dark"} theme`
    : "Toggle theme";

  useEffect(() => {
    const mountFrame = requestAnimationFrame(() => {
      setIsMounted(true);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      cancelAnimationFrame(mountFrame);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        isScrolled
          ? "border-b border-border/70 bg-background/92 text-foreground shadow-lg shadow-black/10 backdrop-blur-xl dark:shadow-black/30"
          : "bg-transparent text-foreground"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4 sm:h-20 sm:px-8 lg:h-24 lg:px-10">
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3">
          <Image
            src="/logo1.png"
            alt="Logo"
            width={58}
            height={58}
            className="size-9 object-contain sm:size-12 lg:size-14.5"
          />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="gap-0">
         <NavigationMenuItem>
              {navLinks.map((link) => (
                <NavigationMenuLink
                  key={link.href}
                  render={<Link href={link.href} />}
                  className={`${navigationMenuTriggerStyle()} bg-transparent font-inter text-lg font-semibold text-current/85 ${
                    isScrolled
                      ? "drop-shadow-none hover:bg-accent/70 hover:text-foreground focus:bg-accent/70"
                      : "drop-shadow-halo hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10"
                  }`}
                >
                  {link.label}
                </NavigationMenuLink>
              ))}
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger
                className={`bg-transparent font-inter text-lg font-semibold text-current/85 ${
                  isScrolled
                    ? "drop-shadow-none hover:bg-accent/70 hover:text-foreground focus:bg-accent/70 data-[state=open]:bg-accent/70 data-[state=open]:text-foreground"
                    : "drop-shadow-halo hover:bg-foreground/10 hover:text-foreground focus:bg-foreground/10 data-[state=open]:bg-foreground/10 data-[state=open]:text-foreground"
                }`}
              >
                Games
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-44 rounded-md border border-border bg-popover p-2 text-popover-foreground shadow-xl">
                {gameLinks.map((link) => (
                  <NavigationMenuLink
                    key={link.href}
                    render={<Link href={link.href} />}
                    className="block rounded-md font-inter text-sm text-popover-foreground/80 hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                  </NavigationMenuLink>
                ))}
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon-lg"
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className={`border shadow-[0_2px_10px_rgba(0,0,0,0.25)] ${
              isScrolled
                ? "border-border bg-card/80 text-foreground hover:bg-accent hover:text-accent-foreground"
                : "border-foreground/20 bg-background/70 text-foreground hover:bg-accent hover:text-accent-foreground"
            }`}
            aria-label={themeToggleLabel}
            title={themeToggleLabel}
          >
            {isMounted && isDark ? (
              <Sun className="size-5" aria-hidden="true" />
            ) : (
              <Moon className="size-5" aria-hidden="true" />
            )}
          </Button>
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  className={`border shadow-[0_2px_10px_rgba(0,0,0,0.25)] md:hidden ${
                    isScrolled
                      ? "border-border bg-card/80 text-foreground hover:bg-accent hover:text-accent-foreground"
                      : "border-foreground/20 bg-background/70 text-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                  aria-label="Open navigation menu"
                />
              }
            >
              <MenuIcon className="size-5" />
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[min(20rem,calc(100vw-2rem))] border-l border-border bg-background p-0 text-foreground"
            >
              <SheetHeader className="border-b border-border p-4">
                <SheetTitle className="font-game text-3xl text-foreground">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-6 px-4 py-5">
                <div className="space-y-2">
                  <p className="font-inter text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Games
                  </p>
                  <div className="grid gap-2">
                    {gameLinks.map((link) => (
                      <SheetClose
                        key={link.href}
                        render={<Link href={link.href} />}
                        className="rounded-md px-3 py-3 font-inter text-base font-semibold text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                      >
                        {link.label}
                      </SheetClose>
                    ))}
                  </div>
                </div>
                <div className="grid gap-2">
                  {navLinks.map((link) => (
                    <SheetClose
                      key={link.href}
                      render={<Link href={link.href} />}
                      className="rounded-md px-3 py-3 font-inter text-base font-semibold text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                </div>
                <SheetClose
                  render={<Link href="/#all-games" />}
                  className="mt-auto inline-flex h-12 items-center justify-center rounded-lg border-2 border-pixel-ink bg-primary px-4 font-game text-2xl text-primary-foreground shadow-pixel-md transition-all hover:translate-x-px hover:translate-y-px hover:shadow-pixel-sm"
                >
                  Play Now
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
