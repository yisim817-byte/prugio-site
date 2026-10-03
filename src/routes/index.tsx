import { RoleExtra } from "@/components/r2";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Photo, Shell, pageHead, QuickAnswer } from "@/components/layout";
import { AptEventPopup } from "@/components/event-popup";
import { HISTORY, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL, img } from "@/data/content";

export const Route = createFileRoute("/")({
  head: () => pageHead("청라 아크원 푸르지오", "/"),
  component: Home,
});

const SECTIONS = [
  ["hero", "HERO"],
  ["overview", "OVERVIEW"],
  ["location", "LOCATION"],
  ["history", "HISTORY"],
  ["premium", "PREMIUM"],
  ["brand", "BRAND"],
  ["contact", "CONTACT"],
] as const;

function Home() {
  return (
    <Shell>
      <AptEventPopup />
      <nav className="fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 xl:flex" aria-label="섹션">
        {SECTIONS.map(([id, label]) => (
          <a key={id} href={`#${id}`} className="text-[10px] tracking-[0.14em] text-muted hover:text-ink">
            {label}
          </a>
        ))}
      </nav>

      <section id="hero" className="relative grid min-h-[88vh] place-items-center overflow-hidden bg-forest text-paper">
        <Photo eager src={img("/resources/img/pages/main/hero_bg.v4.jpg")} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative px-6 text-center">
          <p className="text-xs tracking-[0.35em]">CHEONG NA ARK-ONE PRUGIO</p>
          <h1 className="mt-4 font-serif text-4xl leading-tight md:text-6xl">
            청라의 정점을 빛내는
            <br />
            푸르지오의 완성
          </h1>
          <p className="mt-6 text-sm">10월 OPEN 예정</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/register" className="grid h-12 min-w-36 place-items-center bg-paper px-5 text-sm text-ink">
              관심고객등록
            </Link>
            <Link to="/video" className="grid h-12 min-w-36 place-items-center border border-paper px-5 text-sm">
              홍보영상
            </Link>
          </div>
        </div>
      </section>

      <QuickAnswer path="/" />

      <section id="overview" className="mx-auto grid max-w-6xl gap-10 px-4 py-20 md:grid-cols-2">
        <div>
          <p className="text-xs tracking-[0.22em] text-muted">OVERVIEW</p>
          <h2 className="mt-3 font-serif text-4xl">단 하나의 절대적 명작</h2>
          <p className="mt-6 leading-7 text-muted">
            건축면적 약 12,278㎡, 연면적 약 424,558㎡, 주차 3,124대, 1,855세대·실.
          </p>
          <Link to="/overview" className="mt-8 inline-block text-sm underline">사업개요 보기</Link>
        </div>
        <Photo src={img("/resources/img/sub/overview_apt_img.v4.jpg")} alt="단지 이미지" className="h-[420px] w-full object-cover" />
      </section>

      <section id="location" className="bg-forest px-4 py-20 text-paper">
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          <div>
            <p className="text-xs tracking-[0.22em]">LOCATION</p>
            <h2 className="mt-3 font-serif text-4xl">CENTRAL LOCATION</h2>
            <p className="mt-6 leading-7 text-paper/80">7호선 국제업무단지역(예정 · 개통 시기 미정), GTX-D·E(계획 단계 · 확정 아님), 청라하늘대교 개통. 일정은 예정·계획이며 변경될 수 있습니다.</p>
            <Link to="/location" className="mt-8 inline-block border border-paper px-5 py-3 text-sm">입지환경</Link>
          </div>
          <Photo src={img("/resources/img/sub/location_map_img.v4.jpg")} alt="입지 안내 지도" className="h-[360px] w-full object-cover" />
        </div>
      </section>

      <section id="history" className="mx-auto max-w-6xl px-4 py-20">
        <p className="text-xs tracking-[0.22em] text-muted">HISTORY</p>
        <h2 className="mt-3 font-serif text-4xl">푸르지오가 완성하는 청라의 클라이맥스</h2>
        <ol className="mt-10 grid gap-4 md:grid-cols-5">
          {HISTORY.map(([year, text]) => (
            <li key={year} className="border-t border-ink pt-4">
              <p className="font-serif text-2xl">{year}</p>
              <p className="mt-2 text-sm leading-6 text-muted">{text}</p>
            </li>
          ))}
        </ol>
        <Link to="/brand" className="mt-8 inline-block text-sm underline">히스토리</Link>
      </section>

      <section id="premium" className="bg-ink px-4 py-20 text-paper">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs tracking-[0.22em] text-sand">PREMIUM</p>
          <h2 className="mt-3 font-serif text-4xl">ARK-ONE PREMIUM</h2>
          <Link to="/premium" className="mt-8 inline-block border border-paper px-5 py-3 text-sm">프리미엄</Link>
        </div>
      </section>

      <section id="brand" className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-20 md:grid-cols-2">
        <Photo src={img("/resources/img/sub/brand_content_img.v4.jpg")} alt="청라를 잇는 교량과 도심 야경" className="h-[420px] w-full object-cover" />
        <div>
          <p className="text-xs tracking-[0.22em] text-muted">BRAND</p>
          <h2 className="mt-3 font-serif text-4xl">THE NATURAL NOBILITY</h2>
          <p className="mt-6 leading-7 text-muted">견고한 기본에 더해진 편안함.</p>
        </div>
      </section>

      <section id="contact" className="border-t border-line px-4 py-20">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs tracking-[0.22em] text-muted">CONTACT</p>
            <h2 className="mt-3 font-serif text-4xl">오시는 길</h2>
            <p className="mt-4 text-muted">현장 청라동 86-1 · 견본주택 87-1 · 홍보관 중봉대로 586번길 19</p>
            <p className="mt-3">
              대표번호{" "}
              <a href={PROJECT_PHONE_TEL} className="font-medium text-forest">
                {PROJECT_PHONE_DISPLAY}
              </a>
            </p>
          </div>
          <Link to="/contact" className="grid h-12 place-items-center bg-forest px-6 text-sm text-paper">위치 보기</Link>
        </div>
      </section>
      <RoleExtra path="/" />
    </Shell>
  );
}
