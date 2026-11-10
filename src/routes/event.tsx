import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { SEO_ORIGIN } from "@/data/seo";

const DESC = "청라 아크원 푸르지오 견본주택 안내(별도 공지 시까지 운영)와 청약·당첨 고객 이벤트.";
const TITLE = "견본주택 안내 · 이벤트 | 청라 아크원 푸르지오";

export const Route = createFileRoute("/event")({
  component: EventGate,
  head: ({ matches }) => {
    const leaf = matches[matches.length - 1];
    if (leaf?.pathname !== "/event") return {};
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
        { property: "og:url", content: `${SEO_ORIGIN}/event` },
      ],
      links: [{ rel: "canonical", href: `${SEO_ORIGIN}/event` }],
    };
  },
});

function EventGate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/event" && pathname !== "/event/") return <Outlet />;
  return (
    <Shell>
      <EventArticle />
    </Shell>
  );
}

function EventArticle() {
  return (
          <article className="oe">
        <header className="oe-hero">
          <p className="oe-hero__eye">MODEL HOUSE</p>
          <h1>견본주택 안내</h1>
          <p className="oe-hero__sub">별도 공지 시까지 운영 · 인천광역시 서해구 청라동 87-1 견본주택</p>
          <div className="oe-hero__actions">
            <Link className="oe-btn oe-btn--gold" to="/visit">방문예약</Link>
            <a className="oe-btn oe-btn--line" href={PROJECT_PHONE_TEL}>전화 문의 {PROJECT_PHONE_DISPLAY}</a>
          </div>
        </header>

        <section className="oe-sec" id="after" aria-labelledby="oe-after-title">
          <h2 id="oe-after-title">청약·당첨 고객 이벤트</h2>
          <i className="oe-rule" aria-hidden="true" />
          <div className="oe-pair">
            <article className="oe-card">
              <h3>청약 인증 고객</h3>
              <p>코스트코 골드스타 연간 회원권</p>
              <p className="oe-muted">수량 한정</p>
            </article>
          </div>
          <p className="oe-note">※ 인증 기간: 당첨자 서류접수 기간 11.12(목)~11.16(월) · 인증 방법은 견본주택에서 안내합니다.</p>
        </section>

        <section className="oe-sec" id="notice" aria-labelledby="oe-notice-title">
          <h2 id="oe-notice-title">유의사항</h2>
          <i className="oe-rule" aria-hidden="true" />
          <ul className="oe-notice">
            <li>이벤트 내용은 사업주체 사정에 따라 변경되거나 조기 종료될 수 있습니다.</li>
            <li>이 페이지의 이벤트는 견본주택 현장 이벤트로, 홈페이지 사전고객등록 이벤트와는 별개입니다(상가·오피스텔 백화점 상품권 50만원·코스트코 1년 회원권은 사전고객등록 페이지에서 안내).</li>
          </ul>
        </section>

        <div className="oe-cta">
          <Link className="oe-btn oe-btn--solid" to="/visit">방문예약</Link>
          <Link className="oe-btn oe-btn--line-dark" to="/register">사전고객등록</Link>
          <a className="oe-btn oe-btn--line-dark" href={PROJECT_PHONE_TEL}>전화 문의 {PROJECT_PHONE_DISPLAY}</a>
        </div>
      </article>
  );
}
