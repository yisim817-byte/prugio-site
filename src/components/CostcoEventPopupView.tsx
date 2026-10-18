import { useEffect, useRef, useState } from "react";
import styles from "./CostcoEventPopup.module.css";

const FALLBACK_PHONE = "1533-9014";
const FALLBACK_TEL = "tel:15339014";
const POPUP_KEY = "코스트코 1년 회원권";
const EXISTING = '[aria-labelledby="apt-event-pop-title"]';
const FALLBACK_Z = 51;
const HIDE_KEY = "arkone_costco_pop_hide_until";
const REGISTER = "/register";

type CostcoWindow = Window & { __arkoneCostcoPhone?: string; __arkoneCostcoTel?: string };

function norm(path: string) {
  let p = path.replace(/\/index\.html$/, "/").replace(/\.html$/, "");
  if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
  return p || "/";
}
function skip() {
  const p = norm(location.pathname);
  return p === "/register" || p === "/privacy" || p === "/terms" || p === "/agreement" || p === "/policy";
}
function hidden() {
  try {
    const until = localStorage.getItem(HIDE_KEY);
    return Boolean(until && Date.now() < Number(until));
  } catch {
    return false;
  }
}
function nextKstMidnight() {
  const kst = Date.now() + 9 * 60 * 60 * 1000;
  const d = new Date(kst);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1) - 9 * 60 * 60 * 1000;
}
function existingEl() {
  return document.querySelector<HTMLElement>(EXISTING);
}
function existingOpen() {
  const el = existingEl();
  if (!el) return false;
  if (el.tagName === "DIALOG") return (el as HTMLDialogElement).open;
  const cs = getComputedStyle(el);
  if (cs.display === "none" || cs.visibility === "hidden" || cs.opacity === "0") return false;
  return true;
}

export function CostcoEventPopupView() {
  const [on, setOn] = useState(false);
  const [solo, setSolo] = useState(true);
  const [z, setZ] = useState(FALLBACK_Z);
  const goRef = useRef<HTMLAnchorElement>(null);
  const prev = useRef<HTMLElement | null>(null);
  const w = typeof window === "undefined" ? undefined : (window as CostcoWindow);
  const phone = w?.__arkoneCostcoPhone || FALLBACK_PHONE;
  const tel = w?.__arkoneCostcoTel || FALLBACK_TEL;

  useEffect(() => {
    if (skip() || hidden()) return;
    let dead = false;
    let t0 = Date.now();
    let cap = document.documentElement.hasAttribute("data-om-intro") ? 15000 : 2000;
    let timer = 0;
    const show = () => {
      if (dead) return;
      dead = true;
      const el = existingEl();
      const open = existingOpen();
      let zi = FALLBACK_Z;
      if (el) {
        const n = parseInt(getComputedStyle(el).zIndex, 10);
        if (Number.isFinite(n)) zi = n + 1;
      }
      setZ(zi);
      setSolo(!open);
      setOn(true);
    };
    const tick = () => {
      if (dead) return;
      if (existingOpen()) { show(); return; }
      if (Date.now() - t0 >= cap) { show(); return; }
      timer = window.setTimeout(tick, 60);
    };
    const onIntro = () => { t0 = Date.now(); cap = 2000; tick(); };
    if (document.documentElement.hasAttribute("data-om-intro")) {
      window.addEventListener("om:intro-done", onIntro, { once: true });
      timer = window.setTimeout(show, 15000);
    } else {
      tick();
    }
    return () => {
      dead = true;
      window.clearTimeout(timer);
      window.removeEventListener("om:intro-done", onIntro);
    };
  }, []);

  useEffect(() => {
    if (!on) return;
    prev.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    goRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setOn(false);
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      prev.current?.focus();
    };
  }, [on]);

  function close(today = false) {
    if (today) {
      try { localStorage.setItem(HIDE_KEY, String(nextKstMidnight())); } catch { /* 저장이 막혀도 닫기는 된다 */ }
    }
    setOn(false);
  }

  if (!on) return null;

  return (
    <div className={solo ? `${styles.root} ${styles.solo}` : styles.root} style={{ zIndex: z }}>
      <button type="button" className={styles.dim} aria-label="닫기" onClick={() => close(false)} />
      <div className={styles.panel} role="dialog" aria-modal="true" aria-labelledby="costco-pop-title">
        <p className={styles.band}>청라 아크원 푸르지오 · 사전고객등록 EVENT</p>
        <h2 id="costco-pop-title" className={styles.title}>선착순 1,000명</h2>
        <p className={styles.benefit}>{POPUP_KEY} 증정</p>
        <p className={styles.target}>홈페이지 사전고객등록 후 청약하신 고객 · 청약 당첨 여부와 관계없이</p>
        <a
          ref={goRef}
          className={styles.go}
          href={REGISTER}
          onClick={(event) => {
            event.preventDefault();
            close(false);
            const form = document.getElementById("prereg-form");
            if (form && norm(location.pathname) === REGISTER) {
              form.scrollIntoView({ block: "start" });
              return;
            }
            location.assign(REGISTER);
          }}
        >
          사전고객등록하기
        </a>
        <a className={styles.tel} href={tel}>전화 문의 {phone}</a>
        <p className={styles.note}>※ 선착순 1,000명 마감 시 조기 종료됩니다.</p>
        <p className={styles.note}>※ 선착순 기준·지급 시기·방법은 담당자가 개별 안내합니다.</p>
        <p className={styles.note}>※ 사전고객등록은 공식 청약 신청이 아니며, 등록만으로는 증정되지 않습니다.</p>
        <p className={styles.note}>※ 홈페이지 운영자가 진행하는 이벤트로, 시행·시공사 및 코스트코가 제공하는 혜택이 아닙니다.</p>
        <div className={styles.foot}>
          <button type="button" onClick={() => close(true)}>오늘 하루 보지 않기</button>
          <button type="button" aria-label="닫기" onClick={() => close(false)}>닫기</button>
        </div>
      </div>
    </div>
  );
}
