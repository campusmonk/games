"use client";

import { useEffect, useRef } from "react";

import type { AiAssistId } from "@/lib/access/ai-assist-progress";

import { completeAiAssistAction } from "./actions";

type AiAssistFrameProps = {
  assistId: AiAssistId;
  srcDoc: string;
  title: string;
};

export default function AiAssistFrame({ assistId, srcDoc, title }: AiAssistFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type !== "cm-ai-assist-finished") return;

      completeAiAssistAction(assistId).catch((error) => {
        console.error("Could not save AI Assist progress.", error);
      });
    }

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [assistId]);

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
