import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { img } from "@/data/content";
import { DepositTable } from "./docspecial";

export const Route = createFileRoute("/docnormal")({
  head: () => pageHead("일반공급 안내"),
  component: Page,
});

const POINTS = [
  ["01", "수도권 전 지역 거주자 청약 가능", "모집공고일 현재 인천광역시, 서울특별시, 경기도 거주자. 인천광역시 50%, 기타 수도권 50%."],
  ["02", "만 19세 이상", "세대주와 세대원 모두 가능합니다."],
  ["03", "유주택자도 1순위", "주택 수와 관계없습니다."],
  ["04", "재당첨 제한 없음", "기존 당첨 사실과 무관. 다만 2년 내 가점제 당첨자와 그 세대는 추첨제로만 청약."],
  ["05", "통장 가입 12개월", "지역별·면적별 예치금을 충족할 때."],
];

function Page() {
  return (
    <Shell>
      <SubHero en="INFORMATION" title="일반공급 안내" crumbs="청약안내 / 일반공급 안내" />
      <article className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm leading-6 text-muted">
          청라 아크원 푸르지오는 인천광역시 서해구 비규제지역(비투기과열지역 및 비청약과열지역) 요건이 적용됩니다.
        </p>
        <Photo src={img("/resources/img/sub/02_일반공급.v4.jpg")} alt="일반공급 안내" className="mt-8 w-full" />
        <ol className="mt-12 grid gap-4">
          {POINTS.map(([n, title, body]) => (
            <li key={n} className="grid gap-2 border-t border-line py-4 md:grid-cols-[4rem_1fr]">
              <span className="font-serif text-xl">{n}</span>
              <div>
                <h2 className="font-medium">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{body}</p>
              </div>
            </li>
          ))}
        </ol>
        <DepositTable />
        <ul className="mt-8 space-y-3 text-sm leading-6">
          <li>주택공급에 관한 규칙 제28조. 전용 85㎡ 이하 가점제 40% / 추첨제 60%. 전용 85㎡ 초과 추첨제 100%.</li>
          <li>가점제 신청은 입주자모집공고일 기준 과거 2년 이내 가점제 당첨자와 그 세대원은 불가하고 추첨제로 청약.</li>
          <li>통장 변경·규모 변경·종전 통장의 종합저축 전환은 모집공고일 전일까지. 주택청약종합저축 예치금 충족과 지역 간 예치금 차액은 접수 당일까지입니다.</li>
          <li>가점: 무주택 기간은 만 30세 기준(만 30세 이전 혼인은 혼인신고일부터). 부양가족에 본인 제외. 나이는 모집공고일 만 나이. 배우자 분리세대의 직계존·비속 주택은 주택 수에 포함. 만 60세 이상 직계존속 주택 소유 시 부양가족 제외.</li>
        </ul>
      </article>
      <SourceNote />
    </Shell>
  );
}
