import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";

import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";

type HtmlQuizPageProps = {
  folder: string;
  quizId: string;
  storageKey: string;
  title: string;
};

const themeBridgeScript = `
<script>
  (function () {
    function isDarkTheme() {
      try {
        var parentRoot = window.parent.document.documentElement;
        if (parentRoot.classList.contains("dark")) return true;
        if (parentRoot.classList.contains("light")) return false;
      } catch (error) {}

      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    function applyTheme() {
      var theme = isDarkTheme() ? "dark" : "light";

      document.documentElement.style.colorScheme = theme;
      document.body.classList.toggle("dark", theme === "dark");

      try {
        localStorage.setItem("cm_acc_theme", theme);
      } catch (error) {}

      try {
        if (typeof state === "object" && state) state.theme = theme;
      } catch (error) {}
    }

    applyTheme();
    document.addEventListener("DOMContentLoaded", applyTheme);

    try {
      new MutationObserver(applyTheme).observe(window.parent.document.documentElement, {
        attributes: true,
        attributeFilter: ["class"]
      });
    } catch (error) {}

    try {
      window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", applyTheme);
    } catch (error) {}
  })();
</script>
`;

function escapeInlineScript(script: string) {
  return script.replaceAll("</script", "<\\/script");
}

function prepareHtml(html: string, script: string, storageKey: string) {
  const scopedScript = script.replaceAll("cm_acc_theme", storageKey);

  return html
    .replace(
      /<script\s+src=["']app\.js["']\s*(?:defer\s*)?><\/script>/,
      `<script>${escapeInlineScript(scopedScript)}</script>`,
    )
    .replace("</body>", `${themeBridgeScript.replaceAll("cm_acc_theme", storageKey)}</body>`);
}

export default async function HtmlQuizPage({
  folder,
  quizId,
  storageKey,
  title,
}: HtmlQuizPageProps) {
  const quota = await claimDailyAttempt("game", quizId);
  if (!quota.allowed) return createElement(DailyLimitReached, { status: quota });

  const basePath = join(process.cwd(), "src/app/quiz", folder);
  const html = prepareHtml(
    readFileSync(join(basePath, "index.html"), "utf8"),
    readFileSync(join(basePath, "app.js"), "utf8"),
    storageKey,
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
      sandbox: "allow-scripts allow-same-origin allow-forms allow-modals",
    }),
  );
}
