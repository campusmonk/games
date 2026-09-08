import { createElement } from "react";

import HtmlRoundPage from "../HtmlRoundPage";

export default function ReadAloudPage() {
  return createElement(HtmlRoundPage, {
    htmlFile: "read-aloud/cognizant_section1_read_aloud.html",
    roundId: "read-aloud",
    title: "Read Sentence Aloud",
  });
}
