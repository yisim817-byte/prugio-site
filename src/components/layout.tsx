import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL, img } from "@/data/content";
import { SEO_ORIGIN, SEO_PAGES, SEO_SOURCE_LINE } from "@/data/seo";
import { IMAGE_SIZES } from "@/data/image-sizes";

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
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const home = useRouterState({ select: (s) => s.location.pathname === "/" });
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <div className="flex items-center gap-2 px-3 py-3 min-[430px]:gap-4 min-[430px]:px-4 lg:px-5">
        <Link to="/" className="shrink-0" aria-label="청라 아크원 푸르지오 홈">
          <Photo
            eager
            src={img("/resources/img/common/logotype.svg")}
            alt="PRUGIO"
            className="h-5 w-auto max-w-[84px] object-contain object-left min-[430px]:h-6 min-[430px]:max-w-none"
          />
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center justify-end gap-5 lg:flex" aria-label="주요 메뉴">
          {NAV.map((item) => (
            <div key={item.en} className="group relative">
              <Link to={item.href} className="text-sm font-medium tracking-wide">
                {item.label}
              </Link>
              {item.children && item.children.length > 1 ? (
                <div className="invisible absolute right-0 top-full z-50 min-w-40 border border-line bg-paper py-2 opacity-0 shadow-sm transition group-hover:visible group-hover:opacity-100">
                  {item.children.map((child) => (
                    <Link key={child.href + child.label} to={child.href} className="block px-4 py-2 text-sm hover:bg-line">
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <a
          href={PROJECT_PHONE_TEL}
          className="ml-auto shrink-0 whitespace-nowrap text-right text-forest lg:ml-2"
          title="문의"
        >
          <span className="mr-2 align-middle font-sans text-sm text-muted">문의</span>
          <span className={`align-middle font-serif leading-none ${home ? "text-[1.15rem] min-[400px]:text-[1.3rem] min-[430px]:text-[1.75rem]" : "text-base"}`}>
            {PROJECT_PHONE_DISPLAY}
          </span>
        </a>
        <button
          type="button"
          className="grid h-11 w-11 shrink-0 place-items-center border border-line lg:hidden"
          aria-label={open ? "메뉴 닫기" : "전체 메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-line bg-paper px-4 py-4 lg:hidden">
          {NAV.map((item) => (
            <div key={item.en} className="border-b border-line py-3">
              <p className="text-xs tracking-[0.18em] text-muted">{item.en}</p>
              {(item.children ?? [{ label: item.label, href: item.href }]).map((child) => (
                <Link
                  key={child.href + child.label}
                  to={child.href}
                  className="mt-2 block text-base"
                  onClick={() => setOpen(false)}
                >
                  {child.label}
                </Link>
              ))}
            </div>
          ))}
          <a href={PROJECT_PHONE_TEL} className={`mt-4 block text-right font-serif leading-none text-forest ${home ? "text-[1.75rem] min-[430px]:text-[2.25rem]" : "text-lg"}`}>
            <span className="mr-2 align-middle font-sans text-sm text-muted">문의</span>
            <span className="align-middle">{PROJECT_PHONE_DISPLAY}</span>
          </a>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-[180px_1fr]">
        <Photo src={img("/resources/img/common/logotype.svg")} alt="PRUGIO" className="h-6 w-auto" />
        <div className="space-y-3 text-sm leading-6 text-muted">
          <p>이 사이트의 운영·개인정보 처리자: HUMANE 운영자. 대표번호 {PROJECT_PHONE_DISPLAY}.</p>
          <p>
            아래는 공식 홈페이지에 적힌 사업 주체이며, 이 사이트를 운영한다는 뜻이 아닙니다. 시행 ㈜청라스마트시티 · 시공 대우건설.
          </p>
          <p>CG·이미지·일부 영상은 이해를 돕기 위한 것이며 실제와 다를 수 있습니다. 개발계획은 관계기관 사정으로 변경·취소될 수 있습니다.</p>
          <p>주소의 행정구역은 계약 전 확인이 필요합니다.</p>
          <div className="flex flex-wrap gap-4 pt-2 text-ink">
            <Link to="/privacy" className="underline">개인정보처리방침</Link>
            <Link to="/register" className="underline">관심고객등록</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SubHero({ en, title, crumbs }: { en: string; title: string; crumbs: string }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <Photo
        eager
        src={img("/resources/img/common/sub_visual_img.v4.jpg")}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-ink/45" />
      <div className="relative mx-auto max-w-6xl px-4 py-16 text-paper md:py-24">
        <p className="text-xs tracking-[0.28em]">{en}</p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl">{title}</h1>
        <p className="mt-4 text-sm text-paper/80">{crumbs}</p>
      </div>
    </section>
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
  관심고객등록: "관심고객 등록 안내. 청약 신청이 아니며 주민등록번호는 받지 않습니다.",
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

/** 역할 페이지의 「한눈에 보기」 직답 문단. 역할 페이지가 아니면 아무것도 그리지 않는다. */
export function QuickAnswer({ path }: { path: string }) {
  const seo = SEO_PAGES[path];
  if (!seo) return null;
  return (
    <section aria-labelledby="quick-answer-title" className="border-b border-line">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <p className="text-xs tracking-[0.22em] text-muted">SUMMARY</p>
        <h2 id="quick-answer-title" className="mt-3 font-serif text-2xl md:text-3xl">
          한눈에 보기
        </h2>
        <p className="mt-5 max-w-3xl break-keep leading-7">{seo.answer}</p>
        <p className="mt-4 text-sm leading-6 text-muted">{SEO_SOURCE_LINE}</p>
      </div>
    </section>
  );
}
