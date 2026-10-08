import { Link } from "@tanstack/react-router";
import { Nb, PageFaq, QuickAnswer } from "@/components/chrome";
import { OfficialMain } from "@/components/official-main";
import { DEPOSIT, OVERVIEW_ROWS, PLACES, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { REGISTER_LABEL, REGISTER_NOTE } from "@/data/labels";
import { ROLE } from "@/data/role";
import type { Chip, RoleFigure, RoleMain as RoleMainData, SourceItem } from "@/data/role-types";

/**
 * 홈 화면의 구성요소 (저장소마다 같은 파일).
 * 사이트마다 다른 값은 src/data/role.ts 에서만 온다. 표와 목록의 값은 src/data/content.ts 를 그대로 쓴다.
 */

// ── 작은 구성요소 ────────────────────────────────────────────────────────────

/** 상태 칩. 예정(soon)이 기본 모양이고 나머지는 모양이 다르다. */
export function StatusChip({ chip }: { chip: Chip }) {
  return (
    <span className={chip.kind === "soon" ? "ak-chip" : `ak-chip ak-chip--${chip.kind}`}>
      {chip.text}
    </span>
  );
}

/** 출처 캡션. 수치와 일정이 나오는 묶음 아래에 붙인다. */
export function SourceLine({ items }: { items: SourceItem[] }) {
  return (
    <dl className="ak-source">
      {items.map((item) => (
        <div key={item.k} className={item.wide ? "ak-source__wide" : undefined}>
          <dt>{item.k}</dt>
          <dd>{item.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 청약안내 세 페이지로 가는 목록. */
const SUBSCRIPTION = [
  {
    to: "/changeinfo",
    title: "변경된 청약제도",
    desc: "신생아 특별공급 신설, 배우자 통장 가입기간 합산 등 바뀐 제도 요약",
  },
  {
    to: "/docspecial",
    title: "특별공급 안내",
    desc: "기관추천·경제자유구역·다자녀·신혼부부·생애최초·신생아·노부모부양 유형별 비율과 적용 타입",
  },
  {
    to: "/docnormal",
    title: "일반공급 안내",
    desc: "청약 자격, 통장 가입기간과 예치금, 가점제·추첨제 비율",
  },
] as const;

function SubscriptionIndex() {
  return (
    <div className="ak-index">
      {SUBSCRIPTION.map((item) => (
        <Link key={item.to} to={item.to} className="ak-index__row">
          <span>
            <span className="ak-index__t">{item.title}</span>
            <span className="ak-index__d">
              <Nb>{item.desc}</Nb>
            </span>
          </span>
          <span className="ak-link">보기</span>
        </Link>
      ))}
    </div>
  );
}

/** 청약 예치금액 표. 값은 content.ts 의 DEPOSIT. */
export function DepositTable() {
  return (
    <div>
      <table className="ak-tbl">
        <caption>청약 예치금액 · 청라 아크원 푸르지오 적용 타입 기준</caption>
        <thead>
          <tr>
            <th scope="col">면적</th>
            <th scope="col" className="ak-r">
              인천
            </th>
            <th scope="col" className="ak-r">
              서울
            </th>
            <th scope="col" className="ak-r">
              경기
            </th>
          </tr>
        </thead>
        <tbody>
          {DEPOSIT.map(([area, incheon, seoul, gyeonggi]) => (
            <tr key={area}>
              <th scope="row">{area}</th>
              <td className="ak-r">{incheon}</td>
              <td className="ak-r">{seoul}</td>
              <td className="ak-r">{gyeonggi}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <SourceLine
        items={[
          { k: "출처", v: "사업주체 공개자료" },
          { k: "우선 기준", v: "청약홈 예치기준금액, 입주자모집공고" },
        ]}
      />
    </div>
  );
}

/** 현장·견본주택·홍보관 목록. 값은 content.ts 의 PLACES. */
/** 오시는 길 세 곳의 목록(역할 본문의 상태표 아래에서 쓴다). */
function PlacesIndex() {
  return (
    <div className="ak-index">
      {PLACES.map((place) => (
        <div key={place.title} className="ak-index__row">
          <div>
            <p className="ak-index__t">{place.title}</p>
            <p className="ak-index__d">{place.address}</p>
          </div>
          <div className="ak-index__links">
            <a className="ak-link" href={place.naver} target="_blank" rel="noreferrer">
              네이버 지도
            </a>
            <a className="ak-link" href={place.kakao} target="_blank" rel="noreferrer">
              카카오 지도
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── 아치 창 안의 도해 ────────────────────────────────────────────────────────

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function Calendar({ figure }: { figure: Extract<RoleFigure, { kind: "calendar" }> }) {
  const first = new Date(Date.UTC(figure.year, figure.month - 1, 1)).getUTCDay();
  const days = new Date(Date.UTC(figure.year, figure.month, 0)).getUTCDate();
  const cells: (number | null)[] = [
    ...Array.from({ length: first }, () => null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  return (
    <div className="ak-cal">
      <p className="ak-cal__y">{figure.year}</p>
      <p className="ak-cal__m">
        {figure.month}
        <small>월</small>
      </p>
      <div className="ak-cal__grid">
        {WEEKDAYS.map((d) => (
          <b key={d} className="ak-cal__dow">
            {d}
          </b>
        ))}
        {cells.map((day, i) => {
          const mark = day ? figure.marks.find((m) => m.day === day) : undefined;
          return (
            <span key={i} className={mark ? `ak-cal__d ak-cal__d--${mark.style}` : "ak-cal__d"}>
              {mark ? <span>{day}</span> : day}
            </span>
          );
        })}
      </div>
      <ul className="ak-cal__key">
        {figure.marks.map((mark) => (
          <li key={mark.day}>
            <i className={mark.style === "ring" ? "ak-cal__ring" : undefined} />
            {mark.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function MonthPlate({ figure }: { figure: Extract<RoleFigure, { kind: "month" }> }) {
  return (
    <div className="ak-month">
      <p className="ak-cal__y">{figure.year}</p>
      <p className="ak-month__m">
        {figure.month}
        <small>월</small>
      </p>
      <p className="ak-month__s">{figure.status}</p>
      <p className="ak-month__d">{figure.note}</p>
    </div>
  );
}

function AddressPlate({ figure }: { figure: Extract<RoleFigure, { kind: "plate" }> }) {
  return (
    <div className="ak-plate">
      <p className="ak-plate__k">{figure.label}</p>
      <p className="ak-plate__dong">{figure.dong}</p>
      <p className="ak-plate__no ak-num">{figure.no}</p>
      <p className="ak-plate__sub">
        {figure.sub.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <ul className="ak-plate__list">
        {figure.list.map((row) => (
          <li key={row.k}>
            <b>{row.k}</b>
            <span>{row.v}</span>
          </li>
        ))}
      </ul>
      <div className="ak-plate__maps">
        {figure.maps.map((map) => (
          <a key={map.label} className="ak-link" href={map.href} target="_blank" rel="noreferrer">
            {map.label}
          </a>
        ))}
      </div>
    </div>
  );
}

/** 층수 눈금. 지상층은 y 446→96, 지하층은 y 454→486 에 그린다. 눈금은 그림용이며 수치가 아니다. */
function FloorRuler({ figure }: { figure: Extract<RoleFigure, { kind: "ruler" }> }) {
  const top = 96;
  const ground = 446;
  const step = (ground - top) / (figure.top - 1);
  const y = (floor: number) => ground - (floor - 1) * step;
  const under = (level: number) => 454 + (level - 1) * 8;
  const bottom = under(figure.basement);
  const tick = "#f6f3ee";
  return (
    <svg className="ak-ruler" viewBox="0 0 400 560" aria-hidden="true">
      {Array.from({ length: figure.top }, (_, i) => i + 1).map((floor) => {
        const long = floor === 1 || floor === figure.top || floor % 10 === 0;
        return (
          <line
            key={`f${floor}`}
            x1={long ? 142 : 146}
            x2={150}
            y1={y(floor)}
            y2={y(floor)}
            stroke={tick}
            strokeOpacity={long ? 0.9 : 0.4}
          />
        );
      })}
      {Array.from({ length: figure.basement }, (_, i) => i + 1).map((level) => {
        const long = level === figure.basement;
        return (
          <line
            key={`b${level}`}
            x1={long ? 142 : 146}
            x2={150}
            y1={under(level)}
            y2={under(level)}
            stroke={tick}
            strokeOpacity={long ? 0.9 : 0.4}
          />
        );
      })}
      <line x1={150} y1={top} x2={150} y2={bottom} stroke={tick} strokeOpacity={0.75} />
      <line x1={96} y1={450} x2={318} y2={450} stroke="var(--color-sand)" />
      <text x={322} y={454} className="ak-ruler__ground">
        지면
      </text>
      <text x={136} y={top + 4} textAnchor="end" className="ak-ruler__lab">
        {figure.top}F
      </text>
      {[40, 30, 20, 10]
        .filter((floor) => floor < figure.top)
        .map((floor) => (
          <text key={floor} x={136} y={y(floor) + 4} textAnchor="end">
            {floor}
          </text>
        ))}
      <text x={136} y={ground + 1} textAnchor="end" className="ak-ruler__lab">
        1F
      </text>
      <text x={136} y={bottom + 4} textAnchor="end" className="ak-ruler__lab">
        B{figure.basement}
      </text>
      <line x1={186} y1={top} x2={186} y2={ground} stroke={tick} strokeOpacity={0.5} />
      <line x1={180} y1={top} x2={192} y2={top} stroke={tick} strokeOpacity={0.5} />
      <line x1={180} y1={ground} x2={192} y2={ground} stroke={tick} strokeOpacity={0.5} />
      <text x={206} y={248} className="ak-ruler__big">
        {figure.top}
      </text>
      <text x={290} y={248} className="ak-ruler__unit">
        층
      </text>
      <text x={206} y={274}>
        지상 최고층
      </text>
      <line x1={186} y1={454} x2={186} y2={bottom} stroke={tick} strokeOpacity={0.5} />
      <line x1={180} y1={bottom} x2={192} y2={bottom} stroke={tick} strokeOpacity={0.5} />
      <text x={206} y={476}>
        지하 {figure.basement}층
      </text>
      <text x={200} y={528} textAnchor="middle" className="ak-ruler__unit">
        {figure.buildings}
      </text>
    </svg>
  );
}

function Figure({ figure }: { figure: RoleFigure }) {
  if (figure.kind === "plate") {
    // 지도 링크가 들어 있어 그림으로 묶지 않는다
    return (
      <figure className="ak-arch" aria-label={figure.alt}>
        <AddressPlate figure={figure} />
      </figure>
    );
  }
  return (
    <figure
      className={figure.kind === "calendar" ? "ak-arch ak-arch--short" : "ak-arch"}
      role="img"
      aria-label={figure.alt}
    >
      {figure.kind === "calendar" ? <Calendar figure={figure} /> : null}
      {figure.kind === "month" ? <MonthPlate figure={figure} /> : null}
      {figure.kind === "ruler" ? <FloorRuler figure={figure} /> : null}
    </figure>
  );
}

// ── 첫 화면 ──────────────────────────────────────────────────────────────────

/** 검색용 요소 묶음의 머리: 「한눈에 보기」, 등록·전화 버튼, 역할 링크, 아치 창 도해. h1은 공식 히어로에 있다. */
function InfoHead() {
  return (
    <section className="ak-hero" aria-label="한눈에 보기">
      <div className="ak-wrap ak-hero__grid">
        <div>
          <QuickAnswer path="/" bare />
          <PageFaq path="/" />
          <div className="ak-hero__cta">
            <Link to="/register" className="ak-btn ak-btn--primary">
              {REGISTER_LABEL}
            </Link>
            <a href={PROJECT_PHONE_TEL} className="ak-btn ak-btn--line ak-num">
              전화 상담 {PROJECT_PHONE_DISPLAY}
            </a>
            <Link to={ROLE.heroLink.to} className="ak-link">
              {ROLE.heroLink.label}
            </Link>
          </div>
          <p className="ak-hero__note">{REGISTER_NOTE}</p>
        </div>
        <Figure figure={ROLE.figure} />
      </div>
    </section>
  );
}

function RoleStrip() {
  return (
    <section aria-label="핵심 정보">
      <div className="ak-wrap ak-strip__in">
        <div className="ak-strip__grid">
          {ROLE.strip.map((cell) => (
            <div key={cell.label} className="ak-strip__cell">
              <p className="ak-strip__k">
                {cell.no ? <span className="ak-strip__no">{cell.no}</span> : null}
                {cell.label}
                {cell.chip ? <StatusChip chip={cell.chip} /> : null}
              </p>
              <p className="ak-strip__v ak-num">
                {cell.value}
                {cell.unit ? <small>{cell.unit}</small> : null}
              </p>
              <p className="ak-strip__d">
                <Nb>{cell.desc}</Nb>
              </p>
            </div>
          ))}
        </div>
        <SourceLine items={ROLE.stripSource} />
        {ROLE.tone === "paper" ? null : <div className="ak-strip__end" />}
      </div>
    </section>
  );
}

// ── 역할 본문(홈 두 번째 구간) ───────────────────────────────────────────────

function StatusBody({ main }: { main: Extract<RoleMainData, { kind: "status" }> }) {
  return (
    <div className="ak-stack">
      <div>
        <table className="ak-tbl">
          <caption>{main.caption}</caption>
          <thead>
            <tr>
              <th scope="col">시설</th>
              <th scope="col">상태</th>
              <th scope="col">발표 기준 내용</th>
            </tr>
          </thead>
          <tbody>
            {main.rows.map((row) => (
              <tr key={row.name}>
                <th scope="row">{row.name}</th>
                <td>
                  <StatusChip chip={row.chip} />
                </td>
                <td className="ak-num">{row.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <SourceLine items={main.source} />
      </div>
      <div>
        <h3 className="ak-h3">오시는 길</h3>
        <div className="mt-4">
          <PlacesIndex />
        </div>
      </div>
    </div>
  );
}

function MixBody({ main }: { main: Extract<RoleMainData, { kind: "mix" }> }) {
  const columns = main.parts.map((part) => `${part.weight}fr`).join(" ");
  return (
    <div className="ak-stack">
      <div>
        <div className="ak-mix__bar" style={{ gridTemplateColumns: columns }} aria-hidden="true">
          {main.parts.map((part) => (
            <i key={part.title} />
          ))}
        </div>
        <div className="ak-mix__legend" style={{ gridTemplateColumns: columns }}>
          {main.parts.map((part) => (
            <div key={part.title}>
              <p className="ak-mix__n ak-num">
                {part.n}
                <small>{part.unit}</small>
              </p>
              <p className="ak-mix__t">{part.title}</p>
              <p className="ak-mix__d">
                <Nb>{part.desc}</Nb>
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <dl className="ak-kv">
          {OVERVIEW_ROWS.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>
                <Nb>{v}</Nb>
              </dd>
            </div>
          ))}
        </dl>
        <SourceLine items={main.source} />
      </div>
    </div>
  );
}

function RoleMain() {
  const main = ROLE.main;
  return (
    <section className="ak-sec">
      <div className="ak-wrap ak-cols">
        <div>
          <h2 className="ak-h2">
            {main.title[0]}
            <br />
            {main.title[1]}
          </h2>
          <p className="ak-lead">
            <Nb>{main.lead}</Nb>
          </p>
        </div>
        {main.kind === "subscription" ? (
          <div className="ak-stack">
            <SubscriptionIndex />
            <DepositTable />
          </div>
        ) : null}
        {main.kind === "status" ? <StatusBody main={main} /> : null}
        {main.kind === "mix" ? <MixBody main={main} /> : null}
      </div>
    </section>
  );
}

// ── 홈 전체 ──────────────────────────────────────────────────────────────────

const TONE_CLASS = { paper: "ak-zone--paper", mist: "ak-zone--mist", dark: "ak-zone--dark" } as const;

/**
 * 홈 화면 본문. 공식 메인의 7개 구간을 그대로 옮긴 OfficialMain 이 먼저 오고(작업지시서 2),
 * 그 아래 「CONTACT US」 구간 다음·푸터 위에 검색용 요소 묶음(한눈에 보기, 역할 띠, 사이트별 안내)을 둔다.
 * 예전 ROLE.sections 의 공통 구간(사업개요, 입지, 프리미엄, 오시는 길 등)은 복제 구간으로 대체했다.
 */
export function RoleHome() {
  return (
    <OfficialMain>
      <div className={TONE_CLASS[ROLE.tone]}>
        <InfoHead />
        <RoleStrip />
      </div>
      <RoleMain />
    </OfficialMain>
  );
}
