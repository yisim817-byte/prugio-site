import { createFileRoute, Link } from "@tanstack/react-router";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

export const Route = createFileRoute("/event/apt")({
  head: () => pageHead("아파트 사전고객등록 이벤트"),
  component: Page,
});

const STEPS = [
  "홈페이지 사전고객등록",
  "담당자 안내에 따른 MGM 등록 및 개인정보 제3자 제공 동의",
  "공식 청약 신청",
  "청약 당첨과 MGM 인정조건 확인",
  "계약 체결 후 지급 대상 확인",
  "조건 충족 시 계약 당일 백화점 상품권 지급",
];

const TERMS = [
  "대상: 본 홈페이지에서 사전고객등록을 완료하고 담당자 안내에 따라 MGM 등록(개인정보 제3자 제공 동의 포함)을 마친 고객 중, 청라 아크원 푸르지오 아파트 청약에 당첨되어 MGM 인정조건을 충족한 고객",
  "혜택: 백화점 상품권 30만원 (롯데·현대·신세계 중 1종 선택)",
  "지급 시기: 청약 당첨 및 MGM 인정조건 충족 확인 후 계약 당일 지급합니다.",
  "1인(동일인·동일 휴대전화번호) 1회 지급합니다.",
  "부적격 당첨, 계약 미체결·취소·해제 시 지급 대상에서 제외됩니다. 지급 후 해당 사유가 발생한 경우의 처리 기준은 담당자가 개별 안내합니다.",
  "다른 경로로 먼저 MGM 등록된 고객은 MGM 운영 기준에 따라 대상에서 제외될 수 있습니다.",
  "제세공과금 처리 기준은 확정 후 담당자가 개별 안내합니다.",
  "본 이벤트는 이 홈페이지 운영자(HUMANE)가 진행하며, 시행·시공사가 제공하는 혜택이 아닙니다.",
  "이벤트 내용은 사전 공지 후 변경 또는 조기 종료될 수 있습니다.",
  "사전고객등록은 공식 청약 신청이 아니며, 청약 자격과 일정은 입주자모집공고를 따릅니다.",
];

function Page() {
  return (
    <Shell>
      <SubHero en="APT EVENT" title="아파트 사전고객등록 이벤트" crumbs="아파트 이벤트" />
      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm tracking-[0.16em] text-forest">아파트 이벤트</p>
        <h2 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">백화점 상품권 30만원</h2>
        <p className="mt-3 text-sm tracking-wide">롯데 · 현대 · 신세계 중 선택</p>
        <p className="mt-6 border border-line p-4 text-sm leading-7">
          사전고객등록 후 청약 당첨 및 MGM 인정조건을 충족하고 계약하신 아파트 고객 대상입니다. 등록만으로 지급되지 않습니다.
        </p>
        <p className="mt-4 text-sm font-medium leading-6">※ 사전고객등록은 공식 청약 신청이 아닙니다.</p>

        <h3 className="mt-12 font-serif text-2xl">지급까지 순서</h3>
        <ol className="mt-4 space-y-3">
          {STEPS.map((step, index) => (
            <li key={step} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-line py-3 text-sm leading-6">
              <span className="font-serif text-xl">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 font-serif text-2xl">유의사항</h3>
        <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7">
          {TERMS.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-6">
          등록 확인 및 문의{" "}
          <a href={PROJECT_PHONE_TEL} className="font-medium text-forest">
            {PROJECT_PHONE_DISPLAY}
          </a>
        </p>
        <Link to="/register" className="mt-8 grid h-12 place-items-center bg-forest text-sm text-paper">
          사전고객등록하기
        </Link>
      </article>
    </Shell>
  );
}
