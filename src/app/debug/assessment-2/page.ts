import { createElement } from "react";

import HtmlDebugPage from "../HtmlDebugPage";

export default function DebugAssessmentTwoPage() {
  return createElement(HtmlDebugPage, {
    folder: "debugging_assessment",
    roundId: "debug-assessment-2",
    storageKey: "cm_debug_assessment_2_state",
    title: "Debugging Assessment 2",
  });
}
