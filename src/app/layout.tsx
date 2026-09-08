import type { Metadata } from "next";
import { Inter, Jersey_10 } from "next/font/google";
import "./globals.css";
import ThemeProvider from "./theme-provider";
import Navbar from "@/components/landing-page/Navbar";
// import Footer from "@/components/landing-page/Footer";

// Two families, not four. Geist Sans was the base font while 119 elements
// asked for font-inter, so Inter is now the single sans; Geist Mono was
// loaded app-wide for three usages and is a system mono stack instead.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
      className={`${inter.variable} ${gameFont.variable} h-full antialiased`}
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
