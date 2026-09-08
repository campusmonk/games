"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

type HtmlDebugFrameProps = {
  srcDoc: string;
  title: string;
};

export default function HtmlDebugFrame({ srcDoc, title }: HtmlDebugFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const theme =
      resolvedTheme ??
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    const frame = iframeRef.current;
    if (!frame) return;

    frame.contentWindow?.postMessage({ type: "cm-debug-theme", theme }, "*");

    try {
      const root = frame.contentDocument?.documentElement;
      if (root) {
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
      }
    } catch {}
  }, [resolvedTheme]);

  return (
    <iframe
      ref={iframeRef}
      srcDoc={srcDoc}
      title={title}
      className="block h-[calc(100vh-4rem)] min-h-[760px] w-full border-0 bg-background sm:h-[calc(100vh-5rem)] lg:h-[calc(100vh-6rem)]"
      sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
    />
  );
}
