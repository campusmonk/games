import { createElement } from "react";

import HtmlAssistPage from "../HtmlAssistPage";

export default function AiAssistOnePage() {
  return createElement(HtmlAssistPage, {
    assistId: "assist-1",
    title: "AI Assist 1",
  });
}
