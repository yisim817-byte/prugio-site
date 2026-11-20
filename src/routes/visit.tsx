import { createFileRoute } from "@tanstack/react-router";
import { pageHead } from "@/components/layout";
import { VisitRegisterPage } from "@/components/visit-register";

// 작업지시서 22 (2026-11-21): 방문고객등록 상세페이지. 화면은 src/components/visit-register.tsx, 문구는 src/data/visit-register.ts.
// 접수는 작업지시서 13(2026-10-22)의 /api/visit → visit_reservations 를 그대로 쓴다. 예전 「모델하우스 방문예약」 화면 코드는 git 기록(2f4c266)에 있다.
export const Route = createFileRoute("/visit")({
  head: () => pageHead("방문고객등록"),
  component: VisitRegisterPage,
});
