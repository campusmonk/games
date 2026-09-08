import { createElement } from "react";

import HtmlRoundPage from "../HtmlRoundPage";

export default function ComprehensionPage() {
  return createElement(HtmlRoundPage, {
    htmlFile: "comprehension/cognizant_section4_comprehension.html",
    roundId: "comprehension",
    title: "Listening Comprehension",
  });
}
