import { useEffect, useRef, useState, type RefObject } from "react";

type Kind = "officetel" | "commercial" | "";

export function SoonPopups() {
  const [kind, setKind] = useState<Kind>("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const fromHash = () => {
      if (location.hash === "#popup_soon_officetel") setKind("officetel");
      else if (location.hash === "#popup_soon_commercial") setKind("commercial");
    };
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement | null)?.closest("a[data-popup-soon]");
      if (!link) return;
      const next = link.getAttribute("data-popup-soon");
      if (next !== "officetel" && next !== "commercial") return;
      event.preventDefault();
      opener.current = link as HTMLElement;
      setKind(next);
      history.replaceState(null, "", `#popup_soon_${next}`);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setKind("");
    };
    fromHash();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", fromHash);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("hashchange", fromHash);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (!kind) {
      document.body.style.overflow = "";
      opener.current?.focus();
      return;
    }
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prev;
    };
  }, [kind]);

  function close() {
    setKind("");
    if (location.hash.startsWith("#popup_soon_")) history.replaceState(null, "", location.pathname + location.search);
  }

  return (
    <>
      <Officetel open={kind === "officetel"} close={close} closeRef={closeRef} />
      <Commercial open={kind === "commercial"} close={close} closeRef={closeRef} />
    </>
  );
}

function Officetel({ open, close, closeRef }: { open: boolean; close: () => void; closeRef: RefObject<HTMLButtonElement | null> }) {
  return (
    <div id="popup_soon_officetel" className="popup_soon popup_soon--officetel" hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="popup_soon__dialog" role="dialog" aria-modal="true" aria-labelledby="popup_soon_officetel_title">
        <div className="popup_soon__bg">
          <picture>
            <source media="(max-width: 1024px)" srcSet="/official/soon/officetel_bg_m.png" />
            <img src="/official/soon/officetel_bg.png" alt="" />
          </picture>
        </div>
        <div className="popup_soon__content">
          <p className="popup_soon__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
          <div className="popup_soon__heading">
            <h2 id="popup_soon_officetel_title" className="popup_soon__title">
              <span className="popup_soon__brand">청라 아크원 푸르지오</span>
              <span className="popup_soon__type">오피스텔</span>
            </h2>
          </div>
        </div>
        <p className="popup_soon__lead">청라가 기다리던<br />또하나의 찬란한 순간</p>
        <div className="popup_soon__message">
          <p className="popup_soon__tagline">멀티 발코니 오피스텔</p>
          <p className="popup_soon__coming" lang="en">COMING<br className="m-only" /> SOON</p>
        </div>
        <a className="popup_soon__cta" href="/register?product=officetel">
          <span className="popup_soon__cta_text"><strong>사전고객등록</strong> 바로가기</span>
          <i className="popup_soon__cta_arrow" aria-hidden="true" />
        </a>
        <p className="blind">청라 아크원 푸르지오 오피스텔 오픈 예정입니다. 사전고객등록을 하시면 분양 소식을 받아보실 수 있습니다.</p>
        <p className="popup_soon__note">※본 홈페이지에 사용된 CG 및 일러스트, 이미지 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.</p>
        <button type="button" className="popup_soon__close" aria-label="오피스텔 안내 닫기" ref={open ? closeRef : undefined} onClick={close}>오피스텔 안내 닫기</button>
      </div>
    </div>
  );
}

function Commercial({ open, close, closeRef }: { open: boolean; close: () => void; closeRef: RefObject<HTMLButtonElement | null> }) {
  return (
    <div id="popup_soon_commercial" className="popup_soon popup_soon--commercial" hidden={!open} onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="popup_soon__dialog" role="dialog" aria-modal="true" aria-labelledby="popup_soon_commercial_title">
        <div className="popup_soon__bg">
          <picture>
            <source media="(max-width: 1024px)" srcSet="/official/soon/commercial_bg_m.png" />
            <img src="/official/soon/commercial_bg.png" alt="" />
          </picture>
        </div>
        <div className="popup_soon__content">
          <p className="popup_soon__logo"><img src="/official/soon/logo.svg" alt="PRUGIO" width={257} height={45} /></p>
          <div className="popup_soon__heading">
            <h2 id="popup_soon_commercial_title" className="popup_soon__title">
              <span className="popup_soon__brand">청라 아크원 푸르지오</span>
              <span className="popup_soon__type">상업시설</span>
            </h2>
            <p className="popup_soon__english" lang="en">CHEONGNA ARCONE PRUGIO <br className="m-only" />COMMERCIAL FACILITIES</p>
            <p className="popup_soon__coming" lang="en">COMING<br />SOON</p>
          </div>
        </div>
        <a className="popup_soon__cta" href="/register?product=commercial">
          <span className="popup_soon__cta_text"><strong>사전고객등록</strong> 바로가기</span>
          <i className="popup_soon__cta_arrow" aria-hidden="true" />
        </a>
        <p className="blind">청라 아크원 푸르지오 상업시설 오픈 예정입니다. 사전고객등록을 하시면 분양 소식을 받아보실 수 있습니다.</p>
        <p className="popup_soon__note">※본 홈페이지에 사용된 CG 및 일러스트, 이미지 등은 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.</p>
        <button type="button" className="popup_soon__close" aria-label="상업시설 안내 닫기" ref={open ? closeRef : undefined} onClick={close}>상업시설 안내 닫기</button>
      </div>
    </div>
  );
}
