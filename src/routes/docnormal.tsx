import { createFileRoute } from "@tanstack/react-router";
import { Nb } from "@/components/chrome";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { DepositTable } from "@/components/role";
import { img } from "@/data/content";

export const Route = createFileRoute("/docnormal")({
  head: () => pageHead("일반공급 안내"),
  component: Page,
});

const POINTS = [
  [
    "01",
    "수도권 전 지역 거주자 청약 가능",
    "모집공고일 현재 인천광역시, 서울특별시, 경기도 거주자. 인천광역시 50%, 기타 수도권 50%.",
  ],
  ["02", "만 19세 이상", "세대주와 세대원 모두 가능합니다."],
  ["03", "유주택자도 1순위", "주택 수와 관계없습니다."],
  [
    "04",
    "재당첨 제한 없음",
    "기존 당첨 사실과 무관. 다만 2년 내 가점제 당첨자와 그 세대는 추첨제로만 청약.",
  ],
  ["05", "통장 가입 12개월", "지역별·면적별 예치금을 충족할 때."],
];

const RULES = [
  "주택공급에 관한 규칙 제28조. 전용 85㎡ 이하 가점제 40% / 추첨제 60%. 전용 85㎡ 초과 추첨제 100%.",
  "가점제 신청은 입주자모집공고일 기준 과거 2년 이내 가점제 당첨자와 그 세대원은 불가하고 추첨제로 청약.",
  "통장 변경·규모 변경·종전 통장의 종합저축 전환은 모집공고일 전일까지. 주택청약종합저축 예치금 충족과 지역 간 예치금 차액은 접수 당일까지입니다.",
  "가점: 무주택 기간은 만 30세 기준(만 30세 이전 혼인은 혼인신고일부터). 부양가족에 본인 제외. 나이는 모집공고일 만 나이. 배우자 분리세대의 직계존·비속 주택은 주택 수에 포함. 만 60세 이상 직계존속 주택 소유 시 부양가족 제외.",
];

function Page() {
  return (
    <Shell>
      <SubHero en="INFORMATION" title="일반공급 안내" crumbs="청약안내 / 일반공급 안내" />
      <article className="ak-wrap ak-page">
        <div className="ak-cols">
          <div>
            <h2 className="ak-h2">청약 요건</h2>
            <p className="ak-lead">
              청라 아크원 푸르지오는 인천광역시 서해구 비규제지역(비투기과열지역 및 비청약과열지역)
              요건이 적용됩니다.
            </p>
          </div>
          <div className="ak-stack">
            <div className="ak-index">
              {POINTS.map(([n, title, body]) => (
                <div key={n} className="ak-index__row">
                  <div>
                    <h3 className="ak-index__t">{title}</h3>
                    <p className="ak-index__d">
                      <Nb>{body}</Nb>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <DepositTable />
            <ul className="ak-list">
              {RULES.map((rule) => (
                <li key={rule}>
                  <Nb>{rule}</Nb>
                </li>
              ))}
            </ul>
            {/* 세로로 긴 공식 안내 이미지는 본문 뒤에 접어 둔다 */}
            <details className="ak-details">
              <summary>공식 안내 이미지 보기</summary>
              <div className="ak-details__body">
                <Photo
                  src={img("/resources/img/sub/02_일반공급.v4.jpg")}
                  alt="일반공급 안내"
                  className="w-full"
                />
              </div>
            </details>
          </div>
        </div>
      </article>
      <SourceNote />
    </Shell>
  );
}
