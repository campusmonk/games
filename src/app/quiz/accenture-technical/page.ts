import { createElement } from "react";

import HtmlQuizPage from "../HtmlQuizPage";

export default function AccentureTechnicalQuizPage() {
  return createElement(HtmlQuizPage, {
    folder: "accenture_technical",
    quizId: "quiz-accenture-technical",
    storageKey: "cm_quiz_accenture_technical_theme",
    title: "Accenture Technical Assessment Practice Quiz",
  });
}
