import { useState } from "react";
import { Footer, Header, MobileBar, UtilityBar } from "@/components/chrome";
import { SEO_ORIGIN, SEO_PAGES } from "@/data/seo";
import { IMAGE_SIZES } from "@/data/image-sizes";

// 헤더·푸터·상세 페이지 머리·「한눈에 보기」는 chrome.tsx 로 옮겼다. 기존 import 경로는 그대로 쓸 수 있다.
export { Footer, QuickAnswer, SubHero } from "@/components/chrome";

export function Photo({
  src,
  alt,
  className = "",
  eager = false,
}: {
  src: string;
  alt: string;
  className?: string;
  /** 첫 화면(Hero·SubHero·헤더 로고) 이미지는 지연 로딩하지 않는다. */
  eager?: boolean;
}) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className={`grid place-items-center bg-forest px-6 text-center text-sm text-paper ${className}`}>
        {alt}
      </div>
    );
  }
  // Hero·SubHero·헤더 로고(eager)는 속성을 바꾸지 않는다. 그 외 이미지만 크기·지연 로딩 지정.
  const size = eager ? undefined : IMAGE_SIZES[src];
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={size?.[0]}
      height={size?.[1]}
      loading={eager ? undefined : "lazy"}
      decoding={eager ? undefined : "async"}
      onError={() => setOk(false)}
    />
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <UtilityBar />
      <Header />
      {children}
      <Footer />
      <MobileBar />
    </div>
  );
}

export function SourceNote({ children }: { children?: React.ReactNode }) {
  if (!children) return null;
  return (
    <aside className="mx-auto max-w-6xl px-4 py-8 text-sm leading-6 text-muted">
      {children}
    </aside>
  );
}

const PAGE_DESCRIPTION: Record<string, string> = {
  "청라 아크원 푸르지오": "청라 아크원 푸르지오 사업개요, 입지, 평면 및 분양 관련 안내. 상담과 이벤트 적용 조건을 확인하세요.",
  사업개요: "청라 아크원 푸르지오 사업개요. 대지 위치, 규모, 세대 구성 안내.",
  히스토리: "청라 일대 개발 연혁과 청라 아크원 푸르지오 안내.",
  입지환경: "청라 아크원 푸르지오 입지 안내. 교통·생활 인프라 일정은 바뀔 수 있습니다.",
  프리미엄: "청라 아크원 푸르지오 단지 특징과 구성 안내.",
  "오시는 길": "청라 아크원 푸르지오 현장, 견본주택, 홍보관 위치 안내.",
  "변경된 청약제도": "변경된 청약제도 안내. 자격과 일정은 입주자모집공고를 따릅니다.",
  "특별공급 안내": "특별공급 안내. 자격과 일정은 입주자모집공고를 따릅니다.",
  "일반공급 안내": "일반공급 안내. 자격과 일정은 입주자모집공고를 따릅니다.",
  언론보도: "청라 아크원 푸르지오 관련 언론 기사 목록.",
  홍보영상: "청라 아크원 푸르지오 홍보영상.",
  사전고객등록: "사전고객등록 안내. 청약 신청이 아니며 주민등록번호는 받지 않습니다.",
  "아파트 사전고객등록 이벤트": "사전고객등록 이벤트 조건 안내. 등록만으로 지급되지 않으며 청약 신청이 아닙니다.",
  개인정보처리방침: "개인정보 처리방침. 처리자는 HUMANE 운영자입니다.",
  "접수 관리": "운영자 접수 확인 화면.",
  "관리자 로그인": "운영자 로그인.",
};

/**
 * path를 넘기면 canonical(자기참조)과 og:url이 붙는다.
 * path가 SEO_PAGES(역할 페이지)에 있으면 index,follow + 전용 title·description + JSON-LD.
 * 그 밖의 페이지는 기존대로 noindex, nofollow.
 */
export function pageHead(title: string, path?: string) {
  const seo = path ? SEO_PAGES[path] : undefined;
  const url = path === undefined ? undefined : path === "/" ? SEO_ORIGIN : `${SEO_ORIGIN}${path}`;
  const full = seo?.title ?? `${title} | 청라 아크원 푸르지오`;
  const description =
    seo?.description ??
    PAGE_DESCRIPTION[title] ??
    "청라 아크원 푸르지오 사업개요, 입지, 평면 및 분양 관련 안내. 상담과 이벤트 적용 조건을 확인하세요.";
  return {
    meta: [
      { title: full },
      { name: "description", content: description },
      { name: "robots", content: seo ? "index,follow" : "noindex, nofollow" },
      ...(url
        ? [
            { property: "og:title", content: full },
            { property: "og:url", content: url },
            { property: "og:type", content: "website" },
          ]
        : []),
    ],
    links: url ? [{ rel: "canonical", href: url }] : [],
    scripts:
      seo && url && path
        ? [{ type: "application/ld+json", children: JSON.stringify(pageJsonLd(full, description, url, path, seo.crumb)) }]
        : [],
  };
}

function pageJsonLd(name: string, description: string, url: string, path: string, crumb: string) {
  const page = {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    name,
    description,
    url,
    inLanguage: "ko-KR",
  };
  if (path === "/") return { "@context": "https://schema.org", "@graph": [page] };
  return {
    "@context": "https://schema.org",
    "@graph": [
      { ...page, breadcrumb: { "@id": `${url}#breadcrumb` } },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: SEO_PAGES["/"]?.crumb ?? "청라 아크원 푸르지오", item: SEO_ORIGIN },
          { "@type": "ListItem", position: 2, name: crumb, item: url },
        ],
      },
    ],
  };
}
