import { readFileSync } from "node:fs";
import { join } from "node:path";

import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { requireUserAccess } from "@/lib/access/allowlist";
import {
  getAiAssistProgress,
  getPreviousAiAssist,
  isAiAssistUnlocked,
  type AiAssistId,
} from "@/lib/access/ai-assist-progress";
import { claimDailyAttempt } from "@/lib/access/daily-limits";

import AiAssistFrame from "./AiAssistFrame";
import AiAssistLocked from "./AiAssistLocked";

type HtmlAssistPageProps = {
  assistId: AiAssistId;
  title: string;
};

// Each assist lives in src/app/AI-assist/<assistId>/.
const assistFiles: Record<AiAssistId, { html: string; script: string }> = {
  "assist-1": { html: "coding-arena-index.html", script: "coding-arena-app.js" },
  "assist-2": { html: "coding-arena-v2-index.html", script: "coding-arena-v2-app.js" },
  "assist-3": { html: "coding-arena-v3-index.html", script: "coding-arena-v3-app.js" },
};

// The arena is dark by default and switches to light with body.light, so
// mirror the site theme onto that class and keep it in step with toggles.
const themeBridgeScript = `
<script>
  (function () {
    function isLightTheme() {
      try {
        var root = window.parent.document.documentElement;
        if (root.classList.contains("dark")) return false;
        if (root.classList.contains("light")) return true;
      } catch (error) {}

      return !(window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    }

    function applyTheme() {
      var isLight = isLightTheme();
      document.body.classList.toggle("light", isLight);
      var toggle = document.getElementById("themeToggle");
      if (toggle) toggle.textContent = isLight ? "\\u2600" : "\\u263E";
    }

    applyTheme();

    try {
      new MutationObserver(applyTheme).observe(window.parent.document.documentElement, {
        attributes: true,
        attributeFilter: ["class"]
      });
    } catch (error) {}
  })();
</script>
`;

function escapeInlineScript(script: string) {
  return script.replaceAll("</script", "<\\/script");
}

function prepareHtml(html: string, script: string) {
  // A replacer function keeps "$&"-style sequences in the script literal.
  return html.replace(
    /<script\s+src=["']app\.js["']><\/script>/,
    () => `<script>${escapeInlineScript(script)}</script>${themeBridgeScript}`,
  );
}

export default async function HtmlAssistPage({ assistId, title }: HtmlAssistPageProps) {
  const session = await requireUserAccess();
  const progress = await getAiAssistProgress(session.email);

  // Check the unlock before claiming, so opening a locked assist does not
  // spend one of the day's attempts.
  if (!isAiAssistUnlocked(assistId, progress.completed)) {
    return (
      <AiAssistLocked
        assistId={assistId}
        previousAssistId={getPreviousAiAssist(assistId)}
        storageError={progress.storageError}
      />
    );
  }

  const quota = await claimDailyAttempt("ai-assist", assistId);
  if (!quota.allowed) return <DailyLimitReached status={quota} />;

  const basePath = join(process.cwd(), "src/app/AI-assist", assistId);
  const files = assistFiles[assistId];
  const html = prepareHtml(
    readFileSync(join(basePath, files.html), "utf8"),
    readFileSync(join(basePath, files.script), "utf8"),
  );

  return (
    <main className="min-h-screen bg-background pt-16 sm:pt-20 lg:pt-24">
      <AiAssistFrame assistId={assistId} srcDoc={html} title={title} />
    </main>
  );
}
