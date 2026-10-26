import { Link, Outlet, createFileRoute, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type KeyboardEvent } from "react";
import { Shell } from "@/components/layout";
import { DRAW_DAYS, EVENT_RANGE, VISIT_BASIC, VISIT_GIFTS, defaultDrawIndex } from "@/lib/open-event";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { SEO_ORIGIN } from "@/data/seo";

const DESC = "견본주택 오픈 3일 방문·상담 사은품과 매일 16시 경품 추첨, 청약·당첨 고객 이벤트 안내.";
const TITLE = "견본주택 오픈 이벤트 | 청라 아크원 푸르지오";

export const Route = createFileRoute("/event")({
  component: EventGate,
  head: ({ matches }) => {
    const leaf = matches[matches.length - 1];
    if (leaf?.pathname !== "/event") return {};
    return {
      meta: [
        { title: TITLE },
        { name: "description", content: DESC },
        { name: "robots", content: "index, follow" },
        { property: "og:title", content: TITLE },
        { property: "og:description", content: DESC },
        { property: "og:url", content: `${SEO_ORIGIN}/event` },
      ],
      links: [{ rel: "canonical", href: `${SEO_ORIGIN}/event` }],
    };
  },
});

function EventGate() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/event" && pathname !== "/event/") return <Outlet />;
  return (
    <Shell>
      <EventArticle />
    </Shell>
  );
}

function EventArticle() {
  const [tab, setTab] = useState(0);
  useEffect(() => { setTab(defaultDrawIndex()); }, []);

  function onTabKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const next = event.key === "ArrowRight" ? (index + 1) % DRAW_DAYS.length : (index + DRAW_DAYS.length - 1) % DRAW_DAYS.length;
    setTab(next);
    document.getElementById(`oe-tab-${DRAW_DAYS[next].id}`)?.focus();
  }

  return (
          <article className="oe">
        <header className="oe-hero">
          <p className="oe-hero__eye">GRAND OPEN EVENT</p>
          <h1>견본주택 오픈 3일 이벤트</h1>
          <p className="oe-hero__sub">{EVENT_RANGE} · 인천광역시 서해구 청라동 87-1 견본주택</p>
          <div className="oe-hero__actions">
            <Link className="oe-btn oe-btn--gold" to="/visit">방문예약</Link>
            <a className="oe-btn oe-btn--line" href={PROJECT_PHONE_TEL}>전화 문의 {PROJECT_PHONE_DISPLAY}</a>
          </div>
        </header>

        <section className="oe-sec" id="visit-gift" aria-labelledby="oe-visit-title">
          <h2 id="oe-visit-title">방문 고객 사은품</h2>
          <i className="oe-rule" aria-hidden="true" />
          <div className="oe-table-wrap">
            <table className="oe-table">
              <caption>오픈 3일 방문 고객 사은품</caption>
              <thead>
                <tr>
                  {VISIT_GIFTS.map((col) => (
                    <th key={col.day} scope="col">
                      <span>{col.day}</span>
                      <small>{col.date}</small>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {VISIT_GIFTS.map((col) => (
                    <td key={col.day}>
                      <b className="oe-gold">{col.limit}</b>
                      <span>{col.gift}</span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <div className="oe-cards">
            {VISIT_GIFTS.map((col) => (
              <article className="oe-card" key={col.day}>
                <h3>{col.day} · {col.date}</h3>
                <p className="oe-gold">{col.limit}</p>
                <p>{col.gift}</p>
              </article>
            ))}
          </div>
          <p className="oe-basic"><b>기본 사은품</b> · 방문 고객 전원 · {VISIT_BASIC}</p>
        </section>

        <section className="oe-sec" id="consult-gift" aria-labelledby="oe-consult-title">
          <h2 id="oe-consult-title">상담 고객 사은품</h2>
          <i className="oe-rule" aria-hidden="true" />
          <div className="oe-pair">
            <article className="oe-card">
              <h3>선착순 일차별 500명</h3>
              <p>GS 선택형 쿠폰 1장</p>
              <p className="oe-muted">쿠폰의 QR을 촬영한 뒤 목록에서 원하는 브랜드·상품을 고릅니다.</p>
            </article>
            <article className="oe-card">
              <h3>기본</h3>
              <p>분양안내문 (커뮤니티 + 단위세대 평면 및 옵션)</p>
              <p className="oe-muted">상담 고객 전원</p>
            </article>
          </div>
        </section>

        <section className="oe-sec" id="draw" aria-labelledby="oe-draw-title">
          <h2 id="oe-draw-title">매일 16시 경품 추첨</h2>
          <i className="oe-rule" aria-hidden="true" />
          <div className="oe-tabs" role="tablist" aria-label="일차별 경품">
            {DRAW_DAYS.map((day, index) => (
              <button
                key={day.id}
                id={`oe-tab-${day.id}`}
                type="button"
                role="tab"
                aria-selected={tab === index}
                aria-controls={`oe-panel-${day.id}`}
                tabIndex={tab === index ? 0 : -1}
                className={tab === index ? "is-on" : ""}
                onClick={() => setTab(index)}
                onKeyDown={(event) => onTabKey(event, index)}
              >
                <span>{day.label}</span>
                <small>{day.date}</small>
              </button>
            ))}
          </div>
          <div className="oe-draw-grid">
            {DRAW_DAYS.map((day, index) => (
              <div
                key={day.id}
                id={`oe-panel-${day.id}`}
                role="tabpanel"
                aria-labelledby={`oe-tab-${day.id}`}
                hidden={tab !== index}
                className="oe-draw-col"
              >
                <h3 className="oe-draw-col__h">{day.label}<small>{day.date}</small></h3>
                <ol>
                  {day.prizes.map((prize) => (
                    <li key={prize.rank} className={prize.rank === "1등" ? "is-first" : ""}>
                      <span className="oe-rank">{prize.rank}</span>
                      <strong>{prize.name}</strong>
                      <em>{prize.count}</em>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
          <p className="oe-note">※ 추첨 대상·응모 방법·당첨 발표는 견본주택 현장에서 안내합니다.</p>
        </section>

        <section className="oe-sec" id="after" aria-labelledby="oe-after-title">
          <h2 id="oe-after-title">청약·당첨 고객 이벤트</h2>
          <i className="oe-rule" aria-hidden="true" />
          <div className="oe-pair">
            <article className="oe-card">
              <h3>청약 인증 고객</h3>
              <p>코스트코 골드스타 연간 회원권</p>
              <p className="oe-muted">수량 한정</p>
            </article>
            <article className="oe-card">
              <h3>당첨자 서류접수 고객</h3>
              <p>현대명품 금쌀</p>
            </article>
          </div>
          <p className="oe-note">※ 인증 기간·방법은 견본주택에서 안내합니다.</p>
        </section>

        <section className="oe-sec" id="notice" aria-labelledby="oe-notice-title">
          <h2 id="oe-notice-title">유의사항</h2>
          <i className="oe-rule" aria-hidden="true" />
          <ul className="oe-notice">
            <li>선착순 사은품은 일차별 수량 소진 시 종료됩니다.</li>
            <li>경품 추첨은 매일 16시에 진행하며, 추첨 대상·응모 방법·당첨 발표·제세공과금 등 세부 사항은 견본주택 현장에서 안내합니다.</li>
            <li>사은품과 경품은 사정에 따라 동급 상품으로 바뀔 수 있습니다.</li>
            <li>이벤트 내용은 사업주체 사정에 따라 변경되거나 조기 종료될 수 있습니다.</li>
            <li>이 페이지의 이벤트는 견본주택 현장 이벤트로, 홈페이지 사전고객등록 이벤트와는 별개입니다(백화점 상품권 30만원·코스트코 1년 회원권은 사전고객등록 페이지에서 안내).</li>
          </ul>
        </section>

        <div className="oe-cta">
          <Link className="oe-btn oe-btn--solid" to="/visit">방문예약</Link>
          <Link className="oe-btn oe-btn--line-dark" to="/register">사전고객등록</Link>
          <a className="oe-btn oe-btn--line-dark" href={PROJECT_PHONE_TEL}>전화 문의 {PROJECT_PHONE_DISPLAY}</a>
        </div>
      </article>
  );
}
