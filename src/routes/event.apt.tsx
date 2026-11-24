import { createFileRoute, redirect } from "@tanstack/react-router";

// 2026-11-24 PM 지시: 상가·오피스텔 사전등록 이벤트 종료 — 이 주소는 견본주택 안내(/event)로 보낸다.
export const Route = createFileRoute("/event/apt")({
  beforeLoad: () => {
    throw redirect({ to: "/event", replace: true });
  },
});
