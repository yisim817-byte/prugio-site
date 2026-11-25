import { createFileRoute } from "@tanstack/react-router";
import { Shell, SubHero } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { SEO_ORIGIN } from "@/data/seo";

const H1 = "청라 아크원 푸르지오 아파트 vs 오피스텔 비교";
const TITLE = "청라 아크원 푸르지오 아파트 vs 오피스텔 비교 | 가격·면적·청약자격·전매·중도금";
const DESCRIPTION =
  "청라 아크원 푸르지오 아파트 868세대와 오피스텔 987실을 공급금액·전용면적·전용률·주차·청약자격·전매·중도금 조건으로 비교했습니다. 입주자모집공고(2026.10.22)·오피스텔 분양광고(2026.11.20) 기준.";
const URL = `${SEO_ORIGIN}/compare`;
const LEAD =
  "청라 아크원 푸르지오는 한 단지 안에 아파트 868세대와 오피스텔 987실을 함께 공급합니다. 두 상품의 공급금액·넓이·청약자격·전매·중도금 조건을 공고 원문 기준으로 나란히 정리했습니다.";

const ROWS: ReadonlyArray<readonly [string, string, string]> = [
  ["규모", "868세대 · 최고 44층", "987실 · 3개 동(301~303동) · 최고 49층"],
  ["타입(전용)", "84㎡ 4개 타입(84A~84D) · 103㎡ 2개 타입(103A·103B)", "105㎡ 423실 · 121㎡ 282실 · 136㎡ 282실"],
  ["가장 넓은/좁은 전용", "최대 103.99㎡(103B)", "최소 105.85㎡(105OA)"],
  ["공급금액", "84㎡ 8억 3,780만~9억 2,070만원 · 103㎡ 10억 8,880만~11억 7,100만원 (발코니 확장비·옵션 별도)", "7억 7,140만~14억 500만원 (부가세 포함, 옵션 별도) · 105㎡ 7억 7,140만~10억 4,350만 · 121㎡ 9억 2,280만~12억 3,690만 · 136㎡ 10억 8,600만~14억 500만"],
  ["전용률(전용÷계약면적)", "44.9~45.3%", "47.7~48.4%"],
  ["주차", "세대당 약 1.60대", "실당 약 1.72대"],
  ["청약자격", "청약통장 필요(1순위 12개월 + 예치금), 인천 거주자 50% 우선", "청약통장·거주지역 무관, 만 19세 이상, 타입별 1건씩"],
  ["당첨자 선정", "가점제·추첨제(84㎡ 가점 40%·추첨 60%, 103㎡ 추첨 100%)", "한국부동산원 무작위 전산추첨"],
  ["전매", "소유권이전등기일까지 제한(최대 3년) · 재당첨 제한 10년", "전매제한 기간 없음(분양광고 기준, 사업주체 동의 후 권리의무승계)"],
  ["계약금", "5% (1차 1,000만원 계약 시 · 2차 30일 이내)", "5% (1차 1,000만원 계약 시 · 2차 30일 이내)"],
  ["중도금", "60% · 이자후불제 조건 융자알선 예정", "60% · 무이자 조건 융자알선 예정(대출 개시일~최초 입주개시일 전일)"],
  ["잔금", "35% (입주 시)", "35% (입주 지정일)"],
  ["입주 예정", "2031년 8월 예정", "2031년 8월 예정"],
  ["취득세", "주택 취득세율 적용(보유 주택 수·금액 구간별로 다름)", "4.6%(취득세·지방교육세·농어촌특별세 포함)"],
  ["커뮤니티", "일부 부대복리시설은 아파트·오피스텔 공동 사용", "같음"],
  ["지금 진행 중", "예비당첨자 추첨 11.28(토) 예정 · 103㎡B 선착순 11.28(토) 예정", "청약 12.7(월) 09:00~17:30 청약Home · 당첨자 발표 12.11(금) · 계약 12.12(토)~13(일)"],
];

const CHECKS = [
  "청약통장이 없거나 거주지 요건이 맞지 않으면 → 오피스텔 청약(12.7) 일정을 확인하세요.",
  "아파트 예비당첨자이거나 103㎡B를 찾고 있다면 → 11.28(토) 예정 일정과 참여의향서 접수 여부를 확인하세요.",
  "세금·주택 수는 보유 현황과 사용 용도에 따라 달라지므로 계약 전에 세무 전문가와 확인하세요.",
];

const FINE = [
  "※ 아파트는 입주자모집공고(2026.10.22), 오피스텔은 분양광고(2026.11.20) 기준이며 최종 내용은 공고 원문과 공급계약서가 우선합니다.",
  "※ 전용률·주차는 공고 면적표와 주차 대수로 계산한 값입니다. 조망은 동·라인·층별로 다릅니다.",
  "※ 중도금 조건은 정부 정책·금융권 사정에 따라 변경될 수 있으며 대출 가능 여부는 금융기관 심사로 결정됩니다.",
  "※ 취득세 등 세금은 개인별로 다르며 이 페이지는 세무 자문이 아닙니다.",
];

function faqs(phone: string) {
  return [
    { q: "아파트와 오피스텔 중 어느 쪽 전용면적이 더 넓나요?", a: "오피스텔 가장 작은 타입(105OA, 전용 105.85㎡)이 아파트 가장 큰 타입(103B, 전용 103.99㎡)보다 넓습니다. 전용률은 오피스텔 47.7~48.4%, 아파트 44.9~45.3%입니다(공고 면적표 기준 계산)." },
    { q: "오피스텔 청약에 청약통장이 필요한가요?", a: "필요하지 않습니다. 만 19세 이상이면 거주지역과 관계없이 청약할 수 있으며, 청약은 2026년 12월 7일(월) 09:00~17:30 청약Home에서 받습니다." },
    { q: "전매제한은 어떻게 다른가요?", a: "아파트는 소유권이전등기일까지(최대 3년) 전매가 제한됩니다. 오피스텔은 분양광고 기준 전매제한 기간이 없으며, 전매는 사업주체 동의를 받아 권리의무승계 방식으로 합니다. 관련 법령이 바뀌면 달라질 수 있습니다." },
    { q: "중도금 조건은 어떻게 되나요?", a: "둘 다 중도금 60%를 융자알선할 예정입니다. 아파트는 이자후불제, 오피스텔은 무이자 조건입니다. 정부 정책·금융권 사정에 따라 변경될 수 있고 대출 가능 여부는 금융기관 심사로 결정됩니다." },
    { q: "지금 아파트는 어떤 방법으로 계약할 수 있나요?", a: `예비당첨자 추첨과 103㎡B 선착순 공급이 2026년 11월 28일(토) 진행 예정입니다. 세부 일정은 개별 안내하며, 문의는 ${phone}로 해 주세요.` },
  ];
}

export const Route = createFileRoute("/compare")({
  head: () => {
    const faq = faqs(PROJECT_PHONE_DISPLAY);
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESCRIPTION },
        { name: "robots", content: "index,follow" },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESCRIPTION },
        { property: "og:url", content: URL },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: URL }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `${URL}#webpage`,
                name: TITLE,
                description: DESCRIPTION,
                url: URL,
                inLanguage: "ko-KR",
                dateModified: "2026-11-25",
                breadcrumb: { "@id": `${URL}#breadcrumb` },
              },
              {
                "@type": "BreadcrumbList",
                "@id": `${URL}#breadcrumb`,
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "청라 아크원 푸르지오", item: SEO_ORIGIN },
                  { "@type": "ListItem", position: 2, name: "아파트 vs 오피스텔 비교", item: URL },
                ],
              },
            ],
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
          }),
        },
      ],
    };
  },
  component: Page,
});

function Page() {
  const faq = faqs(PROJECT_PHONE_DISPLAY);
  return (
    <Shell>
      <SubHero title={H1} crumbs="청약안내 / 아파트 vs 오피스텔 비교" />
      <article className="ak-wrap ak-page cmp-page">
        <p className="ak-lead">{LEAD}</p>
        <h2 className="ak-h2">한눈에 비교</h2>
        <div className="cmp-scroll">
          <table className="ak-tbl">
            <caption className="cmp-caption">아파트와 오피스텔 비교</caption>
            <thead>
              <tr>
                <th scope="col">항목</th>
                <th scope="col">아파트</th>
                <th scope="col">오피스텔</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map(([k, a, b]) => (
                <tr key={k}>
                  <th scope="row">{k}</th>
                  <td>{a}</td>
                  <td>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <h2 className="ak-h2">같은 2층이면 얼마나 다를까</h2>
        <p>아파트 103㎡B 201동 1호 2층 11억 950만원 / 오피스텔 105㎡OA 301동 3호 2층 7억 7,140만원 → 차이 3억 3,810만원</p>
        <p>아파트 103㎡와 오피스텔 105㎡를 같은 층끼리 비교하면 차이는 1억 6,100만~3억 3,810만원입니다(층·호실별로 다름).</p>
        <small>특정 호실끼리 비교한 예시이며 실제 공급금액은 타입·층·호실별로 다릅니다.</small>
        <h2 className="ak-h2">고를 때 확인할 것</h2>
        <ul>
          {CHECKS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
        <p>
          <a className="ak-btn ak-btn--primary" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
        </p>
        <p><a href="/visit">견본주택 위치 안내</a></p>
        <h2 className="ak-h2">자주 묻는 질문</h2>
        <div className="b103-faq">
          {faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
        <ul className="b103-notes">
          {FINE.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </article>
    </Shell>
  );
}
