import { createFileRoute } from "@tanstack/react-router";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { VisitRegisterPage } from "@/components/visit-register";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { VISIT_ONLINE } from "@/data/prereg-mode";

// 방문 폼은 VISIT_ONLINE 이 true 일 때만 붙인다. 폼 코드는 visit-register.tsx 에 그대로 둔다.
export const Route = createFileRoute("/visit")({
  head: () => pageHead("방문예약"),
  component: Page,
});

function Page() {
  if (!VISIT_ONLINE) return <PhoneVisit />;
  return <VisitRegisterPage />;
}

function PhoneVisit() {
  return (
    <Shell>
      <SubHero title="방문예약" crumbs="방문예약" />
      <main className="ak-wrap ak-page">
        <p className="ak-lead">견본주택 방문예약은 전화로만 받습니다.</p>
        <p>
          <a className="ak-btn ak-btn--primary visit-phone__cta" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
        </p>
        <p>전화로 방문고객등록 후 모델하우스 방문 시 스타벅스 커피 쿠폰 증정</p>
        <p>인천광역시 서해구 청라동 87-1</p>
      </main>
    </Shell>
  );
}
