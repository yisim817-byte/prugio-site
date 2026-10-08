import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { PLACES, img } from "@/data/content";
import { REGISTER_LABEL } from "@/data/labels";
import { ROLE } from "@/data/role";

/**
 * 공식 홈페이지(arkone-prugio.com) 메인을 그대로 옮긴 홈 본문 (저장소마다 같은 파일).
 *
 * 기준: 2026-10-05 공식 메인(home.html, main.v4.css, 공식 화면 캡처). 작업지시서 2의 2절·3절과 작업지시서 3.
 * - 이미지와 영상은 공식 서버의 파일을 img() 로 직접 불러온다(저장소에 복사하지 않는다). 부르는 파일 이름은
 *   공식 메인이 쓰는 71개 안에서만 고른다(scripts/design-check.mjs 가 검사한다).
 * - 다르게 두는 것은 네 가지뿐이다: 사이트 틀(헤더·푸터·하단 바·팝업은 지금 것), 등록·전화(「사전고객등록」/register,
 *   사이트 대표번호), 7호선(연도 대신 「시기 미정」), 검색용 요소(h1·「한눈에 보기」·역할 띠·사이트별 안내는 유지).
 * - PC(1025px 이상)에서는 공식처럼 휠 한 번에 한 장면씩 넘어간다(장면 16개). 휴대폰과 「동작 줄이기」에서는 일반 스크롤이다.
 * - 공식의 분석·광고 추적 스크립트, fullPage.js 같은 라이선스 라이브러리는 가져오지 않는다. 장면 전환은 직접 구현했다.
 */

const MAIN = "/resources/img/pages/main/";
const asset = (file: string) => img(MAIN + file);
const common = (file: string) => img("/resources/img/common/" + file);

/** 공식 홍보영상(유튜브 영상 번호). 공식과 같은 방식(유튜브 창)으로 연다. 카드의 썸네일은 styles.css 의 .om-hero__video_play 가 같은 영상의 유튜브 썸네일을 깐다. */
const YOUTUBE_ID = "OPf_5C5WaJY";

/** 공식 히스토리 연표. 7호선 칸만 연도 자리를 「시기 미정」으로 둔다(프로젝트 고정 규칙). */
const HISTORY_EVENTS: { key: string; year: string; tbd?: boolean; file: string; alt: string; captions: [string, string][] }[] = [
  { key: "2026", year: "2026", file: "history_img_2026.v4.jpg", alt: "하나드림타운 조감도", captions: [["청라하늘대교", "(개통)"], ["하나드림타운", "(예정)"]] },
  { key: "2028", year: "2028", file: "history_img_2028.v4.jpg", alt: "돔구장과 스타필드 청라 공사 현장", captions: [["돔구장&스타필드 청라", "(개장 예정)"]] },
  { key: "2029", year: "2029", file: "history_img_2029.v4.jpg", alt: "", captions: [["서울아산청라병원", "(예정)"]] },
  { key: "2030", year: "시기 미정", tbd: true, file: "history_img_2030.v4.jpg", alt: "7호선 국제업무단지역 예정지", captions: [["7호선 국제업무단지역", "(예정 · 개통 시기 미정)"]] },
  { key: "2031", year: "2031", file: "history_img_2031.v4.jpg", alt: "영상문화복합단지 조감도", captions: [["영상문화복합단지", "(계획)"]] },
  { key: "ark_one", year: "2031", file: "history_img_ark_one.v4.jpg", alt: "청라 아크원 푸르지오 단지 조감도", captions: [["청라 아크원 푸르지오", "(예정)"]] },
];

const BRAND_CARDS = [
  {
    pos: "left",
    file: "brand_img_01.v4.jpg",
    alt: "햇살이 드는 편안한 침실",
    title: ["가장 나에 가까운", "본연의 모습"],
    text: "지친 하루를 마치고 가장 나에 가까운 본연의 모습으로 돌아와 누리는 세련된 편안함. 푸르지오가 그리는 프리미엄입니다.",
  },
  {
    pos: "center",
    file: "brand_img_02.v4.jpg",
    alt: "물결 위에 놓인 돌",
    title: ["가장 편안한", "상태로 살아가길"],
    text: "푸르지오가 끊임없이 사람들의 삶의 질을 고민하고 아파트 단지의 시설과 조경을 아름답게 꾸미며 누구보다 먼저 최첨단 시스템을 활용하는 까닭은 사람들이 이곳에서 누리는 일상의 모든 부분에 어떠한 불편함이나 수고스러움 없이 가장 편안한 상태로 살아가길 바라기 때문입니다.",
  },
  {
    pos: "right",
    file: "brand_img_03.v4.jpg",
    alt: "향초와 와인이 놓인 생활 공간",
    title: ["나를 닮은", "우리 집"],
    text: "나의 가족을 위해 맛있는 요리를 하는 소리, 타닥타닥 타는 향초에서 나는 향긋한 냄새, 따뜻한 커피를 마셨을 때의 온기. 모든 사람, 사물, 공기, 소리, 책, 질감 모두 가장 자연스러운 상태의 나를 닮은 우리 집이 됩니다.",
  },
] as const;

/** 구간(공식 섹션 7개 + 검색용 묶음). 순서는 공식 메인과 같다. */
const SECTIONS = ["hero", "overview", "location", "history", "premium", "brand", "contact", "site-info"] as const;
type SectionId = (typeof SECTIONS)[number];

/** PC 장면 16개(+ 검색용 묶음). 구간 안의 단계는 공식 main.v4.css 의 data-flow-step 값과 같다. */
const SCENES: { sec: SectionId; step: string }[] = [
  { sec: "hero", step: "hero-final" },
  { sec: "hero", step: "hero-definition" },
  { sec: "overview", step: "overview-mask" },
  { sec: "overview", step: "overview-content" },
  { sec: "location", step: "location-01" },
  { sec: "location", step: "location-02" },
  { sec: "history", step: "history-01" },
  { sec: "history", step: "history-02" },
  { sec: "premium", step: "premium-01" },
  { sec: "premium", step: "premium-02" },
  { sec: "premium", step: "premium-03" },
  { sec: "brand", step: "brand-01" },
  { sec: "brand", step: "brand-02" },
  { sec: "brand", step: "brand-03" },
  { sec: "contact", step: "contact-01" },
  { sec: "site-info", step: "info-01" },
];
export const SCENE_COUNT = SCENES.length;

const NAV_ITEMS: { sec: SectionId; label: string }[] = [
  { sec: "hero", label: "HERO" },
  { sec: "overview", label: "OVERVIEW" },
  { sec: "location", label: "LOCATION" },
  { sec: "history", label: "HISTORY" },
  { sec: "premium", label: "PREMIUM" },
  { sec: "brand", label: "BRAND" },
  { sec: "contact", label: "CONTACT" },
];

const REDUCED = "(prefers-reduced-motion: reduce)";
const PC = "(min-width: 1025px)";
const SCENE_MS = 1000;

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

/** 사이트 틀의 실제 높이(운영 주체 표시 줄, 헤더)를 CSS 변수로 넘긴다. 히어로가 헤더 아래까지 깔리는 데 쓴다. */
function useChromeVars(root: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const sync = () => {
      const el = root.current;
      if (!el) return;
      const util = document.querySelector<HTMLElement>(".ak-util");
      const hd = document.querySelector<HTMLElement>(".ak-hd");
      el.style.setProperty("--om-util", `${util?.offsetHeight ?? 0}px`);
      el.style.setProperty("--om-hd", `${hd?.offsetHeight ?? 0}px`);
      el.style.setProperty("--om-vh", `${window.innerHeight}px`);
      el.style.setProperty("--om-scale", String(document.documentElement.clientWidth / 1920));
    };
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [root]);
}

/** 처음 들어올 때의 인트로(공식 main_intro). 문구 순서·시간은 main.v4.css 의 값이다. 「동작 줄이기」면 그리지 않는다. */
function Intro({ onDone }: { onDone: () => void }) {
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const start = window.setTimeout(() => setPlaying(true), 350);
    const end = window.setTimeout(onDone, 5600);
    return () => {
      window.clearTimeout(start);
      window.clearTimeout(end);
    };
  }, [onDone]);
  return (
    <div className={`om-intro${playing ? " is-playing" : " is-loading"}`} aria-label="청라 아크원 푸르지오 인트로" aria-hidden="true">
      <div className="om-intro__loading">
        <span className="om-intro__loading_indicator" />
        <span className="om-intro__loading_label" lang="en">
          LOADING
        </span>
      </div>
      <div className="om-intro__scene">
        <video className="om-intro__video" autoPlay muted loop playsInline preload="auto">
          <source src={asset("intro_video_2.mp4")} type="video/mp4" />
        </video>
        <span className="om-intro__dim" />
        <div className="om-intro__copy om-intro__copy-01">
          <p className="om-intro__phrase">청라의 정점을 빛내는</p>
        </div>
        <div className="om-intro__copy om-intro__copy-02">
          <p className="om-intro__title">푸르지오의 완성</p>
        </div>
        <div className="om-intro__copy om-intro__copy-03">
          <p className="om-intro__kicker">청라 아크원 푸르지오</p>
          <p className="om-intro__brand" lang="en">
            CHEONG NA ARK-ONE PRUGIO
          </p>
        </div>
      </div>
      <button type="button" className="om-intro__skip" onClick={onDone} lang="en" aria-label="인트로 건너뛰기">
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

/** 구간이 보일 때만 영상을 받아 재생한다. 「동작 줄이기」면 포스터만 둔다. */
function LazyVideo({
  src,
  poster,
  className,
  reduced,
  label,
}: {
  src: string;
  poster: string;
  className?: string;
  reduced: boolean;
  label: string;
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
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);
  return (
    <video ref={ref} className={className} poster={poster} muted loop playsInline preload="none" aria-label={label}>
      <source src={src} type="video/mp4" />
    </video>
  );
}

function sectionEl(id: SectionId) {
  return document.getElementById(id);
}

/**
 * PC 장면 전환: 휠·키보드 한 번에 한 장면씩. 같은 구간의 다음 단계면 자리에서 단계만 바뀌고,
 * 다음 구간이면 그 구간으로 화면이 넘어간다. 스크롤 막대로 움직이면 보이는 구간에 맞춘다.
 */
function useScenes(enabled: boolean) {
  const [scene, setScene] = useState(0);
  const sceneRef = useRef(0);
  const busy = useRef(false);
  const timer = useRef(0);

  const apply = useCallback((next: number) => {
    const prev = sceneRef.current;
    sceneRef.current = next;
    setScene(next);
    if (SCENES[next].sec !== SCENES[prev].sec) {
      const el = sectionEl(SCENES[next].sec);
      if (!el) return;
      if (SCENES[next].sec === "hero") window.scrollTo({ top: 0, behavior: "smooth" });
      else el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => {
      const next = sceneRef.current + dir;
      if (next < 0 || next >= SCENES.length || busy.current) return false;
      busy.current = true;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => (busy.current = false), SCENE_MS);
      apply(next);
      return true;
    },
    [apply],
  );

  const goTo = useCallback(
    (sec: SectionId) => {
      const idx = SCENES.findIndex((s) => s.sec === sec);
      if (idx < 0) return;
      busy.current = true;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => (busy.current = false), SCENE_MS);
      apply(idx);
    },
    [apply],
  );

  useEffect(() => {
    if (!enabled) return;
    const scrollBox = (el: HTMLElement, dir: 1 | -1) => {
      const box = el.closest<HTMLElement>("[data-free-scroll]");
      if (!box) return false;
      if (dir === 1) return box.scrollTop + box.clientHeight < box.scrollHeight - 2;
      return box.scrollTop > 2;
    };
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < 4) return;
      const dir: 1 | -1 = e.deltaY > 0 ? 1 : -1;
      const cur = SCENES[sceneRef.current];
      if (cur.sec === "site-info") {
        // 검색용 묶음과 푸터는 일반 스크롤. 맨 위에서 위로 올리면 오시는 길로 돌아간다.
        const top = sectionEl("site-info")?.offsetTop ?? 0;
        if (dir === 1 || window.scrollY > top + 2) return;
      }
      e.preventDefault();
      if (busy.current) return;
      const box = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-free-scroll]");
      if (box && scrollBox(e.target as HTMLElement, dir)) {
        // 구간 안의 긴 패널(브랜드 3)은 한 번에 한 화면씩 그 안에서 먼저 움직인다
        busy.current = true;
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => (busy.current = false), SCENE_MS);
        box.scrollBy({ top: dir * box.clientHeight * 0.92, behavior: "smooth" });
        return;
      }
      go(dir);
    };
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.closest("input, textarea, select, [contenteditable]") || t.closest('[role="dialog"]'))) return;
      if (SCENES[sceneRef.current].sec === "site-info") return;
      if (["ArrowDown", "PageDown", " "].includes(e.key)) {
        e.preventDefault();
        go(1);
      } else if (["ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(-1);
      }
    };
    // 스크롤 막대·링크로 움직였을 때: 화면 가운데에 있는 구간으로 장면을 맞춘다
    const onScroll = () => {
      if (busy.current) return;
      const y = window.scrollY + window.innerHeight / 2;
      let sec: SectionId = SECTIONS[0];
      for (const id of SECTIONS) {
        const el = sectionEl(id);
        if (el && el.offsetTop <= y) sec = id;
      }
      if (sec !== SCENES[sceneRef.current].sec) {
        const first = SCENES.findIndex((s) => s.sec === sec);
        sceneRef.current = first;
        setScene(first);
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer.current);
    };
  }, [enabled, go]);

  return { scene, goTo };
}

/** 구간의 현재 단계: 지금 장면이 그 구간이면 그 단계, 지나왔으면 마지막 단계, 아직이면 첫 단계. */
function stepOf(sec: SectionId, scene: number) {
  const cur = SCENES[scene];
  if (cur.sec === sec) return cur.step;
  const idxs = SCENES.map((s, i) => (s.sec === sec ? i : -1)).filter((i) => i >= 0);
  return scene > idxs[idxs.length - 1] ? SCENES[idxs[idxs.length - 1]].step : SCENES[idxs[0]].step;
}

/** 휴대폰: 아크원이란? 장면이 화면에 들어오면 히어로가 두 번째 상태(흰 배경, 어두운 글자)로 바뀐다. */
function useMobileHeroDefine(enabled: boolean, setDefine: (on: boolean) => void) {
  useEffect(() => {
    if (!enabled) {
      setDefine(false);
      return;
    }
    const el = document.querySelector<HTMLElement>("[data-hero-definition-scene]");
    if (!el) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => setDefine(e.intersectionRatio >= 0.12)), {
      threshold: [0, 0.12, 0.3],
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled, setDefine]);
}

/** 휴대폰: 히스토리 연표를 세로 스크롤에 맞춰 옆으로 움직인다(공식의 스크롤 연동). 「동작 줄이기」면 격자로 둔다. */
function useMobileHistoryTrack(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const timeline = document.querySelector<HTMLElement>("[data-history-timeline]");
    const track = document.querySelector<HTMLElement>("[data-history-track]");
    if (!timeline || !track) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = timeline.getBoundingClientRect();
      const travel = timeline.offsetHeight - window.innerHeight;
      const p = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 1;
      const max = Math.max(0, track.scrollWidth - timeline.clientWidth);
      track.style.transform = `translate3d(${-p * max}px, 0, 0)`;
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.cancelAnimationFrame(raf);
      track.style.transform = "";
    };
  }, [enabled]);
}

export function OfficialMain({ children }: { children?: React.ReactNode }) {
  const reduced = useMedia(REDUCED, true);
  const pc = useMedia(PC, false);
  const [mounted, setMounted] = useState(false);
  const [intro, setIntro] = useState(false);
  const [video, setVideo] = useState(false);
  const [define, setDefine] = useState(false);
  const [visual, setVisual] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setMounted(true);
    if (!window.matchMedia(REDUCED).matches) {
      setIntro(true);
      document.documentElement.setAttribute("data-om-intro", "1");
    }
  }, []);

  // 인트로가 끝나면 알린다(이벤트 팝업은 이 뒤에 연다). 인트로가 없으면 바로 끝난 것으로 본다.
  const endIntro = useCallback(() => {
    setIntro(false);
    document.documentElement.removeAttribute("data-om-intro");
    window.dispatchEvent(new CustomEvent("om:intro-done"));
  }, []);

  const stage = mounted && pc && !reduced; // PC 장면 전환 모드
  const flow = mounted && !stage; // 일반 스크롤 모드(휴대폰, 「동작 줄이기」)
  const { scene, goTo } = useScenes(stage && !intro);
  useChromeVars(root);
  useMobileHeroDefine(flow && !reduced, setDefine);
  useMobileHistoryTrack(flow && !reduced);

  // 히어로 영상: 「동작 줄이기」가 아닐 때만 받아 재생한다(정지컷은 항상 깔려 있다). PC와 휴대폰 영상을 화면 폭으로 고른다.
  useEffect(() => {
    const el = heroVideo.current;
    if (!mounted || reduced || !el) return;
    const src = asset(pc ? "hero_video_3.mp4" : "hero_video_m_2.mp4");
    if (el.getAttribute("src") !== src) {
      el.src = src;
      el.preload = "auto";
      el.load();
    }
    el.play().catch(() => {});
  }, [mounted, reduced, pc]);

  // 프리미엄 첫 장면의 왼쪽 사진은 공식처럼 번갈아 보인다
  useEffect(() => {
    if (!stage || SCENES[scene].step !== "premium-01") return;
    const t = window.setInterval(() => setVisual((v) => (v + 1) % 3), 3200);
    return () => window.clearInterval(t);
  }, [stage, scene]);

  // 헤더: 히어로 영상 위에서는 투명(흰 글자), 아크원이란? 에서는 투명(어두운 글자), 그 밖은 지금 헤더
  useEffect(() => {
    const html = document.documentElement;
    const sync = () => {
      let mode = "";
      if (stage) {
        const step = SCENES[scene].step;
        mode = step === "hero-final" ? "clear" : step === "hero-definition" ? "plain" : "";
      } else if (flow) {
        const hero = sectionEl("hero");
        const limit = (hero?.offsetHeight ?? 0) - window.innerHeight * 0.6;
        mode = window.scrollY < Math.max(limit, 40) ? (define ? "plain" : "clear") : "";
      }
      if (mode) html.setAttribute("data-om-hd", mode);
      else html.removeAttribute("data-om-hd");
    };
    sync();
    window.addEventListener("scroll", sync, { passive: true });
    return () => {
      window.removeEventListener("scroll", sync);
      html.removeAttribute("data-om-hd");
    };
  }, [stage, flow, scene, define]);

  const step = (sec: SectionId) => (stage ? stepOf(sec, scene) : undefined);
  const active = (sec: SectionId) => (stage && SCENES[scene].sec === sec ? " is-active" : "");
  const heroStep = stage ? stepOf("hero", scene) : define ? "hero-definition" : "hero-final";

  return (
    <div
      ref={root}
      data-official-main=""
      className={`om${stage ? " om--stage" : ""}${flow ? " om--flow" : ""}${intro ? " om--intro" : ""}`}
    >
      {intro ? <Intro onDone={endIntro} /> : null}

      {stage ? (
        <nav className="om-nav" aria-label="메인 구간 바로가기">
          <ol>
            {NAV_ITEMS.map((item) => (
              <li key={item.sec}>
                <button
                  type="button"
                  className={SCENES[scene].sec === item.sec ? "is-active" : undefined}
                  onClick={() => goTo(item.sec)}
                  aria-label={`${item.label} 구간으로 이동`}
                  aria-current={SCENES[scene].sec === item.sec ? "true" : undefined}
                >
                  <span className="om-blind">{item.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      ) : null}

      {/* ── 1·2 히어로: 영상, 아크원이란? ───────────────────────────── */}
      <section id="hero" className={`om-s om-hero${active("hero")}`} data-step={heroStep} aria-labelledby="om-hero-title">
        <div className="om-hero__stage">
          <div className="om-hero__viewport">
            <div className="om-hero__background" aria-hidden="true">
              <picture className="om-hero__poster">
                <source media="(max-width: 1024px)" srcSet={asset("hero_bg_m.v4.jpg")} />
                <img src={asset("hero_bg.v4.jpg")} alt="" decoding="async" fetchPriority="high" />
              </picture>
              <video ref={heroVideo} className="om-hero__video" muted loop playsInline preload="none" />
              <span className="om-hero__dim" />
            </div>
            <span className="om-hero__surface" aria-hidden="true" />
            <div className="om-hero__copy">
              <p className="om-hero__title" lang="en" aria-hidden="true">
                <span>CHEONG NA</span>
                <span>ARK-ONE</span>
                <span>PRUGIO</span>
              </p>
              <h1 id="om-hero-title" className="om-hero__h1">
                <span className="om-hero__ko">{ROLE.h1[0]}</span>
                <span className="om-hero__role">{ROLE.h1[1]}</span>
              </h1>
              <span className="om-hero__open">
                <strong>10월 OPEN</strong>예정
              </span>
            </div>
            <div className="om-hero__ui">
              <a className="om-hero__scroll" href="#overview" aria-label="다음 콘텐츠로 이동" onClick={(e) => { if (stage) { e.preventDefault(); goTo("overview"); } }}>
                <span className="om-hero__scroll_line" aria-hidden="true" />
                <span className="om-hero__scroll_label" lang="en">
                  SCROLL
                </span>
              </a>
              <div className="om-hero__video_cta">
                <button type="button" className="om-hero__video_trigger" onClick={() => setVideo(true)} aria-label="청라 아크원 홍보영상 재생">
                  <span className="om-hero__video_label">
                    <b>청라 아크원</b> <br className="om-m-only" />
                    홍보영상
                  </span>
                  <span className="om-hero__video_play" aria-hidden="true">
                    <img src={asset("ico_yt.svg")} alt="" />
                  </span>
                </button>
              </div>
              <div className="om-hero__quick">
                <p className="om-hero__quick_item om-hero__quick_item-policy">
                  <span className="om-blind">분양가 상한제 적용단지</span>
                  <img className="om-hero__quick_orbit" src={asset("hero_circle_text.svg")} alt="" aria-hidden="true" />
                  <img className="om-hero__quick_content" src={asset("hero_circle_01.svg")} alt="" aria-hidden="true" />
                </p>
                <Link to="/register" className="om-hero__quick_item om-hero__quick_item-regist" aria-label={REGISTER_LABEL}>
                  <img className="om-hero__quick_orbit" src={asset("hero_circle_text.svg")} alt="" aria-hidden="true" />
                  <span className="om-hero__quick_register" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4">
                      <circle cx="10" cy="8" r="3.6" />
                      <path d="M3.5 19.5c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
                      <path d="M18.5 6v6M15.5 9h6" />
                    </svg>
                    <b>{REGISTER_LABEL}</b>
                    <small lang="en">REGISTER</small>
                  </span>
                </Link>
              </div>
            </div>
          </div>
          <div className="om-hero__definition_scene" data-hero-definition-scene="">
            <div className="om-hero__transition" aria-hidden="true">
              <img src={asset("hero_brand_img.v4.png")} alt="" loading="lazy" />
            </div>
            <div className="om-hero__definition">
              <span className="om-hero__definition_icon" aria-hidden="true">
                <img src={asset("ico_star.svg")} alt="" />
              </span>
              <p className="om-hero__definition_title">아크원(ARK-ONE)이란?</p>
              <strong className="om-hero__definition_keyword">
                <span aria-hidden="true" lang="en">
                  <b>A</b>BSOLUTE
                  <br />
                  <b>R</b>EMAR
                  <br />
                  <b>K</b>ABLE
                  <br />
                  <b>ONE</b>
                </span>
                <span className="om-blind">ABSOLUTE REMARKABLE ONE</span>
              </strong>
              <p className="om-hero__definition_text">
                청라의 절대적 기준이 될
                <br />단 하나의 주거명작을 상징
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3·4 사업개요 ───────────────────────────────────────────── */}
      <section id="overview" className={`om-s om-overview${active("overview")}`} data-step={step("overview")} aria-labelledby="om-overview-title">
        <div className="om-overview__stage">
          <div className="om-overview__background" aria-hidden="true">
            <img src={asset("overview_bg.v4.jpg")} alt="" loading="lazy" />
            <span className="om-overview__dim" />
          </div>
          <div className="om-overview__content">
            <header className="om-overview__copy">
              <p className="om-overview__copy_text">
                청라 10년의 기다림,
                <br />그 모든 프리미엄을 담은
              </p>
              <h2 id="om-overview-title" className="om-overview__copy_title">
                단 하나의 절대적 명작
              </h2>
              <p className="om-overview__copy_brand" lang="en">
                ARK-ONE
              </p>
            </header>
            <article className="om-overview__panel" aria-labelledby="om-overview-panel-title">
              <h3 id="om-overview-panel-title" className="om-overview__panel_heading">
                총 2,911가구<small>(B1 &amp; M5 블록 · 합산 규모, 단일 단지 아님)</small>
                <br />
                청라를 대표하는
                <br />
                푸르지오 대규모 브랜드타운
              </h3>
              <div className="om-overview__panel_text">
                <p>
                  국제업무단지 B1 블록의 눈부신 성공에 이어
                  <br />
                  M5 블록으로 더 커지는 푸르지오 브랜드타운!
                  <br />
                  청라를 드높일 위대한 가치를 세웁니다
                </p>
              </div>
              <dl className="om-overview__metrics">
                {[
                  ["건축면적", "약", "12,278", "㎡"],
                  ["연면적", "약", "424,558", "㎡"],
                  ["주차대수", "", "3,124", "대"],
                  ["세대수", "", "1,855", "세대"],
                ].map(([label, prefix, value, unit]) => (
                  <div className="om-overview__metric" key={label}>
                    <dt className="om-overview__metric_label">{label}</dt>
                    <dd className="om-overview__metric_value_wrap">
                      <span className="om-blind">{`${prefix}${value}${unit}`}</span>
                      <span className="om-overview__metric_prefix" aria-hidden="true">
                        {prefix}
                      </span>
                      <strong className="om-overview__metric_value" aria-hidden="true">
                        {value}
                      </strong>
                      <span className="om-overview__metric_unit" aria-hidden="true">
                        {unit}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </article>
          </div>
        </div>
      </section>

      {/* ── 5·6 입지 ───────────────────────────────────────────────── */}
      <section id="location" className={`om-s om-location${active("location")}`} data-step={step("location")} aria-labelledby="om-location-title">
        <div className="om-location__inner">
          <div className="om-location__area om-location__area-visual">
            <p className="om-location__tagline" aria-label="ABSOLUTE REMARKABLE" lang="en">
              {[..."ABSOLUTE"].map((c, i) => (
                <span aria-hidden="true" key={`a${i}`}>
                  {c}
                </span>
              ))}
              <span className="om-location__tagline_space" aria-hidden="true">
                &nbsp;
              </span>
              {[..."REMARKABLE"].map((c, i) => (
                <span aria-hidden="true" key={`r${i}`}>
                  {c}
                </span>
              ))}
            </p>
            <img className="om-location__visual_image" src={asset("location_img.v4.png")} alt="" loading="lazy" />
            <div className="om-location__title_mask">
              <h2 id="om-location-title" className="om-location__title" lang="en">
                ARK-ONE
              </h2>
            </div>
          </div>
          <div className="om-location__area om-location__area-info">
            <div className="om-location__title_mask" aria-hidden="true">
              <p className="om-location__title" lang="en">
                ARK-ONE
              </p>
            </div>
            <div className="om-location__content">
              <div className="om-location__copy">
                <p className="om-location__eyebrow" lang="en">
                  CENTRAL LOCATION
                </p>
                <p className="om-location__description">
                  모두가 기다려온 프리미엄의 완성,
                  <br />
                  청라의 중심은 푸르지오.
                </p>
                <Link to="/location" className="om-location__link">
                  <span lang="en">view more</span>
                  <span aria-hidden="true">›</span>
                </Link>
              </div>
              <figure className="om-location__map" role="img" aria-label="청라 국제도시 내 청라 아크원 푸르지오 위치">
                <img className="om-location__map_image" src={asset("location_map.v4.png")} alt="" loading="lazy" />
                <picture className="om-location__bubble">
                  <source media="(max-width: 1024px)" srcSet={asset("location_bubble_m.v4.png")} />
                  <img src={asset("location_bubble.v4.png")} alt="" loading="lazy" />
                </picture>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7·8 히스토리 ───────────────────────────────────────────── */}
      <section id="history" className={`om-s om-history${active("history")}`} data-step={step("history")} aria-labelledby="om-history-title">
        <div className="om-history__timeline" data-history-timeline="">
          <div className="om-history__viewport">
            <div className="om-history__track" data-history-track="">
              <img className="om-history__bg om-history__bg-start" src={asset("histroy_bg_img_01.svg")} alt="" aria-hidden="true" loading="lazy" />
              <img className="om-history__bg om-history__bg-end" src={asset("histroy_bg_img_02.svg")} alt="" aria-hidden="true" loading="lazy" />
              <header className="om-history__intro">
                <span className="om-history__intro_dot" aria-hidden="true" />
                <p className="om-history__intro_eyebrow">푸르지오가 완성하는</p>
                <h2 id="om-history-title" className="om-history__intro_title">
                  청라의 클라이맥스
                </h2>
              </header>
              <ol className="om-history__events">
                {HISTORY_EVENTS.map((ev, i) => (
                  <li className={`om-history__event om-history__event-${ev.key}`} key={ev.key}>
                    {ev.key === "ark_one" ? (
                      <img className="om-history__climax" src={asset("history_climax.v4.png")} alt="Climax" loading="lazy" />
                    ) : null}
                    <div className="om-history__event_item">
                      {ev.tbd ? (
                        <p className="om-history__event_year om-history__event_year-tbd">{ev.year}</p>
                      ) : (
                        <time className="om-history__event_year" dateTime={ev.year} lang="en">
                          <span>20</span>
                          {ev.year.slice(2)}
                        </time>
                      )}
                      <figure className="om-history__event_figure">
                        <img
                          className="om-history__event_bg"
                          src={asset(i % 2 === 0 ? "history_event_bg_01.jpg" : "history_event_bg_02.jpg")}
                          alt=""
                          aria-hidden="true"
                          loading="lazy"
                        />
                        <img className="om-history__event_image" src={asset(ev.file)} alt={ev.alt} loading="lazy" />
                        <figcaption className="om-history__event_caption">
                          {ev.captions.map(([name, note]) => (
                            <span key={name}>
                              {name} <small>{note}</small>
                            </span>
                          ))}
                        </figcaption>
                      </figure>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
        <section className="om-history__promotion" aria-labelledby="om-history-promotion-title">
          <div className="om-history__promotion_brand">
            <h3 id="om-history-promotion-title" className="om-history__promotion_title" aria-label="CHEONG NA ARK-ONE PRUGIO" lang="en">
              <span>CHEONG NA</span>
              <span>ARK-ONE</span>
              <span>PRUGIO</span>
            </h3>
            <p className="om-history__promotion_name">청라 아크원 푸르지오</p>
          </div>
          <div className="om-history__promotion_collage" aria-hidden="true">
            <img className="om-history__promotion_image om-history__promotion_image-02" src={asset("history_img_02.v4.jpg")} alt="" loading="lazy" />
            <img className="om-history__promotion_image om-history__promotion_image-ark_one" src={asset("history_img_03.v4.jpg")} alt="" loading="lazy" />
            <img className="om-history__promotion_image om-history__promotion_image-01" src={asset("history_img_01.v4.jpg")} alt="" loading="lazy" />
          </div>
          <img className="om-history__promotion_logo" src={asset("history_logo.svg")} alt="푸르지오" loading="lazy" />
          <Link to="/register" className="om-history__promotion_link" aria-label={`청라 아크원 푸르지오 ${REGISTER_LABEL}`}>
            <span className="om-history__promotion_link_copy">
              <small>청라 아크원 푸르지오</small>
              <strong>{REGISTER_LABEL}</strong>
            </span>
            <span className="om-history__promotion_link_icon" aria-hidden="true">
              <img src={asset("history_arrow.svg")} alt="" />
            </span>
          </Link>
          <div className="om-history__marquee" aria-hidden="true">
            <div className="om-history__marquee_track">
              <span lang="en">MASTERPLAN PROGRESS — ARKONE</span>
              <span lang="en">MASTERPLAN PROGRESS — ARKONE</span>
            </div>
          </div>
        </section>
      </section>

      {/* ── 9·10·11 프리미엄 ───────────────────────────────────────── */}
      <section id="premium" className={`om-s om-premium${active("premium")}`} data-step={step("premium")} aria-labelledby="om-premium-title">
        <h2 id="om-premium-title" className="om-blind">
          ARK-ONE PREMIUM
        </h2>
        <div className="om-premium__stage">
          <article className="om-premium__panel om-premium__panel-intro">
            <div className="om-premium__intro_split" aria-hidden="true">
              <div className="om-premium__intro_media">
                <img className="om-premium__intro_image om-premium__intro_image-opening" src={asset("premium_img_left_01.v4.jpg")} alt="" loading="lazy" />
                <img className="om-premium__intro_image om-premium__intro_image-family" src={asset("premium_img_left_02.v4.jpg")} alt="" loading="lazy" />
                <div className="om-premium__intro_carousel">
                  {["premium_visual_img_01.v4.jpg", "premium_visual_img_02.v4.jpg", "premium_visual_img_03.v4.jpg"].map((file, i) => (
                    <img
                      key={file}
                      className={`om-premium__intro_image om-premium__intro_image-visual${i === visual ? " is-current" : ""}`}
                      src={asset(file)}
                      alt=""
                      loading="lazy"
                    />
                  ))}
                </div>
              </div>
              <img className="om-premium__intro_texture" src={asset("premium_right_img_01.v4.jpg")} alt="" loading="lazy" />
            </div>
            <p className="om-premium__intro_title" aria-hidden="true" lang="en">
              <span>ARK-ONE &nbsp; PREMIUM</span>
            </p>
            <div className="om-premium__intro_copy" aria-hidden="true">
              <img className="om-premium__intro_icon" src={asset("overview_ico_star.svg")} alt="" loading="lazy" />
              <p lang="en">
                <span>ARK-ONE</span>
                <span>PREMIUM</span>
              </p>
            </div>
            <p className="om-premium__notice">· 이 이미지는 AI로 제작된 것으로서 실제와 다릅니다.</p>
          </article>
          <div className="om-premium__detail">
            <div className="om-premium__detail_background" aria-hidden="true">
              <img src={asset("premium_bg.v4.jpg")} alt="" loading="lazy" />
            </div>
            <article className="om-premium__panel om-premium__panel-lifestyle">
              <div className="om-premium__lifestyle_copy">
                <h3 className="om-premium__lifestyle_title">
                  <span>완벽한</span>
                  <span>라이프스타일</span>
                </h3>
                <p className="om-premium__lifestyle_description">
                  <span>공간의 특별함</span>
                  <span>자부심의 가치</span>
                  <span>정상을 넘어,</span>
                  <span>새로운 라이프스타일의 기준</span>
                </p>
              </div>
              <div className="om-premium__lifestyle_collage">
                <span className="om-premium__decoration om-premium__decoration-circle_top" aria-hidden="true" />
                <span className="om-premium__decoration om-premium__decoration-circle_bottom" aria-hidden="true" />
                <img className="om-premium__decoration om-premium__decoration_stripe" src={asset("premium_conf_03.v4.png")} alt="" aria-hidden="true" loading="lazy" />
                <figure className="om-premium__media om-premium__media-main">
                  <LazyVideo src={asset("premium_video_01.mp4")} poster={asset("premium_img_01.v4.jpg")} reduced={reduced} label="도심의 고층 건축물 영상" />
                  <figcaption>이 영상은 AI로 제작된 것으로서 실제와 다릅니다.</figcaption>
                </figure>
                <figure className="om-premium__media om-premium__media-street">
                  <img src={asset("premium_img_02.v4.jpg")} alt="보행 중심의 상업가로 이미지" loading="lazy" />
                  <figcaption>이미지컷</figcaption>
                </figure>
                <figure className="om-premium__media om-premium__media-terrace">
                  <img src={asset("premium_img_03.v4.jpg")} alt="바다를 바라보는 테라스 이미지" loading="lazy" />
                  <figcaption>이미지컷</figcaption>
                </figure>
              </div>
            </article>
            <article className="om-premium__panel om-premium__panel-residence">
              <div className="om-premium__residence_visual">
                <img className="om-premium__residence_image" src={asset("premium_img_left_03.v4.jpg")} alt="따뜻한 빛이 드는 주거 공간 이미지" loading="lazy" />
                <div className="om-premium__residence_blur">
                  <div className="om-premium__residence_copy">
                    <h3 className="om-premium__residence_title">
                      <span>정점을 넘어</span>
                      <span>완성된 라이프</span>
                    </h3>
                    <p className="om-premium__residence_description">
                      <span>공간의 특별함도</span>
                      <span>자부심의 높이도</span>
                    </p>
                  </div>
                </div>
              </div>
              <figure className="om-premium__video om-premium__video-center">
                <LazyVideo src={asset("premium_video_02.mp4")} poster={asset("premium_poster.v4.jpg")} reduced={reduced} label="주거 공간 영상" />
                <figcaption className="om-premium__video_caption">이 영상은 AI로 제작된 것으로서 실제와 다릅니다.</figcaption>
              </figure>
              <div className="om-premium__video_reel">
                <figure className="om-premium__video om-premium__video-side">
                  <LazyVideo src={asset("premium_video_03.mp4")} poster={asset("premium_poster_02.v4.jpg")} reduced={reduced} label="라이프스타일 영상" />
                  <figcaption className="om-premium__video_caption">이 영상은 AI로 제작된 것으로서 실제와 다릅니다.</figcaption>
                </figure>
                <figure className="om-premium__video_echo">
                  <img src={asset("premium_poster_03.v4.jpg")} alt="" aria-hidden="true" loading="lazy" />
                  <figcaption className="om-premium__video_caption">이미지컷</figcaption>
                </figure>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── 12·13·14·15 브랜드 ─────────────────────────────────────── */}
      <section id="brand" className={`om-s om-brand${active("brand")}`} data-step={step("brand")} aria-labelledby="om-brand-title">
        <h2 id="om-brand-title" className="om-blind">
          BRAND THE NATURAL NOBILITY
        </h2>
        <div className="om-brand__stage">
          <article className="om-brand__panel om-brand__panel-intro">
            <img className="om-brand__panel_background" src={asset("brand_bg.v4.jpg")} alt="" loading="lazy" decoding="async" />
            <div className="om-brand__intro">
              <h3 className="om-brand__intro_title" lang="en">
                THE NATURAL NOBILITY
              </h3>
              <p className="om-brand__intro_copy">
                견고한 기본에 더해진 편안함,
                <br />내 삶의 본연을 집에서 찾다
              </p>
            </div>
          </article>
          <article className="om-brand__panel om-brand__panel-story">
            <img className="om-brand__panel_background" src={asset("brand_bg_02.v4.jpg")} alt="" loading="lazy" decoding="async" />
            <figure className="om-brand__story_visual">
              <img src={asset("brand_visual_img.v4.jpg")} alt="잔잔하게 번지는 물결" loading="lazy" decoding="async" />
              <LazyVideo className="om-brand__story_video" src={asset("brand_video.mp4")} poster={asset("brand_visual_img.v4.jpg")} reduced={reduced} label="자연을 어루만지는 손길 영상" />
              <figcaption>이미지컷</figcaption>
            </figure>
            <p className="om-brand__story_copy">
              <span>공간을 넘어</span>
              <span>삶의 깊이를 담습니다</span>
            </p>
            <p className="om-brand__story_description">
              보이지 않는 곳 디테일까지 당신을 위해 설계된 곳,
              <br />
              공간, 그 이상의 감동이 시작되는
              <br />
              푸르지오를 만나보세요
            </p>
            <div className="om-brand__story_footer" aria-label="Brand Story" lang="en">
              <span>BRAND</span>
              <img src={asset("brand_logo.svg")} alt="" loading="lazy" decoding="async" />
              <span>STORY</span>
            </div>
          </article>
          <article className="om-brand__panel om-brand__panel-gallery">
            <div className="om-brand__gallery_scroll" data-free-scroll="">
              <div className="om-brand__gallery_content">
                <img className="om-brand__panel_background" src={asset("brand_bg_03.v4.jpg")} alt="" loading="lazy" decoding="async" />
                <header className="om-brand__gallery_header">
                  <img className="om-brand__gallery_emblem" src={asset("brand_logo.svg")} alt="" loading="lazy" decoding="async" />
                  <p className="om-brand__gallery_brand" lang="en">
                    PRUGIO
                  </p>
                  <p className="om-brand__gallery_eyebrow" lang="en">
                    THE NATURAL NOBILITY
                  </p>
                  <h3 className="om-brand__gallery_title">본연이 지니는 고귀함</h3>
                  <p className="om-brand__gallery_description">
                    견고한 기본에 더해진 세련된 편안함, <br className="om-m-only" />내 삶의 본연을 집에서 찾다
                  </p>
                </header>
                <div className="om-brand__gallery_visual">
                  <svg className="om-brand__gallery_arc" viewBox="0 0 1700 1700" aria-hidden="true">
                    <defs>
                      <path id="om-brand-arc" d="M 0 850 A 850 850 0 0 1 1700 850" />
                    </defs>
                    <text>
                      <textPath href="#om-brand-arc" startOffset="50%" textAnchor="middle">
                        THE NATURAL NOBILITY
                      </textPath>
                    </text>
                  </svg>
                  <div className="om-brand__gallery_cards">
                    {BRAND_CARDS.map((card) => (
                      <article className={`om-brand__gallery_card om-brand__gallery_card-${card.pos}`} key={card.file}>
                        <img className="om-brand__gallery_image" src={asset(card.file)} alt={card.alt} loading="lazy" decoding="async" />
                        <h4 className="om-brand__gallery_card_title">
                          {card.title[0]} <br className="om-pc-only" />
                          {card.title[1]}
                        </h4>
                        <p className="om-brand__gallery_card_description">{card.text}</p>
                        <span className="om-brand__gallery_dot" aria-hidden="true" />
                      </article>
                    ))}
                  </div>
                  <p className="om-brand__gallery_footer">
                    사람과 자연이 함께하는 <span>프리미엄 주거문화 공간</span>
                  </p>
                  <img className="om-brand__gallery_wordmark" src={asset("brand_img_logo.v4.png")} alt="PRUGIO" loading="lazy" decoding="async" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      {/* ── 16 오시는 길 ──────────────────────────────────────────── */}
      <section id="contact" className={`om-s om-contact${active("contact")}`} data-step={step("contact")} aria-labelledby="om-contact-title">
        <div className="om-contact__background" aria-hidden="true">
          <img src={asset("contact_bg.v4.jpg")} alt="" loading="lazy" decoding="async" />
          <span className="om-contact__background_dim" />
        </div>
        <div className="om-contact__inner">
          <h2 id="om-contact-title" className="om-contact__title" lang="en">
            CONTACT US
          </h2>
          <div className="om-contact__maps">
            <article className="om-contact__map_group">
              <figure className="om-contact__map">
                <img src={asset("contact_map_01.v4.png")} alt="청라 아크원 푸르지오 현장과 견본주택 약도" loading="lazy" decoding="async" />
              </figure>
              <div className="om-contact__location_card">
                {["견본주택", "현장"].map((title) => PLACES.filter((p) => p.title === title).map((p) => <ContactPlace key={p.title} place={p} />))}
              </div>
            </article>
            <article className="om-contact__map_group">
              <figure className="om-contact__map">
                <img src={asset("contact_map_02.v4.png")} alt="청라 아크원 푸르지오 홍보관 약도" loading="lazy" decoding="async" />
              </figure>
              <div className="om-contact__location_card">
                {PLACES.filter((p) => p.title === "홍보관").map((p) => (
                  <ContactPlace key={p.title} place={p} />
                ))}
              </div>
            </article>
          </div>
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

function ContactPlace({ place }: { place: (typeof PLACES)[number] }) {
  return (
    <article className="om-contact__location">
      <div className="om-contact__location_content">
        <h3>{place.title}</h3>
        <address>{place.address}</address>
      </div>
      <div className="om-contact__location_links" aria-label={`${place.title} 지도 바로가기`}>
        <a href={place.naver} target="_blank" rel="noopener noreferrer" aria-label={`네이버 지도에서 ${place.title} 보기`}>
          <img src={common("ico_naver.svg")} alt="" />
        </a>
        <a href={place.kakao} target="_blank" rel="noopener noreferrer" aria-label={`카카오 지도에서 ${place.title} 보기`}>
          <img src={common("ico_kko_map.svg")} alt="" />
        </a>
      </div>
    </article>
  );
}
