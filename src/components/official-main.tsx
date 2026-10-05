import { Link } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { PLACES, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL, img } from "@/data/content";
import { REGISTER_LABEL } from "@/data/labels";
import { ROLE } from "@/data/role";

/**
 * 공식 홈페이지(arkone-prugio.com) 메인의 7개 구간을 그대로 옮긴 홈 본문 (저장소마다 같은 파일).
 *
 * 작업지시서 2(공식 메인·히어로 복제) 2절·3절 기준.
 * - 이미지와 영상은 공식 서버의 파일을 img() 로 직접 불러온다(저장소에 복사하지 않는다).
 * - 다르게 두는 것은 네 가지뿐이다: 사이트 틀(헤더·푸터·하단 바·팝업은 지금 것), 등록·전화(「사전고객등록」/register,
 *   사이트 대표번호), 7호선(연도 대신 「시기 미정」), 검색용 요소(h1·「한눈에 보기」·역할 띠·사이트별 안내는 유지).
 * - 움직임: 처음 들어올 때의 인트로, 스크롤 한 번에 한 장면씩 넘어가는 전환, 구간 안의 단계별 등장, 영상 재생.
 *   「동작 줄이기」 설정에서는 모두 끄고 일반 스크롤과 정지 이미지로 보인다.
 * - 공식의 분석·광고 추적 스크립트, fullPage.js 같은 라이선스 라이브러리는 가져오지 않는다. 장면 전환은 직접 구현했다.
 */

const MAIN = "/resources/img/pages/main/";
const asset = (file: string) => img(MAIN + file);

/** 장면 전환이 멈추는 구간. 순서는 공식 메인과 같고, 마지막은 검색용 요소 묶음이다. */
export const SCENE_IDS = [
  "hero",
  "hero-define",
  "overview",
  "location",
  "history",
  "premium",
  "brand",
  "contact",
  "site-info",
] as const;

/** 공식 히스토리 연표. 7호선 칸만 연도 자리를 「시기 미정」으로 둔다(프로젝트 고정 규칙). */
const HISTORY_CARDS: { year: string; tbd?: boolean; file: string; captions: string[] }[] = [
  { year: "2026", file: "history_img_2026.v4.jpg", captions: ["청라하늘대교 (개통)", "하나드림타운 (예정)"] },
  { year: "2028", file: "history_img_2028.v4.jpg", captions: ["돔구장&스타필드 청라 (개장 예정)"] },
  { year: "2029", file: "history_img_2029.v4.jpg", captions: ["서울아산청라병원 (예정)"] },
  {
    year: "시기 미정",
    tbd: true,
    file: "history_img_2030.v4.jpg",
    captions: ["7호선 국제업무단지역 (예정 · 개통 시기 미정)"],
  },
  { year: "2031", file: "history_img_2031.v4.jpg", captions: ["영상문화복합단지 (계획)"] },
  { year: "2031", file: "history_img_ark_one.v4.jpg", captions: ["청라 아크원 푸르지오 (예정)"] },
];

const PREMIUM_VIDEOS = [
  { video: "premium_video_01.mp4", poster: "premium_poster.v4.jpg" },
  { video: "premium_video_02.mp4", poster: "premium_poster_02.v4.jpg" },
  { video: "premium_video_03.mp4", poster: "premium_poster_03.v4.jpg" },
];

/** 공식 홍보영상(getVideo.json 의 영상 번호). 공식과 같은 방식(유튜브 창)으로 연다. */
const YOUTUBE_ID = "_wAuOJSTLek";

const REDUCED = "(prefers-reduced-motion: reduce)";
const PC = "(min-width: 1025px)";

function useMedia(query: string, initial = false) {
  const [on, setOn] = useState(initial);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, [query]);
  return on;
}

/** 원형 버튼 둘레를 도는 글자(대표번호). 공식의 hero_circle_text 자리. */
function Orbit({ text }: { text: string }) {
  const id = `om-orbit-${useId().replace(/:/g, "")}`;
  return (
    <svg className="om-quick__orbit" viewBox="0 0 132 132" aria-hidden="true">
      <defs>
        <path id={id} d="M66 66 m-52 0 a52 52 0 1 1 104 0 a52 52 0 1 1 -104 0" fill="none" />
      </defs>
      <text fill="currentColor" fontSize="9.5" letterSpacing="0.12em">
        <textPath href={`#${id}`}>{`${text}   ·   ${text}   ·  `}</textPath>
      </text>
    </svg>
  );
}

/** 처음 들어올 때의 연출. 「동작 줄이기」면 그리지 않는다. */
function Intro({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 3800);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className="om-intro" aria-label="청라 아크원 푸르지오 인트로">
      <video autoPlay muted loop playsInline poster={asset("hero_bg.v4.jpg")}>
        <source src={asset("intro_video_2.mp4")} type="video/mp4" />
      </video>
      <div className="om-intro__copy">
        <p className="om-intro__phrase">청라의 정점을 빛내는</p>
        <p className="om-intro__title">푸르지오의 완성</p>
        <p className="om-intro__kicker">청라 아크원 푸르지오</p>
        <p className="om-intro__brand" lang="en">
          CHEONG NA ARK-ONE PRUGIO
        </p>
      </div>
      <button type="button" className="om-intro__skip" onClick={onDone}>
        SKIP
      </button>
    </div>
  );
}

/** 공식 홍보영상 창. */
function VideoModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="om-modal" role="dialog" aria-modal="true" aria-label="청라 아크원 홍보영상" onClick={onClose}>
      <div className="om-modal__frame" onClick={(e) => e.stopPropagation()}>
        <iframe
          title="청라 아크원 홍보영상"
          src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&playsinline=1`}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <button type="button" className="om-modal__close" onClick={onClose} aria-label="닫기">
          ×
        </button>
      </div>
    </div>
  );
}

/** 구간이 보일 때만 영상을 받아 재생한다(히어로 외). 「동작 줄이기」면 포스터만 둔다. */
function LazyVideo({
  src,
  poster,
  className,
  reduced,
}: {
  src: string;
  poster: string;
  className?: string;
  reduced: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (el.preload === "none") el.preload = "auto";
            el.play().catch(() => {});
          } else el.pause();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none">
      <source src={src} type="video/mp4" />
    </video>
  );
}

/**
 * 장면 전환: PC에서 스크롤 한 번에 한 장면씩 넘어간다. 휠·키보드 한 번이 다음(또는 앞) 구간으로 이동이다.
 * 「동작 줄이기」와 휴대폰에서는 일반 스크롤이다.
 */
function useSceneStepping(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    let busy = false;
    const scenes = () =>
      SCENE_IDS.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => Boolean(el));
    const current = (els: HTMLElement[]) => {
      const y = window.scrollY + 2;
      let idx = 0;
      els.forEach((el, i) => {
        if (el.offsetTop <= y) idx = i;
      });
      return idx;
    };
    const go = (dir: 1 | -1) => {
      const els = scenes();
      if (!els.length) return false;
      const idx = current(els);
      const el = els[idx];
      // 화면보다 긴 구간은 그 안에서 먼저 움직인다
      const bottom = el.offsetTop + el.offsetHeight;
      const viewBottom = window.scrollY + window.innerHeight;
      if (dir === 1 && bottom - viewBottom > 4) {
        window.scrollTo({ top: Math.min(bottom - window.innerHeight, els[idx + 1]?.offsetTop ?? bottom), behavior: "smooth" });
        return true;
      }
      if (dir === -1 && window.scrollY - el.offsetTop > 4) {
        window.scrollTo({ top: el.offsetTop, behavior: "smooth" });
        return true;
      }
      const next = els[idx + dir];
      if (!next) return false;
      next.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < 4) return;
      if ((e.target as HTMLElement | null)?.closest?.("[data-free-scroll]")) return;
      e.preventDefault();
      if (busy) return;
      busy = true;
      go(e.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => (busy = false), 900);
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [enabled]);
}

/** 구간 안의 단계별 등장: 구간이 보이면 is-in 을 붙이고, 자식은 CSS 지연으로 순서대로 나타난다. */
function useStagedReveal(enabled: boolean) {
  useEffect(() => {
    const root = document.querySelector("[data-official-main]");
    if (!root) return;
    const targets = [...root.querySelectorAll<HTMLElement>("[data-scene]")];
    if (!enabled) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("is-in")),
      { threshold: 0.2 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [enabled]);
}

export function OfficialMain({ children }: { children?: React.ReactNode }) {
  const reduced = useMedia(REDUCED, true);
  const pc = useMedia(PC, false);
  const [mounted, setMounted] = useState(false);
  const [intro, setIntro] = useState(false);
  const [video, setVideo] = useState(false);
  const heroPc = useRef<HTMLVideoElement>(null);
  const heroM = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!window.matchMedia(REDUCED).matches) setIntro(true);
  }, []);

  // 히어로 영상: 「동작 줄이기」가 아닐 때만 재생한다(정지컷은 항상 깔려 있다)
  useEffect(() => {
    if (!mounted || reduced) return;
    for (const el of [heroPc.current, heroM.current]) {
      if (!el) continue;
      el.preload = "auto";
      el.play().catch(() => {});
    }
  }, [mounted, reduced]);

  useSceneStepping(mounted && pc && !reduced && !intro);
  useStagedReveal(mounted && !reduced);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });

  return (
    <div data-official-main="" className={`om${intro ? " om--intro" : ""}`}>
      {intro ? <Intro onDone={() => setIntro(false)} /> : null}

      {/* ── 히어로 ─────────────────────────────────────────── */}
      <section id="hero" className="om-hero" data-scene="">
        <div className="om-hero__media" aria-hidden="true">
          <picture>
            <source media="(max-width: 1024px)" srcSet={asset("hero_bg_m.v4.jpg")} />
            <img src={asset("hero_bg.v4.jpg")} alt="" fetchPriority="high" />
          </picture>
          <video ref={heroPc} className="om-pc" muted loop playsInline preload="none" poster={asset("hero_bg.v4.jpg")}>
            <source src={asset("hero_video_3.mp4")} type="video/mp4" />
          </video>
          <video ref={heroM} className="om-m" muted loop playsInline preload="none" poster={asset("hero_bg_m.v4.jpg")}>
            <source src={asset("hero_video_m_2.mp4")} type="video/mp4" />
          </video>
        </div>
        <span className="om-hero__dim" aria-hidden="true" />
        <div className="om-hero__copy">
          <p className="om-hero__eyebrow om-rise" lang="en">
            <span>THE PRESENT</span>
            <span>OF</span>
          </p>
          <p className="om-hero__en om-rise" lang="en" aria-hidden="true">
            <span>CHEONG NA</span>
            <span>ARK-ONE</span>
            <span>PRUGIO</span>
          </p>
          <h1 className="om-hero__h1 om-rise">
            <span className="om-hero__ko">{ROLE.h1[0]}</span>
            <span className="om-hero__role">{ROLE.h1[1]}</span>
          </h1>
          <span className="om-hero__open om-rise">
            <strong>10월 OPEN</strong>예정
          </span>
        </div>
        <div className="om-hero__ui">
          <button type="button" className="om-hero__scroll" onClick={() => scrollTo("hero-define")} lang="en">
            <span className="om-hero__scroll_line" />
            <span>SCROLL</span>
          </button>
          <button type="button" className="om-hero__video" onClick={() => setVideo(true)}>
            <span>
              <b>청라 아크원</b> 홍보영상
            </span>
            <span className="om-hero__play">
              <img src={asset("ico_yt.svg")} alt="" />
            </span>
          </button>
          <div className="om-quick">
            <a className="om-quick__item" href={PROJECT_PHONE_TEL} aria-label={`전화 상담 ${PROJECT_PHONE_DISPLAY}`}>
              <Orbit text={PROJECT_PHONE_DISPLAY} />
              <img className="om-quick__content" src={asset("hero_circle_01.svg")} alt="분양가 상한제 적용단지" />
            </a>
            <Link to="/register" className="om-quick__item" aria-label={REGISTER_LABEL}>
              <Orbit text={PROJECT_PHONE_DISPLAY} />
              <span className="om-quick__label">{REGISTER_LABEL}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 아크원이란? (히어로 두 번째 장면) ──────────────────── */}
      <section id="hero-define" className="om-define" data-scene="" aria-label="아크원(ARK-ONE)이란?">
        <img className="om-define__visual" src={asset("hero_brand_img.v4.png")} alt="" loading="lazy" />
        <div className="om-define__copy">
          <img src={asset("ico_star.svg")} alt="" width={28} height={28} className="om-rise" />
          <p className="om-define__title om-rise">아크원(ARK-ONE)이란?</p>
          <strong className="om-define__keyword om-rise" lang="en">
            <b>A</b>BSOLUTE
            <br />
            <b>R</b>EMAR
            <br />
            <b>K</b>ABLE
            <br />
            <b>ONE</b>
          </strong>
          <p className="om-define__text om-rise">
            청라의 절대적 기준이 될
            <br />
            단 하나의 주거명작을 상징
          </p>
        </div>
      </section>

      {/* ── 사업개요 ───────────────────────────────────────── */}
      <section id="overview" className="om-overview" data-scene="">
        <img className="om-bg" src={asset("overview_bg.v4.jpg")} alt="" loading="lazy" />
        <span className="om-dim" aria-hidden="true" />
        <div className="om-overview__in">
          <header className="om-rise">
            <p className="om-overview__text">
              청라 10년의 기다림,
              <br />그 모든 프리미엄을 담은
            </p>
            <h2 className="om-overview__title">단 하나의 절대적 명작</h2>
            <p className="om-overview__brand" lang="en">
              <img src={asset("overview_ico_star.svg")} alt="" width={18} height={18} /> ARK-ONE
            </p>
          </header>
          <article className="om-overview__panel om-rise">
            <h3>
              총 2,911가구<small>(B1 &amp; M5 블록)</small>
              <br />
              청라를 대표하는
              <br />
              푸르지오 대규모 브랜드타운
            </h3>
            <p>
              국제업무단지 B1 블록의 눈부신 성공에 이어
              <br />
              M5 블록으로 더 커지는 푸르지오 브랜드타운!
              <br />
              청라를 드높일 위대한 가치를 세웁니다
            </p>
            <dl className="om-metrics">
              <div>
                <dt>건축면적</dt>
                <dd>
                  <span className="om-metrics__pre">약</span>12,278<span>㎡</span>
                </dd>
              </div>
              <div>
                <dt>연면적</dt>
                <dd>
                  <span className="om-metrics__pre">약</span>424,558<span>㎡</span>
                </dd>
              </div>
              <div>
                <dt>주차대수</dt>
                <dd>
                  3,124<span>대</span>
                </dd>
              </div>
              <div>
                <dt>세대수</dt>
                <dd>
                  1,855<span>세대</span>
                </dd>
              </div>
            </dl>
          </article>
        </div>
      </section>

      {/* ── 입지 ───────────────────────────────────────────── */}
      <section id="location" className="om-location" data-scene="">
        <div className="om-location__visual">
          <p className="om-location__tag om-rise" lang="en">
            ABSOLUTE REMARKABLE
          </p>
          <img src={asset("location_img.v4.png")} alt="" loading="lazy" />
          <p className="om-location__title om-rise" lang="en">
            ARK-ONE
          </p>
        </div>
        <div className="om-location__info">
          <p className="om-location__eyebrow om-rise" lang="en">
            CENTRAL LOCATION
          </p>
          <h2 className="om-location__desc om-rise">
            모두가 기다려온 프리미엄의 완성,
            <br />
            청라의 중심은 푸르지오.
          </h2>
          <Link to="/location" className="om-more om-rise">
            <span lang="en">view more</span>
            <span aria-hidden="true">›</span>
          </Link>
          <figure className="om-location__map om-rise">
            <img src={asset("location_map.v4.png")} alt="청라국제도시 안의 청라 아크원 푸르지오 위치" loading="lazy" />
            <picture>
              <source media="(max-width: 1024px)" srcSet={asset("location_bubble_m.v4.png")} />
              <img className="om-location__bubble" src={asset("location_bubble.v4.png")} alt="" loading="lazy" />
            </picture>
          </figure>
        </div>
      </section>

      {/* ── 히스토리 ───────────────────────────────────────── */}
      <section id="history" className="om-history" data-scene="">
        <img className="om-history__bg om-history__bg--1" src={asset("histroy_bg_img_01.svg")} alt="" aria-hidden="true" loading="lazy" />
        <img className="om-history__bg om-history__bg--2" src={asset("histroy_bg_img_02.svg")} alt="" aria-hidden="true" loading="lazy" />
        <div className="om-history__head om-rise">
          <p lang="en">MASTERPLAN PROGRESS — ARKONE</p>
          <h2>
            푸르지오가 완성하는
            <br />
            청라의 클라이맥스
          </h2>
          <img className="om-history__climax" src={asset("history_climax.v4.png")} alt="" loading="lazy" />
        </div>
        <ol className="om-history__track">
          {HISTORY_CARDS.map((ev) => (
            <li className={ev.tbd ? "om-history__card om-history__card--tbd om-rise" : "om-history__card om-rise"} key={ev.file}>
              <p className="om-history__year" lang={ev.tbd ? undefined : "en"}>
                {ev.tbd ? (
                  ev.year
                ) : (
                  <>
                    <span>20</span>
                    {ev.year.slice(2)}
                  </>
                )}
              </p>
              <figure>
                <img src={asset(ev.file)} alt="" loading="lazy" />
                <figcaption>
                  {ev.captions.map((c) => (
                    <span key={c}>{c}</span>
                  ))}
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>
        <div className="om-history__foot om-rise">
          <img src={asset("history_logo.svg")} alt="" aria-hidden="true" />
          <Link to="/register" className="om-more">
            <span>{REGISTER_LABEL}</span>
            <span aria-hidden="true">›</span>
          </Link>
        </div>
      </section>

      {/* ── 프리미엄 ───────────────────────────────────────── */}
      <section id="premium" className="om-premium" data-scene="">
        <img className="om-bg om-premium__bg" src={asset("premium_bg.v4.jpg")} alt="" loading="lazy" />
        <div className="om-premium__intro">
          <div className="om-premium__mosaic om-rise">
            <img src={asset("premium_visual_img_01.v4.jpg")} alt="" loading="lazy" />
            <img src={asset("premium_visual_img_02.v4.jpg")} alt="" loading="lazy" />
            <img src={asset("premium_visual_img_03.v4.jpg")} alt="" loading="lazy" />
            <img src={asset("premium_visual_img_04.v4.jpg")} alt="" loading="lazy" />
          </div>
          <div className="om-premium__copy om-rise">
            <p className="om-premium__eyebrow" lang="en">
              ARK-ONE PREMIUM
            </p>
            <h2>
              완벽한
              <br />
              라이프스타일
            </h2>
            <p>
              공간의 특별함
              <br />
              자부심의 가치
              <br />
              정상을 넘어,
              <br />
              새로운 라이프스타일의 기준
            </p>
            <Link to="/premium" className="om-more">
              <span lang="en">view more</span>
              <span aria-hidden="true">›</span>
            </Link>
          </div>
        </div>
        <div className="om-premium__scenes">
          {PREMIUM_VIDEOS.map((v, i) => (
            <figure key={v.video} className="om-premium__scene om-rise">
              <LazyVideo src={asset(v.video)} poster={asset(v.poster)} reduced={reduced} />
              <img className="om-premium__left" src={asset(`premium_img_left_0${i + 1}.v4.jpg`)} alt="" loading="lazy" />
            </figure>
          ))}
        </div>
        <p className="om-premium__notice">상기 이미지는 AI로 제작된 것으로서 실제와 다릅니다.</p>
      </section>

      {/* ── 브랜드 ─────────────────────────────────────────── */}
      <section id="brand" className="om-brand" data-scene="">
        <picture>
          <source media="(max-width: 1024px)" srcSet={asset("brand_bg_m.v4.jpg")} />
          <img className="om-bg" src={asset("brand_bg.v4.jpg")} alt="" loading="lazy" />
        </picture>
        <div className="om-brand__frame om-rise">
          <p className="om-brand__eyebrow" lang="en">
            THE NATURAL NOBILITY
          </p>
          <p className="om-brand__story" lang="en">
            BRAND STORY
          </p>
          <h2>본연이 지니는 고귀함</h2>
          <p>
            견고한 기본에 더해진 세련된 편안함,
            <br />내 삶의 본연을 집에서 찾다
          </p>
          <img className="om-brand__logo" src={asset("brand_logo.svg")} alt="PRUGIO" loading="lazy" />
        </div>
      </section>

      {/* ── 오시는 길 ──────────────────────────────────────── */}
      <section id="contact" className="om-contact" data-scene="">
        <img className="om-bg" src={asset("contact_bg.v4.jpg")} alt="" loading="lazy" />
        <h2 className="om-contact__title om-rise" lang="en">
          CONTACT US
        </h2>
        <div className="om-contact__grid">
          <article className="om-contact__card om-rise">
            <img src={asset("contact_map_01.v4.png")} alt="청라 아크원 푸르지오 현장과 견본주택 약도" loading="lazy" />
            {PLACES.filter((p) => p.title !== "홍보관").map((p) => (
              <ContactRow key={p.title} place={p} />
            ))}
          </article>
          <article className="om-contact__card om-rise">
            <img src={asset("contact_map_02.v4.png")} alt="청라 아크원 푸르지오 홍보관 약도" loading="lazy" />
            {PLACES.filter((p) => p.title === "홍보관").map((p) => (
              <ContactRow key={p.title} place={p} />
            ))}
          </article>
        </div>
      </section>

      {/* ── 검색용 요소 묶음(사이트별): 한눈에 보기, 역할 띠, 사이트별 안내 ─ */}
      <section id="site-info" className="om-info" aria-label="이 사이트의 안내">
        {children}
      </section>

      {video ? <VideoModal onClose={() => setVideo(false)} /> : null}
    </div>
  );
}

function ContactRow({ place }: { place: (typeof PLACES)[number] }) {
  return (
    <div className="om-contact__row">
      <div>
        <h3>{place.title}</h3>
        <address>{place.address}</address>
      </div>
      <div className="om-contact__maps">
        <a href={place.naver} target="_blank" rel="noreferrer" aria-label={`${place.title} 네이버 지도`}>
          <img src={img("/resources/img/common/ico_naver.svg")} alt="" />
        </a>
        <a href={place.kakao} target="_blank" rel="noreferrer" aria-label={`${place.title} 카카오 지도`}>
          <img src={img("/resources/img/common/ico_kko_map.svg")} alt="" />
        </a>
      </div>
    </div>
  );
}
