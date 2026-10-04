import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { OPERATOR_NOTICE, PROJECT_NAME, REGISTER_LABEL } from "@/data/labels";
import { SEO_PAGES, SEO_SOURCE_LINE } from "@/data/seo";

/**
 * 모든 화면이 함께 쓰는 틀 (저장소마다 같은 파일).
 * 운영 주체 표시 줄, 헤더, 푸터, 모바일 하단 바, 상세 페이지 머리, 「한눈에 보기」.
 * 스타일은 src/styles.css 의 ak- 클래스에 있다.
 */

/** 헤더 위 한 줄. 이 사이트의 운영 주체를 모든 화면에서 먼저 밝힌다. */
export function UtilityBar() {
  return (
    <div className="ak-util" role="note" aria-label="사이트 운영 안내">
      <p className="ak-wrap">
        <b>{OPERATOR_NOTICE[0]}</b> <span>{OPERATOR_NOTICE[1]}</span>
      </p>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const menu = NAV.filter((item) => item.href !== "/register");
  return (
    <header className="ak-hd">
      <div className="ak-wrap ak-hd__row">
        <Link to="/" className="ak-hd__brand" aria-label={`${PROJECT_NAME} 홈`}>
          <span className="ak-hd__name">{PROJECT_NAME}</span>
          <span className="ak-hd__sep" aria-hidden="true" />
          <span className="ak-hd__mark" aria-hidden="true">
            PRUGIO
          </span>
        </Link>
        <nav className="ak-hd__nav" aria-label="주요 메뉴">
          {menu.map((item) => (
            <div key={item.en} className="ak-hd__item">
              <Link to={item.href}>{item.label}</Link>
              {item.children && item.children.length > 1 ? (
                <div className="ak-hd__sub">
                  {item.children.map((child) => (
                    <Link key={child.href + child.label} to={child.href}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        <a href={PROJECT_PHONE_TEL} className="ak-hd__tel ak-num">
          <small>상담</small>
          {PROJECT_PHONE_DISPLAY}
        </a>
        <Link to="/register" className="ak-btn ak-btn--primary ak-btn--sm ak-hd__cta">
          {REGISTER_LABEL}
        </Link>
        <button
          type="button"
          className="ak-hd__menu"
          aria-expanded={open}
          aria-controls="ak-menu"
          aria-label={open ? "메뉴 닫기" : "전체 메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open ? (
        <div id="ak-menu" className="ak-hd__panel">
          <div className="ak-wrap">
            {menu.map((item) => {
              const children = item.children ?? [{ label: item.label, href: item.href }];
              return (
                <div key={item.en} className="ak-hd__group">
                  {children.length > 1 ? <p>{item.label}</p> : null}
                  {children.map((child) => (
                    <Link
                      key={child.href + child.label}
                      to={child.href}
                      onClick={() => setOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="ak-ft">
      <div className="ak-wrap ak-ft__in">
        <div>
          <p className="ak-ft__name">{PROJECT_NAME}</p>
          <p>안내 사이트</p>
        </div>
        <div>
          <dl>
            <div>
              <dt>운영·개인정보 처리자</dt>
              <dd>HUMANE 운영자. 대표번호 {PROJECT_PHONE_DISPLAY}.</dd>
            </div>
            <div>
              <dt>사업 주체</dt>
              <dd>
                시행 ㈜청라스마트시티 · 시공 대우건설. 공식 홈페이지에 적힌 사업 주체이며, 이
                사이트를 운영한다는 뜻이 아닙니다.
              </dd>
            </div>
            <div>
              <dt>고지</dt>
              <dd>
                CG·이미지·일부 영상은 이해를 돕기 위한 것이며 실제와 다를 수 있습니다. 개발계획은
                관계기관 사정으로 변경·취소될 수 있습니다. 주소의 행정구역은 계약 전 확인이
                필요합니다.
              </dd>
            </div>
            <div>
              <dt>상표</dt>
              <dd>PRUGIO 상표권은 대우건설에 있습니다.</dd>
            </div>
          </dl>
          <div className="ak-ft__links">
            <Link to="/privacy">개인정보처리방침</Link>
            <Link to="/register">{REGISTER_LABEL}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/** 등록·로그인·관리 화면에서는 하단 바를 띄우지 않는다. */
const NO_BAR = ["/register", "/login", "/admin"];

/** 모바일 화면 아래에 붙어 있는 전화·등록 2칸. 641px부터는 스타일에서 숨긴다. */
export function MobileBar() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (NO_BAR.some((p) => path === p || path.startsWith(`${p}/`))) return null;
  return (
    <nav className="ak-mbar" aria-label="빠른 연결">
      <a href={PROJECT_PHONE_TEL}>전화 상담</a>
      <Link to="/register">{REGISTER_LABEL}</Link>
    </nav>
  );
}

/** 「낱말·」 묶음, 「숫자㎡」, 「개통 시기 미정」. 줄이 가운뎃점으로 시작하거나 한 덩어리 표기가 갈라지지 않게 묶는다. */
const KEEP_TOGETHER = /([^\s·]+·|\d[\d,.]*㎡|개통 시기 미정)/g;

/** 글자는 한 자도 바꾸지 않고, 갈라지면 안 되는 묶음에 줄바꿈 금지 태그만 씌운다. */
export function Nb({ children }: { children: string }) {
  return (
    <>
      {children.split(KEEP_TOGETHER).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="whitespace-nowrap">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}

/** 상세 페이지 머리. 이미지 없이 경로와 제목만 둔다. en은 예전 영문 라벨 자리로, 더 이상 그리지 않는다. */
export function SubHero({ title, crumbs }: { en?: string; title: string; crumbs: string }) {
  return (
    <section className="ak-pagehead">
      <div className="ak-wrap">
        <p className="ak-pagehead__crumbs">{crumbs}</p>
        <h1>{title}</h1>
      </div>
    </section>
  );
}

/**
 * 역할 페이지의 「한눈에 보기」 직답 문단. 문구는 src/data/seo.ts 의 값을 그대로 쓴다.
 * 역할 페이지가 아니면 아무것도 그리지 않는다. bare는 히어로 안에 넣을 때 쓴다.
 */
export function QuickAnswer({ path, bare = false }: { path: string; bare?: boolean }) {
  const seo = SEO_PAGES[path];
  if (!seo) return null;
  const body = (
    <div className="ak-qa" role="group" aria-labelledby="quick-answer-title">
      <h2 id="quick-answer-title" className="ak-qa__h">
        한눈에 보기
      </h2>
      <p className="ak-qa__p">
        <Nb>{seo.answer}</Nb>
      </p>
      <p className="ak-qa__src">{SEO_SOURCE_LINE}</p>
    </div>
  );
  if (bare) return body;
  return (
    <section className="ak-qa-band">
      <div className="ak-wrap">{body}</div>
    </section>
  );
}
