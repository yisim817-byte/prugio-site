import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { Shell } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { SEO_ORIGIN } from "@/data/seo";

const DESC = "청라 아크원 푸르지오 견본주택 안내. 인천광역시 서해구 청라동 87-1. 별도 공지 시까지 운영합니다.";
const TITLE = "견본주택 안내 | 청라 아크원 푸르지오";

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
            <a className="oe-btn oe-btn--line" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
          </div>
        </header>

        <div className="oe-cta">
          <Link className="oe-btn oe-btn--solid" to="/visit">방문예약</Link>
          <a className="oe-btn oe-btn--line-dark" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
        </div>
      </article>
  );
}
