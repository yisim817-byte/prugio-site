import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { img } from "@/data/content";

export const Route = createFileRoute("/changeinfo")({
  head: () => pageHead("변경된 청약제도"),
  component: Page,
});

const TIPS = [
  "신생아 특별공급 10% 신설. 화면 표기 2026.06.15 시행. 전용 85㎡ 이하 공급세대수의 10% 범위. 태아·입양 포함, 2세 미만 자녀, 혼인 7년과 무관.",
  "전용 85㎡ 이하 무주택 기준 확대. 화면은 「비아파트」(단독·다세대·연립·도시형 생활주택)라고 적음. 수도권 5억원, 비수도권 3억원, 공시가격. 해당 주택 또는 분양권 등 1호 또는 1세대만 소유한 경우.",
  "부부 모두 특별공급 청약 가능. 예: 본인 신혼부부, 배우자 생애최초. 둘 다 당첨이면 먼저 신청한 건이 당첨.",
  "생애최초: 배우자가 혼인 전 주택을 소유한 사실이 있어도 가능합니다. 조건은 혼인 신고 전후 구분을 따릅니다.",
  "신혼부부: 혼인 전 당첨이면 생애최초를 한 번 더, 혼인 후 당첨이면 신혼부부를 한 번 더. 신혼부부 1회 한도.",
  "다자녀·신혼부부·노부모·신생아: 2024.06.19 이후 출생 자녀가 있으면 기존주택 처분 조건으로 청약 가능. 세대 기준 1회.",
  "다자녀 기본요건: 3자녀 이상에서 2자녀 이상으로 적힘.",
  "일반공급 1순위 배우자 통장 합산 예: 본인 12년 14점 + 배우자 2년 3점 = 17점. 합산해도 최대 17점.",
  "노부모 특별공급·가점제 동점 시 추첨 대신 청약통장 장기 가입자가 우선합니다.",
  "신생아 표: 전용 85㎡ 이하 10%. 1단계 우선 50%, 2단계 일반 20%, 3단계 추첨 30%.",
  "신혼부부 표: 공급 23%→15%, 우선 25%→50%, 일반 25%→20%, 추첨 50%→30%.",
  "생애최초 표: 공급 19%→17%, 우선 35%→50%, 일반 15%→20%, 추첨 30%→30%.",
  "혼인 특례는 본인 기준 1회, 출산 특례는 세대 기준 1회로 적힘.",
  "당첨자발표일이 다른 주택은 빠른 당첨만 유효. 같은 주택의 부부 중복은 접수일시가 빠른 건. 부부 외 세대원 중복은 모두 부적격.",
];

function Page() {
  return (
    <Shell>
      <SubHero en="INFORMATION" title="변경된 청약제도" crumbs="청약안내 / 변경된 청약제도" />
      <article className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-sm leading-6 text-muted">
          입주자모집공고와 청약홈이 우선합니다.
        </p>
        <Photo
          src={img("/resources/img/sub/01_변경된_청약제도.v4.jpg")}
          alt="변경된 청약제도 안내"
          className="mt-8 w-full"
        />
        <h2 className="mt-12 font-serif text-2xl">주요 내용</h2>
        <ul className="mt-6 space-y-3 text-sm leading-6">
          {TIPS.map((tip) => (
            <li key={tip} className="border-t border-line pt-3">{tip}</li>
          ))}
        </ul>
        <p className="mt-8 text-sm leading-6 text-muted">
          오류가 있으면 관계 법령이 우선하고, 자격 미숙지와 착오 신청의 책임은 청약자 본인에게 있습니다.
        </p>
      </article>
      <SourceNote />
    </Shell>
  );
}
