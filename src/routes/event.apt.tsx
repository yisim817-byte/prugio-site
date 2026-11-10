import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

export const Route = createFileRoute("/event/apt")({
  head: () => pageHead("상가·오피스텔 사전등록 이벤트"),
  component: Page,
});

const STEPS = [
  "홈페이지 상가·오피스텔 사전등록",
  "오피스텔·상가 계약",
  "계약 시 백화점 상품권 지급",
];

const TERMS = [
  "대상: 이 홈페이지에서 상가·오피스텔 사전등록을 한 뒤 청라 아크원 푸르지오 오피스텔 또는 상가를 계약한 고객",
  "혜택: 백화점 상품권 50만원 (롯데·현대·신세계 중 1종 선택)",
  "이벤트 기간: 2026년 11월 20일(금)까지",
  "지급 시기: 오피스텔·상가 계약 시 지급합니다.",
  "1인(동일인·동일 휴대전화번호) 1회 지급합니다.",
  "계약 미체결·취소·해제 시 지급 대상에서 제외됩니다. 지급 후 해당 사유가 발생한 경우의 처리 기준은 담당자가 개별 안내합니다.",
  "제세공과금 처리 기준은 확정 후 담당자가 개별 안내합니다.",
  "이벤트 내용은 사전 공지 후 변경 또는 조기 종료될 수 있습니다.",
];

function Page() {
  return (
    <Shell>
      <SubHero en="EVENT" title="상가·오피스텔 사전등록 이벤트" crumbs="상가·오피스텔 이벤트" />
      <article className="ak-wrap ak-page">
        <div className="max-w-3xl">
        <p className="text-sm font-semibold text-forest">상가·오피스텔 이벤트</p>
        <h2 className="ak-h2 mt-3">백화점 상품권 50만원</h2>
        <p className="mt-3 text-sm">롯데 · 현대 · 신세계 중 선택</p>
        <p className="mt-6 border-y border-line py-4 leading-7">
          상가·오피스텔 사전등록 후 오피스텔·상가 계약 시 지급합니다. 이벤트 기간은 11월 20일(금)까지이며, 등록만으로 지급되지 않습니다.
        </p>

        <h3 className="ak-h3 mt-12">지급까지 순서</h3>
        <ol className="mt-4 border-t border-ink">
          {STEPS.map((step, index) => (
            <li key={step} className="grid grid-cols-[2.5rem_1fr] items-baseline gap-3 border-b border-line py-3 leading-7">
              <span className="font-serif text-xl">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <h3 className="ak-h3 mt-12">유의사항</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7">
          {TERMS.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-6">
          등록 확인 및 문의{" "}
          <a href={PROJECT_PHONE_TEL} className="ak-link ak-num">
            {PROJECT_PHONE_DISPLAY}
          </a>
        </p>
        <Link to="/register" className="ak-btn ak-btn--primary ak-btn--block mt-8">
          사전고객등록하기
        </Link>
        </div>
      </article>
    </Shell>
  );
}
