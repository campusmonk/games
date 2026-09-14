import { createElement } from "react";

import HtmlAssistPage from "../HtmlAssistPage";

export default function AiAssistThreePage() {
  return createElement(HtmlAssistPage, {
    assistId: "assist-3",
    title: "AI Assist 3",
  });
}
