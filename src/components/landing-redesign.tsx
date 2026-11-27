import { useEffect, useId, useRef, useState } from "react";
import { OtPopups } from "@/components/ot-official";
import { validBirth } from "@/lib/lead-input";
import { Footer } from "@/components/chrome";
import { FunnelBeacon } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY as PHONE, PROJECT_PHONE_TEL as TEL } from "@/data/content";
import { LANDING_ANSWER, LANDING_FAQS } from "@/data/landing";
import { submitLead } from "@/lib/leads.functions";
import { PREREG_ONLINE } from "@/data/prereg-mode";
import { trackFunnel } from "@/lib/funnel-client";
import "./landing-redesign.css";

type Product = "apt" | "officetel" | "commercial";
const labels = { apt: "아파트", officetel: "오피스텔", commercial: "상가" };
export const Arrow = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.5" /></svg>;
export const Phone = () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" aria-hidden="true"><path d="m7 3 3 5-3 3c1.6 3.5 3.5 5.3 7 7l3-3 5 3c-1 4-4 4-7 3C8 18 3 13 2 7c0-2 1-4 5-4Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" /></svg>;

const SITE_MENU = [
  ["사업개요", "/overview"], ["히스토리", "/brand"], ["오시는길", "/contact"],
  ["입지환경", "/location"], ["프리미엄", "/premium"], ["평면", "/plans"], ["분양가", "/plans"],
  ["청약안내", "/changeinfo"], ["특별공급", "/docspecial"], ["일반공급", "/docnormal"],
  ["103㎡B", "/103b"], ["아파트 vs 오피스텔 비교", "/compare"], ["언론보도", "/news"], ["홍보영상", "/video"],
  ["견본주택 안내", "/event"], ["방문고객등록", "/visit"],
];

export function SiteMap() {
  return <nav className="rd-sitemap rd-container" aria-label="전체 사이트맵">{SITE_MENU.map(([label, href]) => <a key={label} href={href}>{label}</a>)}</nav>;
}

export function Header({ register }: { register: () => void }) {
  const menu = useRef<HTMLDialogElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => { menu.current?.close(); setMenuOpen(false); };
  return <header className="rd-header"><a className="rd-logo" href="/" aria-label="청라 아크원 푸르지오 홈"><span>ARK-ONE</span><small>청라 아크원 푸르지오</small></a><nav className="rd-nav" aria-label="주요 메뉴"><a href="/#location">입지</a><a href="/#products">상품</a><a href="/#brand">브랜드</a><a href="/#faq">자주 묻는 질문</a></nav><div className="rd-header-actions"><a href={TEL} className="rd-header-phone"><Phone /><span>{PHONE}</span></a><a className="rd-btn rd-btn-outline rd-header-visit" href="/visit">방문고객등록</a><a className="rd-btn rd-btn-gold" href={TEL}>전화로 방문예약<Arrow /></a><button className="rd-menu-toggle" aria-label="전체 메뉴 열기" aria-controls="rd-menu" aria-expanded={menuOpen} onClick={() => { menu.current?.showModal(); setMenuOpen(true); }}><span aria-hidden="true">☰</span></button></div><dialog ref={menu} id="rd-menu" className="rd-menu" aria-label="전체 메뉴" onCancel={() => setMenuOpen(false)} onClick={e => { if (e.target === e.currentTarget) closeMenu(); }}><div className="rd-menu-inner"><button className="rd-close" onClick={closeMenu} aria-label="메뉴 닫기">×</button><p className="rd-kicker">CHEONGNA ARK-ONE PRUGIO</p><h2>전체 메뉴</h2><nav>{SITE_MENU.map(([label, href]) => <a key={label} href={href} onClick={closeMenu}>{label}<Arrow /></a>)}</nav></div></dialog></header>;
}

export function MobileBar({ register }: { register: () => void }) {
  return <nav className="rd-mobile-bar" aria-label="전화와 방문예약"><a href={TEL}><Phone /><span>전화 상담<small>{PHONE}</small></span></a><a href={TEL}>전화로 방문예약<Arrow /></a></nav>;
}

export function RegistrationComplete({ message }: { message: string }) {
  return <div className="rd-form-result" role="status"><p className="rd-kicker">THANK YOU</p><h3>사전등록 완료되었습니다.</h3><p>{message}</p><a className="rd-text-link" href={TEL}>사전고객등록 확인은 대표번호 1533-9014<Arrow /></a></div>;
}

/** 작업지시서 18: 온라인 등록 일시 폐쇄 중에는 폼 대신 전화 등록 안내를 보인다. 폼 코드는 다시 열 때를 위해 그대로 둔다. */
export function PreRegistrationForm(props: { product?: Product | null }) {
  return PREREG_ONLINE ? <PreRegistrationFormOnline {...props} /> : <PhoneRegistration />;
}

function PhoneRegistration() {
  const id = useId();
  return <div className="rd-form-result rd-phone-reg" role="region" aria-labelledby={`${id}-title`} data-prereg="phone">
    <p className="rd-kicker">방문예약 · 전화 접수</p>
    <h3 id={`${id}-title`}>견본주택 방문예약은 전화로만 받습니다.</h3>
    <a className="rd-btn rd-btn-green rd-submit" href={TEL}>전화로 방문예약 {PHONE}<Phone /></a>
    <p>전화로 방문고객등록 후 모델하우스 방문 시 스타벅스 커피 쿠폰 증정</p>
  </div>;
}

function PreRegistrationFormOnline({ product = null }: { product?: Product | null }) {
  const id = useId();
  const [selected, setSelected] = useState<Product | "">(product ?? "");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [preview, setPreview] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const values = new FormData(event.currentTarget);
    const name = String(values.get("name") ?? "").trim();
    const phone = String(values.get("phone") ?? "").replace(/\D/g, "");
    const birth6 = String(values.get("birth6") ?? "").trim();
    if (!selected) { setMessage("오피스텔·상가·아파트 중 등록하실 상품을 선택해 주세요."); return; }
    if (name.length < 2 || name.length > 20) { setMessage("이름은 2~20자로 입력해 주세요."); return; }
    if (!validBirth(birth6)) { setMessage("생년월일은 앞 6자리(YYMMDD)만 입력합니다."); return; }
    if (!/^010\d{8}$/.test(phone)) { setMessage("010으로 시작하는 휴대전화 11자리를 확인해 주세요."); return; }
    if (!values.get("age14")) { setMessage("만 14세 이상만 등록할 수 있습니다."); return; }
    if (!values.get("consent")) { setMessage("개인정보 수집·이용에 동의해야 등록할 수 있습니다."); return; }
    setPending(true); setMessage(""); setPreview(false);
    try {
      const result = await submitLead({ data: { mode: "prereg", product: selected, name, phone, birth6, sido: String(values.get("sido") ?? "").trim(), sigungu: String(values.get("sigungu") ?? "").trim(), dong: String(values.get("dong") ?? "").trim(), consent: true, age14: true, entry: `${window.location.pathname}?product=${selected}` } });
      if (!result.ok) {
        setPreview("preview" in result && result.preview === true);
        setMessage(result.error); return;
      }
      setSuccess(true);
      setMessage(`${result.duplicate ? "같은 번호로 이미 접수되어 있습니다. " : ""}등록 상품 ${labels[selected]} · 접수번호 ${result.receiptNo}`);
      if (!result.duplicate) trackFunnel("form_complete", "register");
    } catch { setMessage("접수를 저장하지 못했습니다. 입력값을 확인한 뒤 다시 시도하거나 1533-9014로 문의해 주세요."); }
    finally { setPending(false); }
  }
  if (success) return <RegistrationComplete message={message} />;
  return <form className="rd-form" onSubmit={submit} onFocusCapture={() => trackFunnel("form_start", "register")} aria-label="사전고객등록" aria-busy={pending}>
    <p className="rd-form-context">청라 아크원 푸르지오 사전고객등록</p>
    <p className="rd-presale-note">오피스텔 청약 12.7(월) · 상가 분양 예정</p>
    <fieldset className="rd-product-options"><legend>등록하실 상품 <span>(필수)</span></legend><div>{(["officetel", "commercial", "apt"] as const).map(value => <label key={value}><input type="radio" name="product" value={value} checked={selected === value} onChange={() => setSelected(value)} required />{labels[value]}</label>)}</div></fieldset>
    <div className="rd-field"><label htmlFor={`${id}-name`}>이름</label><input id={`${id}-name`} name="name" type="text" autoComplete="name" required minLength={2} maxLength={20} placeholder="성함을 입력해 주세요" aria-describedby={message ? `${id}-message` : undefined} /></div>
    <div className="rd-field"><label htmlFor={`${id}-birth6`}>생년월일 앞 6자리</label><input id={`${id}-birth6`} name="birth6" type="text" inputMode="numeric" autoComplete="off" required pattern="[0-9]{6}" minLength={6} maxLength={6} placeholder="YYMMDD" aria-describedby={`${id}-birth-hint`} /><small id={`${id}-birth-hint`}>YYMMDD. 뒷자리는 받지 않습니다.</small></div>
    <div className="rd-field"><label htmlFor={`${id}-phone`}>휴대전화</label><input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={13} placeholder="010-0000-0000" aria-describedby={`${id}-phone-hint${message ? ` ${id}-message` : ""}`} /><small id={`${id}-phone-hint`}>010으로 시작하는 11자리</small></div>
    <details className="rd-consent-details rd-optional-address"><summary>주소 (선택 입력)</summary><div className="rd-field"><label htmlFor={`${id}-sido`}>시·도</label><input id={`${id}-sido`} name="sido" maxLength={20} placeholder="예: 인천광역시" autoComplete="address-level1" /></div><div className="rd-field"><label htmlFor={`${id}-sigungu`}>시·군·구</label><input id={`${id}-sigungu`} name="sigungu" maxLength={20} placeholder="예: 서해구" autoComplete="address-level2" /></div><div className="rd-field"><label htmlFor={`${id}-dong`}>동</label><input id={`${id}-dong`} name="dong" maxLength={20} placeholder="예: 청라동" autoComplete="address-level3" /></div></details>
    <label className="rd-consent"><input type="checkbox" name="age14" required /><span>[필수] 만 14세 이상입니다</span></label>
    <label className="rd-consent"><input type="checkbox" name="consent" required /><span><b>[필수] 개인정보 수집·이용에 동의합니다.</b><span className="rd-consent-copy">문의 1533-9014. 수집 항목·목적·보유기간은 처리방침을 따릅니다.</span> <a href="/privacy" target="_blank" rel="noopener">처리방침</a></span></label>
    {message && <p className={`rd-form-message${preview ? " is-preview" : ""}`} id={`${id}-message`} role={preview ? "status" : "alert"}>{message}</p>}
    <button className="rd-btn rd-btn-green rd-submit" type="submit" disabled={pending}>{pending ? "접수 확인 중…" : selected ? `${labels[selected]} 사전고객등록` : "사전고객등록"}<Arrow /></button>
    <p className="rd-form-note">사전고객등록은 청약·계약이나 세대 배정이 아닙니다.</p>
  </form>;
}

function RegistrationDialog({ open, product, close }: { open: boolean; product: Product | null; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
    if (open) { const old = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = old; }; }
  }, [open]);
  return <dialog ref={dialog} className="rd-dialog" onCancel={close} onClick={(e) => { if (e.target === e.currentTarget) close(); }} aria-labelledby="rd-dialog-title"><div className="rd-dialog-inner"><button className="rd-close" onClick={close} aria-label="등록창 닫기">×</button><p className="rd-kicker">KEEP IN TOUCH</p><h2 id="rd-dialog-title">방문예약</h2><p className="rd-dialog-intro">궁금한 일상에, 한 걸음 더 가까이.</p>{open && <PreRegistrationForm key={product ?? "all"} product={product} />}</div></dialog>;
}

function Hero({ register }: { register: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const manuallyPaused = useRef(false);
  useEffect(() => {
    const el = video.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setPaused(true); return; }
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      el.src = window.matchMedia("(max-width: 760px)").matches ? "/media/official/hero_video_m.mp4" : "/media/official/hero_video.mp4";
      void el.play().catch(() => setPaused(true));
    };
    // Let the priority poster and first content paint before requesting the video.
    const timer = window.setTimeout(start, 1200);
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) el.pause(); else if (el.src && !manuallyPaused.current) void el.play().catch(() => {}); });
    observer.observe(el);
    return () => { cancelled = true; window.clearTimeout(timer); observer.disconnect(); };
  }, []);
  return <section className="rd-hero" id="hero" aria-labelledby="rd-title"><picture className="rd-hero-poster"><source media="(max-width:760px)" srcSet="/redesign/hero-mobile.webp" /><img src="/redesign/hero-desktop.webp" width="1600" height="900" alt="청라 아크원 푸르지오 기존 홍보 영상의 단지 연출 장면" fetchPriority="high" /></picture><video ref={video} className="rd-hero-video" muted loop playsInline preload="none" poster="/redesign/hero-desktop.webp" aria-label="청라 아크원 푸르지오 기존 히어로 영상" /><div className="rd-hero-shade" />
    <div className="rd-hero-inner"><p className="rd-kicker">INCHEON · CHEONGNA · M5</p><p className="rd-hero-line">청라의 다음 일상을 만나다.</p><h1 id="rd-title">청라 아크원<br /><span>푸르지오</span></h1><p className="rd-hero-desc">청라국제도시 M5블록, 대우건설 시공.<br />오피스텔 · 상가 · 아파트</p><p className="rd-hero-presale">오피스텔 청약 12.7(월) · 상가 분양 예정 · 견본주택 방문 사전 예약제</p><div className="rd-hero-actions"><a className="rd-btn rd-btn-gold" href={TEL}>전화로 방문예약<Arrow /></a><a className="rd-btn rd-btn-outline" href={TEL}><Phone />{PHONE}</a></div><a className="rd-hero-notice" href="/103b">103㎡B 선착순 · 참여의향서 11.17(화)부터 견본주택 접수 · 접수 안내 보기 ›</a></div>
    <div className="rd-hero-bottom"><a href="#location">입지부터 살펴보기 <span aria-hidden="true">↓</span></a><p>CG·일부 영상은 연출이며 실제와 다를 수 있습니다.</p><button className="rd-video-toggle" aria-label={paused ? "배경 영상 재생" : "배경 영상 일시정지"} onClick={() => { const el = video.current; if (!el) return; if (el.paused) { if (!el.src) el.src = window.innerWidth <= 760 ? "/media/official/hero_video_m.mp4" : "/media/official/hero_video.mp4"; void el.play(); manuallyPaused.current = false; setPaused(false); } else { el.pause(); manuallyPaused.current = true; setPaused(true); } }}>{paused ? "재생 ▷" : "일시정지 Ⅱ"}</button></div>
  </section>;
}

export function LandingPage() {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const register = (next: Product | null = null) => { setProduct(next); setOpen(true); };
  return <><OtPopups /><div className="rd" data-redesign-home><FunnelBeacon /><a className="rd-skip" href="#main">본문으로 바로가기</a><Header register={() => register()} /><main id="main"><Hero register={() => register()} />
    <section className="rd-location rd-section" id="location" aria-labelledby="rd-location-title"><div className="rd-container"><div className="rd-section-top"><p className="rd-kicker">01 / THE ADDRESS</p><span>청라국제도시 · M5블록</span></div><div className="rd-location-grid"><div><h2 id="rd-location-title">입지는 청라,<br /><em>일상은 더 넓게.</em></h2><p className="rd-lead">살 곳을 고를 때,<br />집 밖의 하루까지 함께 생각합니다.</p><p>청라동 86-1번지. 교통과 생활 인프라를 함께 살펴보는 청라 아크원 푸르지오의 자리입니다.</p><a className="rd-text-link" href="/contact">현장·견본주택 위치 확인<Arrow /></a></div><div className="rd-address-panel"><span className="rd-address-code" aria-hidden="true">M<span>5</span></span><p className="rd-address-name">청라국제도시<br />주상복합용지</p><div className="rd-address-rule" /><p>인천광역시 서해구<br />청라동 86-1번지</p><a href="https://naver.me/xSBYFSR0" target="_blank" rel="noopener noreferrer">네이버 지도에서 보기 ↗</a></div></div>
      <div className="rd-location-lines"><div><span>생활</span><h3>코스트코 청라 · 하나드림타운</h3><p>주변 생활·업무 인프라를 함께 확인하세요.</p></div><div><span>예정</span><h3>돔구장·스타필드 청라 · 서울아산청라병원</h3><p>예정 사업이며 추진 과정에서 변경될 수 있습니다.</p></div><div><span>교통</span><h3>서울 7호선 청라연장선 — 건설 중 · 개통시기 미정</h3></div></div><div className="rd-section-end"><p>교통·개발계획은 관계기관 사정으로 변경·지연·취소될 수 있습니다.</p><button className="rd-text-link" onClick={() => register()}>입지 상담 등록<Arrow /></button></div></div></section>
    <section className="rd-space" aria-labelledby="rd-space-title"><figure><picture><source media="(max-width:760px)" srcSet="/redesign/coastal-lounge-768.webp" /><img src="/redesign/coastal-lounge.webp" alt="아이보리 석재와 햇살, 먼 바다를 표현한 가상의 주거 라운지 연출 이미지" width="1536" height="1024" loading="lazy" decoding="async" /></picture><figcaption>AI 연출 이미지 · 실제 단지·조망·시설과 다릅니다.</figcaption></figure><div className="rd-space-copy"><p className="rd-kicker">A DIFFERENT EVERYDAY</p><h2 id="rd-space-title">나에게 맞는 공간,<br />그 안의 새로운 일상.</h2><p>오피스텔, 상가, 아파트.<br />목적에 맞는 상품부터 살펴보세요.</p><a href="#products" className="rd-text-link">상품 구성 살펴보기<Arrow /></a></div></section>
    <section className="rd-products rd-section" id="products" aria-labelledby="rd-products-title"><div className="rd-container"><div className="rd-section-top"><p className="rd-kicker">02 / YOUR CHOICE</p><span>다른 목적, 분명한 선택</span></div><h2 id="rd-products-title">공간을 고르는<br /><em>세 가지 방식.</em></h2><div className="rd-product-list">
      <article className="rd-product"><div className="rd-product-name"><span>01</span><h3>오피스텔<small>OFFICETEL</small></h3></div><div className="rd-product-description"><p className="rd-product-number">987<small>실</small></p><p>전용 105㎡ · 121㎡ · 136㎡</p><p className="rd-presale-note">오피스텔 청약 12.7(월)</p><p className="rd-product-detail">멀티 발코니 오피스텔.<br />공간 구성과 상품별 조건은 상담으로 확인하세요.</p></div><a className="rd-product-cta" href={TEL}>전화로 방문예약<Arrow /></a></article>
      <article className="rd-product"><div className="rd-product-name"><span>02</span><h3>근린생활시설<small>COMMERCIAL</small></h3></div><div className="rd-product-description"><p className="rd-product-number">1–2<small>층</small></p><p>단지 내 근린생활시설</p><p className="rd-presale-note">분양 예정</p><p className="rd-product-detail">내 사업에 맞는 공간인지,<br />업종·호실별 조건을 확인하세요.</p></div><a className="rd-product-cta" href={TEL}>전화로 방문예약<Arrow /></a></article>
      <article className="rd-product"><div className="rd-product-name"><span>03</span><h3>아파트<small>APARTMENT</small></h3></div><div className="rd-product-description"><p className="rd-product-number">868<small>세대</small></p><p>전용 84㎡ · 103㎡</p><p className="rd-product-detail">분양가상한제 적용 아파트.<br />일부 세대 오션·시티뷰, 동·호별 조건 확인.</p></div><a className="rd-product-cta" href={TEL}>전화로 방문예약<Arrow /></a></article>
    </div><div className="rd-section-end"><p>상품별 분양가·공급 조건은 최신 공식 공고와 상담으로 확인해 주세요.<br />미확정 일정은 추후 공지합니다.</p><span>사업주체 공식 사업개요 기준</span></div></div></section>
    <section className="rd-brand rd-section" id="brand" aria-labelledby="rd-brand-title"><div className="rd-container"><div className="rd-section-top"><p className="rd-kicker">03 / THE BRAND TOWN</p><span>B1 PEAK-ONE + M5 ARK-ONE</span></div><div className="rd-brand-heading"><h2 id="rd-brand-title">두 블록이 만드는<br />푸르지오 브랜드타운.</h2><p>청라 피크원 푸르지오 B1블록과<br />청라 아크원 푸르지오 M5블록의 만남.</p></div><p className="rd-scale"><span>2,911</span><small>세대·실 합산</small></p><p className="rd-scale-note">기존 홈페이지 기재 기준 · B1 + M5 합산 규모이며, 단일 단지가 아닙니다.</p><div className="rd-brand-facts"><div><span>M5 아크원</span><strong>1,855<small>세대·실</small></strong></div><div><span>건축규모</span><strong>6<small>개 동</small></strong></div><div><span>지하 5층 ~ 지상 최고</span><strong>49<small>층</small></strong></div><div><span>시공</span><strong className="rd-builder">대우건설</strong></div></div><p className="rd-brand-summary">{LANDING_ANSWER}</p><div className="rd-section-end"><a href="/overview">사업개요 자세히 보기 ↗</a><button className="rd-text-link" onClick={() => register()}>브랜드타운 상담 등록<Arrow /></button></div></div></section>
    <section className="rd-faq rd-section" id="faq" aria-labelledby="rd-faq-title"><div className="rd-container rd-faq-grid"><div><p className="rd-kicker">04 / GOOD TO KNOW</p><h2 id="rd-faq-title">궁금한 점부터,<br /><em>명확하게.</em></h2><p>계약 전 확인할 정보를 모았습니다.</p><button className="rd-text-link" onClick={() => register()}>더 궁금한 점 상담하기<Arrow /></button></div><div className="rd-faq-list">{LANDING_FAQS.map((item, i) => <details key={item.q}><summary><span>{String(i + 1).padStart(2, "0")}</span>{item.q}<b aria-hidden="true">+</b></summary><p>{item.a}</p></details>)}</div></div></section>
    <section className="rd-contact rd-section" id="consult" aria-labelledby="rd-consult-title"><div className="rd-container rd-contact-grid"><div><p className="rd-kicker">05 / YOUR NEXT STEP</p><h2 id="rd-consult-title">청라의 다음 일상,<br /><em>직접 확인하세요.</em></h2><p className="rd-lead">관심을 남겨주시면<br />궁금한 상품을 안내해 드립니다.</p><a className="rd-contact-phone" href={TEL}>{PHONE}<Arrow /></a><p>청라 아크원 푸르지오 상담 대표번호</p><dl className="rd-contact-address"><dt>견본주택</dt><dd>인천광역시 서해구 청라동 87-1번지<br /><small>견본주택 방문은 사전 예약제입니다. 방문 전 반드시 대표번호로 전화 예약해 주세요.</small></dd></dl><a className="rd-text-link" href="/visit">방문고객등록<Arrow /></a></div><div className="rd-form-panel">{PREREG_ONLINE ? <><h3>사전고객등록</h3><p>상품 선택 후 이름·생년월일 앞 6자리·휴대전화를 입력해 주세요.</p><PreRegistrationForm /></> : <><h3>방문예약</h3><p>견본주택 방문예약은 전화로만 받습니다.</p><a className="rd-btn rd-btn-green rd-submit" href={TEL}>전화로 방문예약 {PHONE}<Phone /></a><p>전화로 방문고객등록 후 모델하우스 방문 시 스타벅스 커피 쿠폰 증정</p></>}</div></div></section>
    <aside className="rd-sources rd-container" aria-label="정보 출처와 유의사항"><p>정보 확인 기준일 · 2026.11.14</p><p>사업주체 공식 사업개요 기준</p><p>본 홈페이지에 사용된 CG 및 일러스트, 이미지 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다. 일부 영상과 연출 이미지는 AI로 제작되었습니다. 개발계획은 변경·지연·취소될 수 있으며 계약 전 주요 내용을 확인하시기 바랍니다.</p></aside>
  </main><SiteMap /><Footer /><MobileBar register={() => register()} /><RegistrationDialog open={open} product={product} close={() => setOpen(false)} /></div></>;
}

export function RegisterPage() {
  const [product, setProduct] = useState<Product | null>(null);
  useEffect(() => { const p = new URLSearchParams(window.location.search).get("product"); if (p === "apt" || p === "officetel" || p === "commercial") setProduct(p); }, []);
  return <div className="rd rd-register-page"><FunnelBeacon /><Header register={() => document.getElementById("preregistration-form")?.scrollIntoView({ behavior: "smooth" })} /><main className="rd-container rd-section"><div className="rd-contact-grid"><div><p className="rd-kicker">CHEONGNA ARK-ONE PRUGIO</p><h1>사전고객등록</h1><p className="rd-lead">청라 아크원 푸르지오,<br />궁금한 일상에 한 걸음 더 가까이.</p><a className="rd-contact-phone" href={TEL}>{PHONE}</a><p>오피스텔 청약 12.7(월) · 상가 분양 예정</p><a className="rd-text-link" href="/">단지 안내로 돌아가기<Arrow /></a></div><div id="preregistration-form" className="rd-form-panel"><PreRegistrationForm key={product ?? "all"} product={product} /></div></div></main><SiteMap /><Footer /><MobileBar register={() => document.getElementById("preregistration-form")?.scrollIntoView({ behavior: "smooth" })} /></div>;
}
