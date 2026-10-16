"use client";
import { useParams } from "next/navigation";
import QuestionBrowser from "../../_components/QuestionBrowser";
export default function HistoryPage() {
  const params = useParams();
  return (
    <QuestionBrowser
      key={String(params.exam)}
      fixedExam={typeof params.exam === "string" ? params.exam : ""}
    />
  );
}
