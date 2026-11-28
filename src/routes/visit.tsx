import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell } from "@/components/layout";
import { PLACES, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { SEO_ORIGIN } from "@/data/seo";
import { VISIT_ONLINE } from "@/data/prereg-mode";

// 작업지시서 29: /visit 는 전화 예약 상세페이지. 입력 폼(visit-register.tsx)은 붙이지 않는다.
const TITLE = `견본주택 방문예약 | 청라 아크원 푸르지오 ${PROJECT_PHONE_DISPLAY}`;
const DESCRIPTION = `청라 아크원 푸르지오 견본주택 방문은 사전 예약제입니다. ${PROJECT_PHONE_DISPLAY} 전화로 방문예약하시고, 방문고객등록 후 모델하우스 방문 시 스타벅스 커피 쿠폰을 증정합니다.`;
const URL = `${SEO_ORIGIN}/visit`;

const FAQ = [
  { q: "온라인으로도 방문예약이 되나요?", a: `견본주택 방문예약은 전화로만 받습니다. ${PROJECT_PHONE_DISPLAY}로 전화해 주세요.` },
  { q: "예약 없이 방문해도 되나요?", a: `견본주택 방문은 사전 예약제입니다. 방문 전 ${PROJECT_PHONE_DISPLAY}로 예약해 주세요.` },
  { q: "스타벅스 커피 쿠폰은 어떻게 받나요?", a: `전화로 방문고객등록 후 모델하우스를 방문하시면 증정합니다. 지급 기준·기간은 ${PROJECT_PHONE_DISPLAY}로 확인해 주세요. 사전 공지 후 변경·조기 종료될 수 있습니다.` },
  { q: "방문고객등록이 청약 신청인가요?", a: "아닙니다. 방문고객등록은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다. 청약은 한국부동산원 청약홈에서 신청합니다." },
  { q: "어떤 상품을 상담받을 수 있나요?", a: "아파트, 오피스텔, 상업시설을 상담받으실 수 있습니다. 예약 전화 때 관심 상품을 말씀해 주세요." },
] as const;

const SCHEDULE = [
  ["오피스텔 견본주택 오픈", "12.4(금) 예정"],
  ["오피스텔 청약", "12.7(월)"],
  ["오피스텔 당첨자 발표", "12.11(금)"],
  ["오피스텔 계약", "12.12(토)~12.13(일)"],
  ["아파트 선착순 계약", "12.26(토) 예정"],
] as const;

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ko_KR" },
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
              telephone: "+82-1533-9014",
              breadcrumb: { "@id": `${URL}#breadcrumb` },
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${URL}#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "홈", item: `${SEO_ORIGIN}/` },
                { "@type": "ListItem", position: 2, name: "방문예약", item: URL },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": `${URL}#faq`,
              mainEntity: FAQ.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  if (VISIT_ONLINE) return null;
  return <PhoneVisit />;
}

function PhoneVisit() {
  return (
    <Shell>
      <article className="vr">
        <header className="vr-hero">
          <div className="ak-wrap">
            <p className="vr-kicker">MODEL HOUSE RESERVATION</p>
            <h1>견본주택 방문예약</h1>
            <p className="vr-lead">견본주택 방문은 사전 예약제입니다. 방문예약은 전화로만 받습니다.</p>
            <a className="vr-cta" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
            <p className="vr-fine">상담 가능 시간은 전화로 안내해 드립니다.</p>
          </div>
        </header>

        <div className="ak-wrap vr-body">
          <section className="vr-benefit" aria-labelledby="vr-benefit-title">
            <h2 id="vr-benefit-title">방문 혜택</h2>
            <p className="vr-benefit__body">전화로 방문고객등록 후 모델하우스 방문 시 스타벅스 커피 쿠폰 증정</p>
            <p className="vr-note">※ 쿠폰 지급 기준·기간은 {PROJECT_PHONE_DISPLAY}로 확인해 주세요. 사전 공지 후 변경·조기 종료될 수 있습니다.</p>
            <p className="vr-note">※ 방문고객등록은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>
          </section>

          <section aria-labelledby="vr-steps-title">
            <h2 id="vr-steps-title">예약 방법</h2>
            <ol className="vr-steps">
              <li>
                <a href={PROJECT_PHONE_TEL}>
                  <span>01</span>
                  <strong>전화하기</strong>
                  <p>{PROJECT_PHONE_DISPLAY}로 전화해 주세요.</p>
                </a>
              </li>
              <li>
                <span>02</span>
                <strong>예약 정하기</strong>
                <p>희망 날짜·시간과 관심 상품(아파트·오피스텔·상업시설)을 말씀해 주세요.</p>
              </li>
              <li>
                <span>03</span>
                <strong>견본주택 방문</strong>
                <p>예약한 시간에 견본주택에 오시면 상담을 도와드립니다.</p>
              </li>
            </ol>
          </section>

          <section aria-labelledby="vr-products-title">
            <h2 id="vr-products-title">상담 가능 상품</h2>
            <div className="vr-cards">
              <a className="vr-card" href="/plans">
                <strong>오피스텔</strong>
                <p>987실 · 전용 105㎡·121㎡·136㎡ · 청약 12.7(월)</p>
              </a>
              <a className="vr-card" href="/103b">
                <strong>아파트</strong>
                <p>868세대 · 전용 84㎡·103㎡ · 103㎡B 선착순 안내</p>
              </a>
              <a className="vr-card" href="#popup_soon_commercial" data-popup-soon="commercial" aria-haspopup="dialog">
                <strong>상업시설</strong>
                <p>1~2층 근린생활시설 · 분양 예정</p>
              </a>
            </div>
            <p className="vr-more"><a href="/compare">아파트 vs 오피스텔 비교 보기 ›</a></p>
          </section>

          <section aria-labelledby="vr-schedule-title">
            <h2 id="vr-schedule-title">방문 전 확인하실 일정</h2>
            <table className="vr-table">
              <caption>방문 전 확인하실 일정</caption>
              <thead>
                <tr>
                  <th scope="col">구분</th>
                  <th scope="col">일정</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map(([name, when]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td>{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="vr-note">※ 일정은 사업주체 사정에 따라 변경될 수 있으며, 입주자모집공고문이 우선합니다. 최신 일정은 {PROJECT_PHONE_DISPLAY}로 확인해 주세요.</p>
          </section>

          <section aria-labelledby="vr-check-title">
            <h2 id="vr-check-title">방문 전 알아두시면 좋은 점</h2>
            <ul className="vr-checks">
              <li>관심 상품과 희망 평형을 예약 전화 때 말씀해 주시면 상담이 빠릅니다.</li>
              <li>청약 자격 상담이 필요하시면 세대 구성과 주택 소유 여부를 미리 확인해 오세요.</li>
              <li>예약 시간 변경·취소도 {PROJECT_PHONE_DISPLAY}로 연락해 주세요.</li>
            </ul>
          </section>

          <section aria-labelledby="vr-map-title">
            <h2 id="vr-map-title">모델하우스(견본주택) 위치</h2>
            <Photo
              src={PLACES[0].map}
              alt="청라 아크원 푸르지오 모델하우스 약도"
              className="vr-map"
              eager
            />
            <p className="vr-map__note">방문 전 대표번호로 예약해 주세요.</p>
            <a className="vr-cta vr-cta--sm" href={PROJECT_PHONE_TEL}>{PROJECT_PHONE_DISPLAY}</a>
          </section>

          <section className="vr-faq" aria-labelledby="vr-faq-title">
            <h2 id="vr-faq-title">자주 묻는 질문</h2>
            <dl>
              {FAQ.map((item) => (
                <div key={item.q}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="vr-band" aria-label="전화 예약">
          <div className="ak-wrap">
            <p>견본주택 방문은 사전 예약제입니다</p>
            <a className="vr-gold" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
          </div>
        </section>
      </article>
      <a className="vr-dock" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
    </Shell>
  );
}
