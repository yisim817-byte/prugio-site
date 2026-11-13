import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY } from "@/data/content";
import { SEO_ORIGIN } from "@/data/seo";
import { B103Notice, B103_FAQ, B103_H1 } from "@/components/b103-notice";

// 작업지시서 17 (2026-11-13): 103㎡B 선착순 공급 참여의향서 접수 안내. 주소는 7개 도메인 공통 /103b.
const TITLE = `${B103_H1} | 11.17부터 견본주택 접수`;
const DESCRIPTION =
  "청라 아크원 푸르지오 103㎡B 선착순 공급 참여의향서는 2026.11.17(화)부터 견본주택에서 신청자 본인이 신분증 원본으로 접수합니다. 대리접수 불가 · 1인 1건. 공급 일정·방식은 미정이며 확정 후 접수 고객에게 안내합니다.";
const URL = `${SEO_ORIGIN}/103b`;

export const Route = createFileRoute("/103b")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "index,follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: URL },
      { rel: "stylesheet", href: "/b103.css" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: B103_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <div className="b103-shell">
        <B103Notice phone={PROJECT_PHONE_DISPLAY} plansHref="/plans" contactHref="/contact" visitHref="/visit" />
      </div>
    </Shell>
  );
}
