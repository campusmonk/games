import { createElement } from "react";

import HtmlRoundPage from "../HtmlRoundPage";

export default function ListenRepeatPage() {
  return createElement(HtmlRoundPage, {
    htmlFile: "listen-repeat/cognizant_section2_listen_repeat.html",
    roundId: "listen-repeat",
    title: "Listen and Repeat",
  });
}
