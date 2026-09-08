import { createElement } from "react";

import HtmlDebugPage from "../HtmlDebugPage";

export default function DebugAssessmentOnePage() {
  return createElement(HtmlDebugPage, {
    folder: "debugging_assessment2",
    roundId: "debug-assessment-1",
    storageKey: "cm_debug_assessment_1_state",
    title: "Debugging Assessment 1",
  });
}
