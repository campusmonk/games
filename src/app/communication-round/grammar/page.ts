import { createElement } from "react";

import HtmlRoundPage from "../HtmlRoundPage";

export default function GrammarPage() {
  return createElement(HtmlRoundPage, {
    htmlFile: "grammar/cognizant_section3_grammar.html",
    roundId: "grammar",
    title: "Grammar Correction",
  });
}
