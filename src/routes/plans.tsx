import { createFileRoute } from "@tanstack/react-router";
import { PlanFigure, PriceBody } from "@/components/notice-sections";
import { Shell, SubHero, pageHead } from "@/components/layout";

// PM 지시(2026-10-22): 평면도(84㎡C·103㎡A)와 주택형별 공급금액을 한 페이지에서. 그림·캡션·금액표는 /overview·/changeinfo 와 같은 컴포넌트.
export const Route = createFileRoute("/plans")({
  head: () => pageHead("평면·분양가", "/plans"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="PLANS" title="평면·분양가" crumbs="평면·분양가" />
      <section className="ak-wrap ak-page notice-block" aria-label="평면·분양가">
        <div className="plans-grid">
          <PlanFigure file="plan-84c-redraw-v2" alt="청라 아크원 푸르지오 84㎡C 평면 안내도" type="84C" name="84㎡C" />
          <PlanFigure file="plan-103a-redraw-v2" alt="청라 아크원 푸르지오 103㎡A 평면 안내도" type="103A" name="103㎡A" />
        </div>
        <div className="notice-price-inline">
          <h2 className="notice-h3">주택형별 공급금액 (입주자모집공고문 6~20면)</h2>
          <PriceBody />
        </div>
      </section>
    </Shell>
  );
}
