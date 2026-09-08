import { createElement } from "react";

import HtmlRoundPage from "../HtmlRoundPage";

export default function OpenResponsePage() {
  return createElement(HtmlRoundPage, {
    htmlFile: "open-response/cognizant_section5_open_response.html",
    roundId: "open-response",
    title: "Open-ended Spoken Response",
  });
}
