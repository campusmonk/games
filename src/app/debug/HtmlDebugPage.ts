import { readFileSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";

import DailyLimitReached from "@/components/reuseable-components/DailyLimitReached";
import { claimDailyAttempt } from "@/lib/access/daily-limits";
import HtmlDebugFrame from "./HtmlDebugFrame";

type HtmlDebugPageProps = {
  folder: string;
  roundId: string;
  storageKey: string;
  title: string;
};

const debugFrameStyles = `
<style>
  :root[data-theme="light"] {
    --bg: #f8fafc;
    --panel: #ffffff;
    --panel2: #f1f5f9;
    --line: #cbd5e1;
    --text: #111827;
    --muted: #526173;
    --yellow: #b77900;
    --amber: #c26a00;
    --cyan: #007a92;
    --danger: #c62828;
    --green: #15803d;
  }

  html, body {
    min-height: 100%;
    background: var(--bg);
    color-scheme: dark;
    transition: background-color 120ms ease, color 120ms ease;
  }

  :root[data-theme="light"] {
    color-scheme: light;
  }

  :root[data-theme="light"] body {
    background: radial-gradient(circle at 70% 0%, #eef4ff 0, #f8fafc 42%);
    color: var(--text);
  }

  :root[data-theme="light"] .top {
    background: #ffffff;
    box-shadow: 0 1px 0 rgba(15, 23, 42, 0.08);
  }

  :root[data-theme="light"] .sidebar,
  :root[data-theme="light"] .actions {
    background: #f8fafc;
  }

  :root[data-theme="light"] .card {
    background: linear-gradient(145deg, #ffffff, #f1f5f9);
  }

  :root[data-theme="light"] .qbtn,
  :root[data-theme="light"] .progress,
  :root[data-theme="light"] .timer,
  :root[data-theme="light"] .lang,
  :root[data-theme="light"] .taskbox,
  :root[data-theme="light"] .constraints,
  :root[data-theme="light"] .test,
  :root[data-theme="light"] .modalbox,
  :root[data-theme="light"] .stat {
    background: #ffffff;
  }

  :root[data-theme="light"] .qbtn.active,
  :root[data-theme="light"] .pill,
  :root[data-theme="light"] .lockbtn.is-locked {
    background: #fff7d6;
    color: #111827;
    box-shadow: 0 0 0 1px rgba(183, 121, 0, 0.28) inset;
  }

  :root[data-theme="light"] .editor-top,
  :root[data-theme="light"] .lines {
    background: #e9eef5;
  }

  :root[data-theme="light"] .editor-wrap,
  :root[data-theme="light"] textarea {
    background: #ffffff;
  }

  :root[data-theme="light"] .output {
    background: #f8fafc;
    border-color: #cbd5e1;
  }

  :root[data-theme="light"] .btn {
    background: #ffffff;
    color: #1f2937;
  }

  :root[data-theme="light"] .btn.run {
    background: #ecfeff;
    color: #006b80;
  }

  :root[data-theme="light"] .btn.primary {
    background: #f0b800;
    color: #111827;
  }

  :root[data-theme="light"] .statement,
  :root[data-theme="light"] .file,
  :root[data-theme="light"] textarea {
    color: #111827;
  }

  :root[data-theme="light"] .taskbox,
  :root[data-theme="light"] .constraints,
  :root[data-theme="light"] .test,
  :root[data-theme="light"] .info,
  :root[data-theme="light"] .modalbox p {
    color: #334155;
  }

  :root[data-theme="light"] .side-title,
  :root[data-theme="light"] .section-title,
  :root[data-theme="light"] .qmeta,
  :root[data-theme="light"] .status,
  :root[data-theme="light"] .rules,
  :root[data-theme="light"] .footerline,
  :root[data-theme="light"] .timer small,
  :root[data-theme="light"] .brand span {
    color: #64748b;
  }

  :root[data-theme="light"] .bar {
    background: #e2e8f0;
  }

  :root[data-theme="light"] .modal {
    background: rgba(15, 23, 42, 0.42);
  }
</style>
`;

const themeBridgeScript = `
<script>
  (function () {
    function currentTheme() {
      try {
        var root = window.parent.document.documentElement;
        if (root.classList.contains("dark")) return "dark";
        if (root.classList.contains("light")) return "light";
      } catch (error) {}

      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    function applyTheme(theme) {
      var normalizedTheme = theme === "dark" ? "dark" : "light";
      document.documentElement.dataset.theme = normalizedTheme;
      document.documentElement.style.colorScheme = normalizedTheme;
    }

    applyTheme(currentTheme());

    window.addEventListener("message", function (event) {
      if (!event.data || event.data.type !== "cm-debug-theme") return;
      applyTheme(event.data.theme);
    });
  })();
</script>
`;

function escapeInlineScript(script: string) {
  return script.replaceAll("</script", "<\\/script");
}

function prepareHtml(html: string, script: string, storageKey: string) {
  const scopedScript = script.replaceAll("cm_debug_state_native", storageKey);

  return html
    .replace("<html lang=\"en\">", "<html lang=\"en\" data-theme=\"dark\">")
    .replace("</head>", `${debugFrameStyles}${themeBridgeScript}</head>`)
    .replace(
      /<script\s+src=["']script\.js["']\s+defer><\/script>/,
      `<script>${escapeInlineScript(scopedScript)}</script>`,
    );
}

export default async function HtmlDebugPage({
  folder,
  roundId,
  storageKey,
  title,
}: HtmlDebugPageProps) {
  const quota = await claimDailyAttempt("debug", roundId);
  if (!quota.allowed) return createElement(DailyLimitReached, { status: quota });

  const basePath = join(process.cwd(), "src/app/debug", folder);
  const html = prepareHtml(
    readFileSync(join(basePath, "index.html"), "utf8"),
    readFileSync(join(basePath, "script.js"), "utf8"),
    storageKey,
  );

  return createElement(
    "main",
    {
      className: "min-h-screen bg-background pt-16 sm:pt-20 lg:pt-24",
    },
    createElement(HtmlDebugFrame, { srcDoc: html, title }),
  );
}
