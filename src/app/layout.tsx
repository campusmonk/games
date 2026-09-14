import type { Metadata } from "next";
import {
  DM_Sans,
  Instrument_Serif,
  Inter,
  Jersey_10,
  Montserrat,
  Playfair_Display,
  Poppins,
  Special_Gothic_Expanded_One,
  Syne,
} from "next/font/google";
import "./globals.css";
import ThemeProvider from "./theme-provider";
import Navbar from "@/components/landing-page/Navbar";
// import Footer from "@/components/landing-page/Footer";

// DM Sans is the site-wide body/UI font (--font-sans) and Instrument Serif is
// the heading font (--font-heading, used by shadcn title slots). The rest are
// loaded so any page can opt into them via font-<name> utilities. Jersey_10
// stays scoped to actual game UI (font-game) — it is not a global default.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-poppins",
  display: "swap",
});

const specialGothicExpandedOne = Special_Gothic_Expanded_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-special-gothic-expanded-one",
  display: "swap",
  adjustFontFallback: false,
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const gameFont = Jersey_10({
  subsets: ["latin"],
  variable: "--font-game",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Cognitive Games | Placement Practice",
    template: "%s | Cognitive Games",
  },
  description:
    "Practice placement-style cognitive games, communication rounds, debugging assessments, and technical quizzes.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${dmSans.variable} ${instrumentSerif.variable} ${inter.variable} ${montserrat.variable} ${playfairDisplay.variable} ${poppins.variable} ${specialGothicExpandedOne.variable} ${syne.variable} ${gameFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          {/* <Footer /> */}
        </ThemeProvider>
      </body>
    </html>
  );
}
