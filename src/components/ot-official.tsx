import { useEffect, useState } from "react";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";

// 작업지시서 16-2: 오피스텔·상업시설 안내는 공식 팝업 디자인(soon-popups.tsx 와 같은 마크업·스타일)을 그대로 쓴다.
// 새 디자인을 만들지 않는다. 바뀌는 것은 놓이는 자리뿐이다 (홈 구역 / 첫 화면 팝업).

type Kind = "officetel" | "commercial";

function SoonCard({ kind, portrait, headingId }: { kind: Kind; portrait?: boolean; headingId: string }) {
  const ot = kind === "officetel";
  const bg = ot ? "officetel_bg" : "commercial_bg";
  return (
    <div className={`popup_soon popup_soon--${kind}`}>
      <div className="popup_soon__dialog">
        <div className="popup_soon__bg">
          {portrait ? (
            <img src={`/official/soon/${bg}_m.png`} alt="" />
          ) : (
            <picture>
              <source media="(max-width: 1024px)" srcSet={`/official/soon/${bg}_m.png`} />
              <img src={`/official/soon/${bg}.png`} alt="" loading="lazy" />
            </picture>
          )}
        </div>
        <div className="popup_soon__content">
          <p className="popup_soon__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
          <div className="popup_soon__heading">
            <h2 id={headingId} className="popup_soon__title">
              <span className="popup_soon__brand">청라 아크원 푸르지오</span>
              <span className="popup_soon__type">{ot ? "오피스텔" : "상업시설"}</span>
            </h2>
            {ot ? null : (
              <>
                <p className="popup_soon__english" lang="en">CHEONGNA ARCONE PRUGIO <br className="m-only" />COMMERCIAL FACILITIES</p>
                <p className="popup_soon__coming" lang="en">COMING<br />SOON</p>
              </>
            )}
          </div>
        </div>
        {ot ? (
          <>
            <p className="popup_soon__lead">청라가 기다리던<br />또하나의 찬란한 순간</p>
            <div className="popup_soon__message">
              <p className="popup_soon__tagline">멀티 발코니 오피스텔</p>
              <p className="popup_soon__coming" lang="en">COMING<br className="m-only" /> SOON</p>
            </div>
          </>
        ) : null}
        <a className="popup_soon__cta" href={PROJECT_PHONE_TEL}>
          <span className="popup_soon__cta_text"><strong>전화로 방문예약</strong></span>
          <i className="popup_soon__cta_arrow" aria-hidden="true" />
        </a>
        <p className="popup_soon__note">※본 홈페이지에 사용된 CG 및 일러스트, 이미지 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.</p>
      </div>
    </div>
  );
}

/** 작업지시서 17-1 (2026-11-13): 103㎡B 선착순 공급 참여의향서 접수 안내 카드. 공식 CG를 쓰지 않는 글자 카드(공식 녹색 바탕)다. 문구는 /103b 원장과 같다. */
function B103Card() {
  return (
    <div className="popup_soon otp-b103">
      <div className="otp-b103__dialog">
        <p className="otp-b103__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
        <h2 id="otp-b103-title" className="otp-b103__title">
          <span className="otp-b103__brand">청라 아크원 푸르지오</span>
          <span className="otp-b103__type">103㎡B</span>
          <span className="otp-b103__kind">선착순 공급</span>
        </h2>
        <p className="otp-b103__label">선착순 공급</p>
        <p className="otp-b103__date">11.28</p>
        <p className="otp-b103__when">2026년 11월 28일(토) 진행 예정</p>
        <p className="otp-b103__cond">참여의향서는 11.17(화)부터 견본주택</p>
        <a className="otp-b103__cta" href="/103b"><strong>접수 안내</strong> 보기 ›</a>
        <p className="otp-b103__note">※ 시간·장소 등 세부 사항은 참여의향서를 접수한 고객에게 문자·전화로 개별 안내합니다.</p>
      </div>
    </div>
  );
}


function StarbucksCard() {
  return (
    <div className="popup_soon otp-b103 otp-starbucks">
      <div className="otp-b103__dialog">
        <p className="otp-b103__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
        <span className="otp-starbucks__icon" aria-hidden="true">
          <svg viewBox="0 0 48 48" fill="none">
            <path d="M14 20h16v10a8 8 0 0 1-8 8h0a8 8 0 0 1-8-8V20z" stroke="currentColor" strokeWidth="1.7" />
            <path d="M30 23h4.2a5.2 5.2 0 0 1 0 10.4H30" stroke="currentColor" strokeWidth="1.7" />
            <path d="M18 14c1 2-.6 2.6.6 4.4M24 12c1 2-.6 2.6.6 4.4M30 14c1 2-.6 2.6.6 4.4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </span>
        <h2 id="otp-starbucks-title" className="otp-b103__title">
          <span className="otp-b103__brand">청라 아크원 푸르지오</span>
        </h2>
        <p className="otp-b103__label">방문 혜택</p>
        <p className="otp-b103__when">방문예약 후 모델하우스 방문 시</p>
        <p className="otp-starbucks__coupon">스타벅스 커피 쿠폰 2장</p>
        <p className="otp-b103__cond">전화로 방문예약을 하신 뒤 견본주택을 방문하시면 드립니다.</p>
        <a className="otp-b103__cta" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
        <p className="otp-b103__note">※ 쿠폰 지급 기준·기간은 {PROJECT_PHONE_DISPLAY}로 확인해 주세요. 사전 공지 후 변경·조기 종료될 수 있습니다.</p>
      </div>
    </div>
  );
}

/** PM 지시(2026-11-18): 견본주택 방문 사전 예약제 안내 카드. 직원 사이트는 고객등록란이 없으므로 전화 예약만 안내한다. 11-15 의 예비당첨자 사전고객등록 카드 자리(맨 앞)를 대신한다. 103㎡B 카드와 같은 글자 카드. */
function VisitCard() {
  return (
    <div className="popup_soon otp-b103 otp-visit">
      <div className="otp-b103__dialog">
        <p className="otp-b103__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
        <h2 id="otp-visit-title" className="otp-b103__title">
          <span className="otp-b103__brand">청라 아크원 푸르지오</span>
          <span className="otp-b103__type">견본주택</span>
          <span className="otp-b103__kind">방문예약</span>
        </h2>
        <p className="otp-b103__label">사전 예약제 운영</p>
        <p className="otp-b103__date">예약 필수</p>
        <p className="otp-b103__when">예약 없이 방문하시면 입장·상담이 제한될 수 있습니다</p>
        <p className="otp-b103__cond">방문 전 반드시 대표번호로 전화 예약해 주세요</p>
        <a className="otp-b103__cta" href={PROJECT_PHONE_TEL}><strong>전화 예약</strong> {PROJECT_PHONE_DISPLAY} ›</a>
        <p className="otp-b103__note">※ 방문예약은 담당자 확인 후 확정됩니다. 방문예약은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>
      </div>
    </div>
  );
}

/** 홈 히어로 바로 아래: 공식 오피스텔·상업시설 안내 화면 2장을 구역으로 놓는다. */
export function OtFeature() {
  return (
    <section id="officetel" className="otf" aria-label="오피스텔 · 상업시설 안내">
      <SoonCard kind="officetel" headingId="otf-officetel-title" />
      <div id="commercial">
        <SoonCard kind="commercial" headingId="otf-commercial-title" />
      </div>
    </section>
  );
}

// 17-1: 카드 구성이 바뀌어 키를 새로 쓴다(전에 「오늘 하루 보지 않기」를 누른 방문자에게도 한 번 보인다).
const KEY = "popup_20261125";

/** 첫 화면 팝업: 103㎡B 선착순 안내 카드 + 공식 오피스텔·상업시설 팝업(세로) 2장. 17-1 에서 크기를 줄였다. */
export function OtPopups() {
  const [open, setOpen] = useState(false);
  const [today, setToday] = useState(false);
  const [showB103, setShowB103] = useState(false);

  useEffect(() => {
    let hide = false;
    try {
      hide = Number(localStorage.getItem(KEY) || 0) > Date.now();
    } catch {
      /* ignore */
    }
    setShowB103(Date.now() < Date.UTC(2026, 10, 28, 15, 0, 0));
    setOpen(!hide);
  }, []);

  function close() {
    if (today) {
      try {
        localStorage.setItem(KEY, String(Date.now() + 24 * 60 * 60 * 1000));
      } catch {
        /* ignore */
      }
    }
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, today]);

  if (!open) return null;

  return (
    <div className="otp" role="dialog" aria-modal="true" aria-label="견본주택 방문예약 · 103㎡B 선착순 · 오피스텔 · 상업시설 안내" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="otp__wrap">
        <button type="button" className="otp__close" onClick={close}>팝업닫기 ✕</button>
        <div className="otp-row">
          <StarbucksCard />
          <VisitCard />
          {showB103 ? <B103Card /> : null}
          <SoonCard kind="officetel" portrait headingId="otp-officetel-title" />
          <SoonCard kind="commercial" portrait headingId="otp-commercial-title" />
        </div>
        <p className="otp__hint" aria-hidden="true">‹ 옆으로 넘겨 보기 ›</p>
        <label className="otp__today">
          <input type="checkbox" checked={today} onChange={(e) => setToday(e.target.checked)} />
          오늘 하루 보지 않기
        </label>
      </div>
    </div>
  );
}
