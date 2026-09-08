import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";

import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";

type HtmlRoundPageProps = {
  htmlFile: string;
  roundId: string;
  title: string;
};

const themeBridgeStyles = `
<style>
  html.cm-dark body { background:#0B1220; color:#E5EAF3; }
  html.cm-dark .topbar { background:#071527; color:#F4F7FB; }
  html.cm-dark .topbar-mid { color:#C5D0E2; }
  html.cm-dark .timer-box { background:#10223D; border-color:#2F4F7A; color:#FFFFFF; }
  html.cm-dark .shell { background:#0B1220; }
  html.cm-dark .banner,
  html.cm-dark .panel,
  html.cm-dark .option,
  html.cm-dark .feedback,
  html.cm-dark .prompt-card,
  html.cm-dark .audio-card,
  html.cm-dark .explain {
    background:#111C2E;
    border-color:#2B3A50;
    color:#DDE6F3;
  }
  html.cm-dark .panel-head { background:#162238; border-color:#2B3A50; }
  html.cm-dark .panel-head h1,
  html.cm-dark .banner b,
  html.cm-dark .explain b,
  html.cm-dark .sentence,
  html.cm-dark .qsentence,
  html.cm-dark .qtext,
  html.cm-dark .prompt-text,
  html.cm-dark .final h2 { color:#F2F6FC; }
  html.cm-dark .qcount,
  html.cm-dark .play-hint,
  html.cm-dark .mic-status,
  html.cm-dark .final p,
  html.cm-dark .feedback-row .label { color:#B9C6D8; }
  html.cm-dark .plays-left,
  html.cm-dark .stage-label,
  html.cm-dark .prep-note,
  html.cm-dark .feedback-transcript,
  html.cm-dark .final-stat .l { color:#8796AB; }
  html.cm-dark .option:hover { background:#17263D; border-color:#3F79B8; }
  html.cm-dark .option .letter { border-color:#53637A; color:#C5D0E2; }
  html.cm-dark .option.correct { background:#0D2A20; border-color:#259765; }
  html.cm-dark .option.wrong { background:#331814; border-color:#D1563D; }
  html.cm-dark .btn { background:#101A2B; border-color:#3A4960; color:#DDE6F3; }
  html.cm-dark .btn.primary,
  html.cm-dark .play-btn,
  html.cm-dark .mic-btn { background:#2E73B8; border-color:#2E73B8; color:#FFFFFF; }
  html.cm-dark .btn.primary:hover,
  html.cm-dark .play-btn:hover,
  html.cm-dark .mic-btn:hover { background:#255E98; }
  html.cm-dark .qring .bg { stroke:#2B3A50; }
  html.cm-dark .dot-step { background:#3A4960; }
  html.cm-dark .final-stat .n,
  html.cm-dark .feedback-score { color:#F2F6FC; }
</style>
`;

const themeBridgeScript = `
<script>
  (function () {
    function isDarkTheme() {
      try {
        var parentRoot = window.parent && window.parent.document && window.parent.document.documentElement;
        if (parentRoot && parentRoot.classList.contains("dark")) return true;
        if (parentRoot && parentRoot.classList.contains("light")) return false;
      } catch (error) {}

      try {
        var storedTheme = window.parent && window.parent.localStorage && window.parent.localStorage.getItem("theme");
        if (storedTheme === "dark") return true;
        if (storedTheme === "light") return false;
      } catch (error) {}

      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function applyTheme() {
      document.documentElement.classList.toggle("cm-dark", isDarkTheme());
    }

    applyTheme();

    try {
      var parentRoot = window.parent.document.documentElement;
      new MutationObserver(applyTheme).observe(parentRoot, {
        attributes: true,
        attributeFilter: ["class"]
      });
    } catch (error) {}

    try {
      var media = window.matchMedia("(prefers-color-scheme: dark)");
      media.addEventListener("change", applyTheme);
    } catch (error) {}
  })();
</script>
`;

function addThemeBridge(html: string) {
  return html
    .replace("</head>", `${themeBridgeStyles}</head>`)
    .replace("</body>", `${themeBridgeScript}</body>`);
}

export default async function HtmlRoundPage({ htmlFile, roundId, title }: HtmlRoundPageProps) {
  const quota = await claimDailyAttempt("communication", roundId);
  if (!quota.allowed) return createElement(DailyLimitReached, { status: quota });

  const html = addThemeBridge(
    readFileSync(
      join(process.cwd(), "src/app/communication-round", htmlFile),
      "utf8",
    ),
  );

  return createElement(
    "main",
    {
      className: "min-h-screen bg-background pt-16 sm:pt-20 lg:pt-24",
    },
    createElement("iframe", {
      srcDoc: html,
      title,
      className:
        "block h-[calc(100vh-4rem)] min-h-[760px] w-full border-0 bg-background sm:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)]",
      sandbox:
        "allow-scripts allow-same-origin allow-forms allow-modals allow-popups",
      allow: "microphone; autoplay",
    }),
  );
}
