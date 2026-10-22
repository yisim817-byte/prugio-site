import { useEffect, useRef } from "react";

// 작업지시서 10 · 단계 띠(site_phase). 헤더 바로 아래 본문 흐름 안에 둔다(고정 위치 아님).
// public/phase-band.js(참조 구현 그대로)를 화면을 그린 뒤 불러와 mountInto 로 붙인다.
const PHASE_CFG = {
  fnUrl: "https://jzmktahlrwtrtejjflrw.supabase.co/functions/v1/arkone-site-phase",
  fnHeaders: {}, // arkone-visit-config 호출과 같은 방식(별도 헤더·anon 키 없음)
  registerPath: "/register",
  scheduleHref: "/changeinfo",
  noticeUrl: "https://www.applyhome.co.kr/ai/aia/selectAPTLttotPblancDetail.do?houseManageNo=2026000496&pblancNo=2026000496",
};

type PhaseWindow = Window & {
  ARKONE_PHASE_CFG?: typeof PHASE_CFG;
  ArkonePhaseBand?: { mountInto: (el: HTMLElement | null) => Promise<number | null> };
};

function loadOnce(tag: "script" | "link", url: string): Promise<void> {
  const id = `ak-phase-${tag}`;
  if (document.getElementById(id)) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const el = document.createElement(tag);
    el.id = id;
    if (el instanceof HTMLScriptElement) { el.src = url; el.defer = true; }
    else if (el instanceof HTMLLinkElement) { el.rel = "stylesheet"; el.href = url; }
    el.onload = () => resolve();
    el.onerror = () => reject(new Error(url));
    document.head.appendChild(el);
  });
}

export function PhaseBand() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const w = window as PhaseWindow;
    w.ARKONE_PHASE_CFG = PHASE_CFG;
    let live = true;
    Promise.all([loadOnce("link", "/phase-band.css"), loadOnce("script", "/phase-band.js")])
      .then(() => { if (live && w.ArkonePhaseBand) return w.ArkonePhaseBand.mountInto(ref.current); })
      .catch(() => { /* 띠를 못 불러와도 본문은 그대로 */ });
    return () => { live = false; };
  }, []);
  return <div className="ak-phase-band-slot" ref={ref} />;
}
