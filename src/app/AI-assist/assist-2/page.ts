import { createElement } from "react";

import HtmlAssistPage from "../HtmlAssistPage";

export default function AiAssistTwoPage() {
  return createElement(HtmlAssistPage, {
    assistId: "assist-2",
    title: "AI Assist 2",
  });
}
