#!/usr/bin/env node
/**
 * 디자인 고도화 검수 스크립트 (세 사이트 공통, 저장소마다 같은 파일).
 *
 * 로컬 미리보기 서버(npm run build && npm run preview → http://127.0.0.1:8081)에 대고 돌린다.
 *
 *   node scripts/design-check.mjs selftest
 *   node scripts/design-check.mjs capture [--base URL] [--out design-baseline.json]
 *   node scripts/design-check.mjs verify  [--base URL] [--baseline design-baseline.json] [--shots DIR]
 *   node scripts/design-check.mjs verify  --only /,/premium --widths 1280,390   (고치는 중에 쓰는 부분 검사)
 *   node scripts/design-check.mjs verify  --official-assets 폴더   (공식 서버 요청을 그 폴더의 파일로 바꿔 넣고 깨진 이미지를 검사)
 *
 * capture: 디자인을 고치기 전(main)의 검색 설정·전화 링크·직답 문단을 기록한다.
 * verify : 고친 뒤 화면이 그 기록과 같은지, 그리고 디자인 규격(가로 넘침, 문구 규칙, 글자 대비)을 지키는지 검사한다.
 *          모든 검사를 통과했을 때만 마지막 줄에 "design-check passed"를 찍고 0으로 끝난다.
 *          --only, --widths 로 범위를 줄인 부분 검사는 통과해도 "design-check passed"를 찍지 않는다.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const ROUTES = [
  "/",
  "/overview",
  "/brand",
  "/contact",
  "/location",
  "/premium",
  "/changeinfo",
  "/docspecial",
  "/docnormal",
  "/news",
  "/video",
  "/register",
  "/event/apt",
  "/privacy",
  "/login",
];
const WIDTHS = [1280, 1200, 1024, 768, 390, 360];
const SHOT_ROUTES = [
  "/",
  "/changeinfo",
  "/docspecial",
  "/premium",
  "/location",
  "/overview",
  "/contact",
  "/register",
];
const NO_MOBILE_BAR = ["/register", "/login"];
const NOTICE = "공식 홈페이지가 아닙니다";

// ── 문구 규칙 ────────────────────────────────────────────────────────────────
const BANNED = [
  "확정수익",
  "수익 보장",
  "수익보장",
  "원금 보장",
  "원금보장",
  "무조건",
  "반드시 오",
  "대박",
  "급매",
  "초역세권",
  "지금 아니면",
  "안전한 투자",
  "마감 임박",
  "완판 임박",
];
const findBanned = (text) => BANNED.filter((w) => text.includes(w));

/** 등록 이름은 「사전고객등록」 하나다. 예전 이름의 어떤 꼴(관심고객등록, 관심고객 등록, 관심고객)도 남기지 않는다. */
const OLD_REGISTER_WORD = "관심고객";

/** 홈의 복제 구간을 감싸는 표시(작업지시서 2). 이 안에서는 공식 문구 때문에 걸리는 표기 규칙 일부를 제외한다. */
const OFFICIAL_MARK = "data-official-main";
/** 복제 구간 안에서 제외하는 표기 규칙. 보고서에 그대로 적는다. */
const OFFICIAL_EXEMPT = ["홈의 영문 대문자 라벨", "h1 서체(Hahmlet) 지정"];
/** 홈에 남아 있으면 안 되는 공식 문의 번호와 외부 예약 주소(3절 2번). */
const OFFICIAL_PHONE = /1833[-\s.]?3872/;
const OFFICIAL_BOOKING = /here-customer/i;

/**
 * 홈이 부를 수 있는 공식 서버 파일(작업지시서 3의 6절). 2026-10-05 공식 메인이 쓰는 71개(official-assets/_status.txt).
 * /resources/img/ 뒤의 경로다. 목록에 없는 이름을 부르면 실패다(없어진 파일을 불러 깨진 이미지가 보이는 것을 막는다).
 */
const OFFICIAL_FILES = new Set([
  "common/ico_kko_map.svg",
  "common/ico_naver.svg",
  "common/logo_daewoo.svg",
  "common/logotype.svg",
  "common/popup_closeBtn.v4.png",
  "pages/main/brand_bg.v4.jpg",
  "pages/main/brand_bg_02.v4.jpg",
  "pages/main/brand_bg_03.v4.jpg",
  "pages/main/brand_img_01.v4.jpg",
  "pages/main/brand_img_02.v4.jpg",
  "pages/main/brand_img_03.v4.jpg",
  "pages/main/brand_img_logo.v4.png",
  "pages/main/brand_logo.svg",
  "pages/main/brand_video.mp4",
  "pages/main/brand_visual_img.v4.jpg",
  "pages/main/contact_bg.v4.jpg",
  "pages/main/contact_map_01.v4.png",
  "pages/main/contact_map_02.v4.png",
  "pages/main/hero_bg.v4.jpg",
  "pages/main/hero_bg_m.v4.jpg",
  "pages/main/hero_brand_img.v4.png",
  "pages/main/hero_circle_01.svg",
  "pages/main/hero_circle_register.svg",
  "pages/main/hero_circle_text.svg",
  "pages/main/hero_video_3.mp4",
  "pages/main/hero_video_m_2.mp4",
  "pages/main/history_arrow.svg",
  "pages/main/history_climax.v4.png",
  "pages/main/history_event_bg_01.jpg",
  "pages/main/history_event_bg_02.jpg",
  "pages/main/history_img_01.v4.jpg",
  "pages/main/history_img_02.v4.jpg",
  "pages/main/history_img_03.v4.jpg",
  "pages/main/history_img_2026.v4.jpg",
  "pages/main/history_img_2028.v4.jpg",
  "pages/main/history_img_2029.v4.jpg",
  "pages/main/history_img_2030.v4.jpg",
  "pages/main/history_img_2031.v4.jpg",
  "pages/main/history_img_ark_one.v4.jpg",
  "pages/main/history_logo.svg",
  "pages/main/histroy_bg_img_01.svg",
  "pages/main/histroy_bg_img_02.svg",
  "pages/main/ico_star.svg",
  "pages/main/ico_yt.svg",
  "pages/main/intro_mask_left.svg",
  "pages/main/intro_mask_right.svg",
  "pages/main/intro_video_2.mp4",
  "pages/main/location_bubble.v4.png",
  "pages/main/location_bubble_m.v4.png",
  "pages/main/location_img.v4.png",
  "pages/main/location_map.v4.png",
  "pages/main/overview_bg.v4.jpg",
  "pages/main/overview_ico_star.svg",
  "pages/main/premium_bg.v4.jpg",
  "pages/main/premium_conf_03.v4.png",
  "pages/main/premium_img_01.v4.jpg",
  "pages/main/premium_img_02.v4.jpg",
  "pages/main/premium_img_03.v4.jpg",
  "pages/main/premium_img_left_01.v4.jpg",
  "pages/main/premium_img_left_02.v4.jpg",
  "pages/main/premium_img_left_03.v4.jpg",
  "pages/main/premium_poster.v4.jpg",
  "pages/main/premium_poster_02.v4.jpg",
  "pages/main/premium_poster_03.v4.jpg",
  "pages/main/premium_right_img_01.v4.jpg",
  "pages/main/premium_video_01.mp4",
  "pages/main/premium_video_02.mp4",
  "pages/main/premium_video_03.mp4",
  "pages/main/premium_visual_img_01.v4.jpg",
  "pages/main/premium_visual_img_02.v4.jpg",
  "pages/main/premium_visual_img_03.v4.jpg",
]);
const OFFICIAL_URL = /https?:\/\/(?:www\.)?arkone-prugio\.com\/resources\/img\/([^\s"'()<>\\]+)/g;

/** 글(HTML, CSS)에서 부르는 공식 서버 파일의 경로(/resources/img/ 뒤)를 중복 없이 돌려준다. */
function officialNames(text) {
  return [...new Set([...text.matchAll(OFFICIAL_URL)].map((m) => decodeURIComponent(m[1])))].sort();
}

/** 공식 메인이 쓰는 71개 목록 밖의 이름을 돌려준다(없으면 빈 배열). */
function officialNameProblems(names) {
  return names.filter((n) => !OFFICIAL_FILES.has(n));
}

/** 그려지지 않은 이미지(naturalWidth 0)의 주소를 돌려준다(없으면 빈 배열). */
function brokenImageProblems(images) {
  return images.filter((i) => i.naturalWidth === 0).map((i) => i.src);
}

/** 검색용 묶음(#site-info)의 등록 버튼: 글자색과 배경색이 구분돼야 한다(대비 3:1 이상). 문제면 사유, 아니면 null. */
function siteButtonProblem(btn) {
  if (!btn) return "#site-info 에 ak-btn--primary 버튼이 없다";
  const ratio = contrast(btn.fg, btn.bg);
  if (ratio < 3) return `#site-info 등록 버튼의 글자색이 배경색과 구분되지 않는다 (대비 ${ratio.toFixed(2)}:1, 글자 ${btn.fg.join(",")} / 배경 ${btn.bg.join(",")})`;
  return null;
}

/** 휴대폰 히어로의 홍보영상 버튼·SCROLL 표시가 모바일 하단 바(ak-mbar)에 가려지면 사유, 아니면 null. */
function heroBarProblem(m) {
  if (!m || !m.bar) return null;
  const out = [];
  if (m.video && m.video.bottom > m.bar.top + 0.5) out.push(`홍보영상 버튼(아래 ${Math.round(m.video.bottom)})이 하단 바(위 ${Math.round(m.bar.top)})에 가려진다`);
  if (m.scroll && m.scroll.bottom > m.bar.top + 0.5) out.push(`SCROLL 표시(아래 ${Math.round(m.scroll.bottom)})가 하단 바(위 ${Math.round(m.bar.top)})에 가려진다`);
  return out.length ? out.join(", ") : null;
}

/** 공식 문의 번호·외부 예약 주소가 남은 자리를 돌려준다(없으면 빈 배열). */
function officialResidue(html) {
  const hits = [];
  if (OFFICIAL_PHONE.test(html)) hits.push("공식 문의 번호");
  if (OFFICIAL_BOOKING.test(html)) hits.push("외부 예약 주소(here-customer)");
  return hits;
}

/** 히어로 영상 규칙: video 가 있고 muted·playsinline 이 붙어 있으며 정지컷 주소에 hero_bg 가 있어야 한다. */
function heroProblems(hero) {
  const out = [];
  if (!hero) return ["히어로(#hero)가 없다"];
  if (!hero.video) out.push("히어로에 video 가 없다");
  else {
    if (!hero.muted) out.push("히어로 video 에 muted 가 없다");
    if (!hero.playsinline) out.push("히어로 video 에 playsinline 이 없다");
  }
  if (!hero.bg) out.push("히어로 정지컷 주소에 hero_bg 가 없다");
  return out;
}

/** 소스 파일에서 낱말이 남은 자리를 「경로:줄」로 돌려준다. 화면에 그려지지 않는 문자열까지 본다. */
function sourceResidue(root, word) {
  const hits = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx?|jsx?|mjs|json|html|css|md|txt)$/.test(entry.name)) {
        fs.readFileSync(full, "utf8")
          .split("\n")
          .forEach((line, i) => {
            if (line.includes(word)) hits.push(`${path.relative(root, full)}:${i + 1}`);
          });
      }
    }
  };
  for (const dir of ["src", "public"]) {
    const full = path.join(root, dir);
    if (fs.existsSync(full)) walk(full);
  }
  return hits;
}

/**
 * 7호선을 언급한 문장: 「개통 시기 미정」이 있어야 하고, 개통·준공 시점으로 읽히는 연도를 쓰면 안 된다.
 * 발표일·기준일·고시 번호처럼 개통과 붙어 있지 않은 연도는 허용한다.
 */
const YEAR = String.raw`(?:20[2-9]\d|'\d\d)`;
const OPENING = "(?:개통|준공|완공|운행 시작)";
const YEAR_THEN_OPENING = new RegExp(`${YEAR}\\s*년?(?:\\s*\\d{1,2}\\s*월)?[^.]{0,12}${OPENING}`);
const OPENING_THEN_YEAR = new RegExp(`${OPENING}[^.]{0,6}${YEAR}`);
function line7Ok(sentence) {
  if (!sentence.includes("개통 시기 미정")) return false;
  const rest = sentence.replaceAll("개통 시기 미정", "");
  return !YEAR_THEN_OPENING.test(rest) && !OPENING_THEN_YEAR.test(rest);
}
const sentencesWith = (text, word) =>
  text
    .split(/(?<=[.다])\s+|\n+/)
    .map((s) => s.trim())
    .filter((s) => s.includes(word));

const CAPS_ALLOW = new Set(["CHEONG NA ARK-ONE PRUGIO", "PRUGIO", "GRAND OPEN", "GTX-D", "GTX-E"]);
const isCapsLabel = (t) => /^[A-Z][A-Z0-9 &-]{4,}$/.test(t) && !CAPS_ALLOW.has(t);

// ── 대비율 ───────────────────────────────────────────────────────────────────
const lum = ([r, g, b]) => {
  const f = (v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const contrast = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const hex = (h) => [0, 2, 4].map((i) => parseInt(h.replace("#", "").slice(i, i + 2), 16));

// ── HTML 머리 읽기 (검색엔진이 받는 서버 응답 그대로) ─────────────────────────
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const attrs = (tag) =>
  Object.fromEntries(
    [...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((m) => [m[1].toLowerCase(), decode(m[2])]),
  );
const stripTags = (s) =>
  decode(s.replace(/<!--.*?-->/gs, "").replace(/<[^>]+>/g, ""))
    .replace(/\s+/g, " ")
    .trim();
const stable = (v) =>
  Array.isArray(v)
    ? v.map(stable)
    : v && typeof v === "object"
      ? Object.fromEntries(
          Object.keys(v)
            .sort()
            .map((k) => [k, stable(v[k])]),
        )
      : v;

function readHead(html) {
  const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map((m) => attrs(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map((m) => attrs(m[0]));
  const meta = (key, value) => metas.find((m) => m[key] === value)?.content ?? null;
  const jsonld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(
    (m) => {
      try {
        return JSON.stringify(stable(JSON.parse(m[1])));
      } catch {
        return `파싱 실패: ${m[1].slice(0, 80)}`;
      }
    },
  );
  const qa = html.match(
    /id="quick-answer-title"[^>]*>(.*?)<\/h2>\s*<p[^>]*>(.*?)<\/p>\s*<p[^>]*>(.*?)<\/p>/s,
  );
  return {
    title: decode((html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? ""),
    description: meta("name", "description"),
    robots: meta("name", "robots"),
    canonical: links.find((l) => l.rel === "canonical")?.href ?? null,
    ogUrl: meta("property", "og:url"),
    jsonld: jsonld.sort(),
    tel: [...new Set([...html.matchAll(/href="(tel:[^"]+)"/g)].map((m) => m[1]))].sort(),
    answer: qa ? stripTags(qa[2]) : null,
    answerSource: qa ? stripTags(qa[3]) : null,
    stylesheets: links.filter((l) => l.rel === "stylesheet").map((l) => l.href),
    loginLink: /<a\b[^>]*href="\/login"[^>]*>/.test(html),
    formPost: /<form\b[^>]*\bmethod="post"/i.test(html),
    body: html,
  };
}

/** 로컬 서버가 잠깐 연결을 끊어도 세 번까지 다시 받는다. 끝내 못 받으면 서버가 떠 있는지부터 확인하라고 알린다. */
async function get(base, route) {
  let last;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(base + route, { redirect: "manual" });
      return { status: res.status, body: await res.text() };
    } catch (error) {
      last = error;
      await new Promise((resolve) => setTimeout(resolve, 500 * attempt));
    }
  }
  throw new Error(
    `${base + route} 를 받지 못했다. 미리보기 서버(npm run preview)가 떠 있는지 확인한다. (${last?.cause?.code ?? last?.message})`,
  );
}

async function routesFor(base) {
  const sitemap = (await get(base, "/sitemap.xml")).body;
  const extra = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/",
  );
  return [...new Set([...ROUTES, ...extra])];
}

async function capture(base) {
  const routes = await routesFor(base);
  const pages = {};
  for (const route of routes) {
    const { status, body } = await get(base, route);
    pages[route] = { status, ...readHead(body) };
  }
  return {
    capturedAt: new Date().toISOString(),
    robotsTxt: (await get(base, "/robots.txt")).body,
    sitemapXml: (await get(base, "/sitemap.xml")).body,
    pages,
  };
}

// ── 브라우저 ─────────────────────────────────────────────────────────────────
// 프록시를 거쳐야 밖으로 나갈 수 있는 작업 환경에서는 그 프록시로 웹폰트와 이미지를 받는다. 로컬 주소는 직접 연다.
const PROXY = process.env.HTTPS_PROXY || process.env.https_proxy || "";
const contextOptions = (options) => ({ ...options, ignoreHTTPSErrors: Boolean(PROXY) });

async function launch() {
  const { chromium } = await import("playwright");
  const options = PROXY ? { proxy: { server: PROXY, bypass: "127.0.0.1,localhost" } } : {};
  try {
    return await chromium.launch(options);
  } catch (first) {
    const candidates = [process.env.DESIGN_CHECK_CHROMIUM, "/opt/pw-browsers/chromium"].filter(
      Boolean,
    );
    for (const executablePath of candidates) {
      if (fs.existsSync(executablePath)) return chromium.launch({ ...options, executablePath });
    }
    throw new Error(
      `브라우저를 띄우지 못했다. "npx playwright install chromium"을 실행하거나 DESIGN_CHECK_CHROMIUM에 크롬 실행 파일 경로를 넣는다.\n${first.message}`,
    );
  }
}

/** 화면에서 실제로 읽은 값. 문자열로 넘겨 브라우저 안에서 실행한다. */
function inspect(noticeText) {
  const de = document.documentElement;
  const visible = (el) => {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0)
      return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  // 가로 넘침: 화면 밖으로 나간 요소. 가로 스크롤 상자 안에서 잘리는 것은 따로 센다.
  const clippedByParent = (el) => {
    for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      if (["auto", "scroll", "hidden", "clip"].includes(getComputedStyle(p).overflowX)) return true;
    }
    return false;
  };
  const overflow = [...document.querySelectorAll("body *")]
    .filter((el) => {
      if (!visible(el) || clippedByParent(el)) return false;
      const r = el.getBoundingClientRect();
      return r.right > de.clientWidth + 0.5 || r.left < -0.5;
    })
    .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 40)}`)
    .slice(0, 5);
  const sideScroll = [...document.querySelectorAll("body *")].filter(
    (el) =>
      visible(el) &&
      ["auto", "scroll"].includes(getComputedStyle(el).overflowX) &&
      el.scrollWidth > el.clientWidth + 1,
  ).length;

  // 색을 sRGB 숫자로 (oklab, color-mix 등 어떤 표기든)
  const cv = document.createElement("canvas");
  cv.width = cv.height = 1;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  const rgba = (color) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2], d[3] / 255];
  };
  const over = (top, bottom) => {
    const a = top[3] + bottom[3] * (1 - top[3]);
    if (a === 0) return [0, 0, 0, 0];
    return [0, 1, 2]
      .map((i) => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / a)
      .concat(a);
  };

  // 글자 조각마다: 글자색, 그 자리 뒤에 실제로 깔린 배경
  const texts = [];
  const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const seen = new Set();
  while (tw.nextNode()) {
    const node = tw.currentNode;
    const text = node.textContent.replace(/\s+/g, " ").trim();
    const el = node.parentElement;
    if (!text || !el || seen.has(el)) continue;
    if (["SCRIPT", "STYLE", "NOSCRIPT", "OPTION"].includes(el.tagName)) continue;
    if (!visible(el)) continue;
    seen.add(el);
    const cs = getComputedStyle(el);
    const range = document.createRange();
    range.selectNodeContents(node);
    const rect = range.getBoundingClientRect();
    if (!rect.width || !rect.height) continue;
    const isSvg = el instanceof SVGElement;
    let fg = rgba(isSvg ? cs.fill : cs.color);
    let opacity = 1;
    for (let p = el; p; p = p.parentElement) opacity *= Number(getComputedStyle(p).opacity);
    fg = [fg[0], fg[1], fg[2], fg[3] * opacity];

    const x = Math.min(Math.max(rect.left + rect.width / 2, 1), de.clientWidth - 1);
    const y = rect.top + rect.height / 2;
    const stack = document.elementsFromPoint(x, y);
    const at = stack.findIndex((layer) => layer === el || el.contains(layer));
    const paints = (layer) => {
      const ls = getComputedStyle(layer);
      return (
        ["IMG", "VIDEO", "CANVAS", "IFRAME"].includes(layer.tagName) ||
        ls.backgroundImage !== "none" ||
        rgba(ls.backgroundColor)[3] > 0
      );
    };
    // 그 자리에서 글자가 잡히지 않거나(화면 밖), 다른 요소가 글자를 덮고 있으면 판정하지 않는다
    let unknown =
      at === -1 || stack.slice(0, at).some((layer) => !el.contains(layer) && paints(layer));
    let bg = [0, 0, 0, 0];
    for (const layer of unknown ? [] : stack.slice(at + 1)) {
      if (el.contains(layer)) continue;
      const ls = getComputedStyle(layer);
      if (
        ["IMG", "VIDEO", "CANVAS", "IFRAME"].includes(layer.tagName) ||
        ls.backgroundImage !== "none"
      ) {
        unknown = true;
        break;
      }
      // 글자 뒤에 깔린 요소의 배경색을 위에서부터 쌓는다
      const c = rgba(ls.backgroundColor);
      if (c[3] > 0) bg = over(bg, c);
      if (bg[3] >= 0.999) break;
    }
    const own = rgba(cs.backgroundColor);
    if (own[3] > 0) bg = over(own, bg);
    if (bg[3] < 0.999) bg = over(bg, [255, 255, 255, 1]);
    const shown = over(fg, bg);
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    texts.push({
      text: text.slice(0, 60),
      fg: shown.slice(0, 3).map(Math.round),
      bg: bg.slice(0, 3).map(Math.round),
      size,
      large: size >= 24 || (size >= 18.66 && weight >= 700),
      unknown,
      inDialog: Boolean(el.closest('[role="dialog"]')),
      inOfficial: Boolean(el.closest("[data-official-main]")),
    });
  }

  // 7호선을 언급한 묶음(표의 행, 띠의 칸, 문단, 목록 항목)
  const line7 = [];
  const boxes = new Set();
  const tw2 = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (tw2.nextNode()) {
    if (!tw2.currentNode.textContent.includes("7호선")) continue;
    const parent = tw2.currentNode.parentElement;
    const box = parent?.closest("tr, .ak-strip__cell") ?? parent?.closest("p, li, dd, h1, h2, h3");
    if (!box || boxes.has(box) || !visible(box)) continue;
    boxes.add(box);
    line7.push(box.innerText.replace(/\s+/g, " ").trim());
  }

  const siteBtn = document.querySelector("#site-info .ak-btn--primary");
  const util = document.querySelector(".ak-util");
  const bar = document.querySelector(".ak-mbar");
  const barStyle = bar ? getComputedStyle(bar) : null;
  return {
    scrollWidth: de.scrollWidth,
    clientWidth: de.clientWidth,
    overflow,
    sideScroll,
    dialog: Boolean(document.querySelector('[role="dialog"]')),
    h1: [...document.querySelectorAll("h1")].filter(visible).length,
    notice: Boolean(util && visible(util) && util.textContent.includes(noticeText)),
    bar: bar
      ? {
          shown: barStyle.display !== "none" && visible(bar),
          position: barStyle.position,
          tel: bar.querySelectorAll('a[href^="tel:"]').length,
          register: bar.querySelectorAll('a[href="/register"]').length,
        }
      : null,
    bodyText: document.body.innerText,
    siteBtn: siteBtn
      ? {
          fg: rgba(getComputedStyle(siteBtn).color).slice(0, 3).map(Math.round),
          bg: rgba(getComputedStyle(siteBtn).backgroundColor).slice(0, 3).map(Math.round),
        }
      : null,
    texts,
    line7,
    fontSans: getComputedStyle(document.body).fontFamily,
    h1InOfficial: Boolean(document.querySelector("h1")?.closest("[data-official-main]")),
    hero: (() => {
      const hero = document.getElementById("hero");
      if (!hero) return null;
      const v = hero.querySelector("video");
      const bgSrc = [
        ...hero.querySelectorAll("img, source, video"),
      ].map((n) => n.getAttribute("src") || n.getAttribute("srcset") || n.getAttribute("poster") || "");
      return {
        video: Boolean(v),
        muted: Boolean(v && (v.muted || v.hasAttribute("muted"))),
        playsinline: Boolean(v && v.hasAttribute("playsinline")),
        bg: bgSrc.some((u) => u.includes("hero_bg")),
      };
    })(),
    fontH1: document.querySelector("h1")
      ? getComputedStyle(document.querySelector("h1")).fontFamily
      : "",
  };
}

async function verify(base, baselinePath, shotsDir, onlyRoutes, onlyWidths, officialAssets) {
  const fails = [];
  if (officialAssets && !fs.existsSync(officialAssets)) throw new Error(`--official-assets 폴더가 없다: ${officialAssets}`);
  const notes = [];
  const fail = (m) => fails.push(m);

  // 0. 검사기 자체 점검
  for (const m of selftest()) fail(`검사기 자체 점검 실패: ${m}`);

  // 1. 검색 설정·전화 링크·직답 문단이 기록과 같은가
  if (!fs.existsSync(baselinePath)) {
    fail(`기준 기록 ${baselinePath} 이 없다. main에서 capture를 먼저 실행한다.`);
  } else {
    const before = JSON.parse(fs.readFileSync(baselinePath, "utf8"));
    const after = await capture(base);
    if (before.robotsTxt !== after.robotsTxt) fail("robots.txt가 바뀌었다");
    if (before.sitemapXml !== after.sitemapXml) fail("sitemap.xml이 바뀌었다");
    const baseTel = [...new Set(Object.values(before.pages).flatMap((p) => p.tel))];
    if (baseTel.length !== 1)
      notes.push(`기준 기록의 전화 링크가 ${baseTel.length}종이다: ${baseTel.join(", ")}`);
    for (const [route, b] of Object.entries(before.pages)) {
      const a = after.pages[route];
      if (!a) {
        fail(`${route}: 페이지가 사라졌다`);
        continue;
      }
      if (a.status !== b.status) fail(`${route}: 응답 코드 ${b.status} → ${a.status}`);
      const indexed = (b.robots ?? "").startsWith("index");
      for (const key of ["robots", "canonical", "ogUrl"]) {
        if (a[key] !== b[key]) fail(`${route}: ${key}가 바뀌었다 (${b[key]} → ${a[key]})`);
      }
      if (JSON.stringify(a.jsonld) !== JSON.stringify(b.jsonld))
        fail(`${route}: JSON-LD가 바뀌었다`);
      for (const key of ["title", "description"]) {
        if (a[key] === b[key]) continue;
        if (indexed) fail(`${route}: 색인 페이지의 ${key}가 바뀌었다`);
        else notes.push(`${route}: 비색인 페이지의 ${key} 변경 (${b[key]} → ${a[key]})`);
      }
      if (b.answer !== a.answer) fail(`${route}: 「한눈에 보기」 문단이 바뀌었거나 사라졌다`);
      if (b.answerSource !== a.answerSource) fail(`${route}: 「한눈에 보기」 출처 줄이 바뀌었다`);
      const extraTel = a.tel.filter((t) => !baseTel.includes(t));
      if (extraTel.length) fail(`${route}: 기록에 없던 전화 링크 ${extraTel.join(", ")}`);
      if (!a.tel.length) fail(`${route}: 전화 링크가 없다`);
      if (a.status === 200 && !a.loginLink) fail(`${route}: 푸터에 관리자 로그인 링크(href="/login")가 없다`);
    }
    const home = after.pages["/"];
    if (!home.stylesheets.some((h) => h.includes("family=Hahmlet")))
      fail("서체 링크: Hahmlet 스타일시트가 없다");
    if (!home.stylesheets.some((h) => h.includes("pretendard")))
      fail("서체 링크: Pretendard 스타일시트가 없다");
    if (home.stylesheets.some((h) => /Nanum\+Myeongjo|Noto\+Sans\+KR/.test(h)))
      fail("서체 링크: 예전 서체 링크가 남아 있다");
  }

  // 1-2. 소스에 예전 등록 이름이 남아 있지 않은가 (화면에 안 나오는 알림 문구, 대체 글, 쓰지 않는 구성요소 포함)
  if (!fs.existsSync(path.join(process.cwd(), "src"))) {
    fail("저장소 루트에서 실행한다 (src 폴더를 찾지 못해 소스 문구 검사를 못 했다)");
  } else {
    for (const hit of sourceResidue(process.cwd(), OLD_REGISTER_WORD))
      fail(`소스에 「${OLD_REGISTER_WORD}」 표기가 남아 있다: ${hit}`);
  }

  // 1-4. 홈에 공식 문의 번호·외부 예약 주소가 없는가, 모든 화면 푸터에 관리자 로그인 링크가 있는가, 로그인 폼이 post 인가
  // 1-5. 홈이 부르는 공식 서버 파일 이름이 모두 공식 메인의 71개 안에 있는가 (HTML과 스타일시트를 함께 본다)
  const officialSeenNames = new Set();
  if (fs.existsSync(baselinePath)) {
    const home = await get(base, "/");
    for (const hit of officialResidue(home.body)) fail(`/: 홈에 ${hit}가 남아 있다`);
    let text = home.body;
    for (const href of readHead(home.body).stylesheets) {
      if (!href.startsWith("/")) continue;
      text += `\n${(await get(base, href)).body}`;
    }
    for (const n of officialNames(text)) officialSeenNames.add(n);
  }

  // 1-3. 관리자 화면이 그대로 열리는가 (로그인 화면과 접수 관리 화면)
  const login = await get(base, "/login");
  if (login.status !== 200 || !login.body.includes('type="password"'))
    fail(`/login: 관리자 로그인 화면이 열리지 않는다 (응답 ${login.status})`);
  const admin = await get(base, "/admin?receipt=");
  if (admin.status !== 200 || !admin.body.includes("접수 관리"))
    fail(`/admin: 접수 관리 화면이 열리지 않는다 (응답 ${admin.status})`);
  if (login.status === 200 && !readHead(login.body).formPost) fail("/login: 로그인 폼에 method=\"post\" 가 없다");

  // 2. 화면 검사
  const allRoutes = await routesFor(base);
  const routes = onlyRoutes.length ? allRoutes.filter((r) => onlyRoutes.includes(r)) : allRoutes;
  const widths = onlyWidths.length ? WIDTHS.filter((w) => onlyWidths.includes(w)) : WIDTHS;
  const partial = routes.length !== allRoutes.length || widths.length !== WIDTHS.length;
  if (!routes.length || !widths.length) fail("--only 또는 --widths 에 맞는 검사 대상이 없다");
  const browser = await launch();
  let checked = 0;
  let textCount = 0;
  let officialSeen = false;
  const line7Seen = new Set();
  for (const width of widths) {
    const context = await browser.newContext(
      contextOptions({ viewport: { width, height: 900 }, reducedMotion: "reduce" }),
    );
    // 홈은 두 번 본다: 첫 방문(이벤트 팝업이 열린 상태)과 팝업을 닫은 상태
    const visits = routes.flatMap((route) =>
      route === "/"
        ? [
            [route, "팝업 열림"],
            [route, ""],
          ]
        : [[route, ""]],
    );
    for (const [route, state] of visits) {
      const page = await context.newPage();
      const where = `${route} @${width}${state ? ` (${state})` : ""}`;
      try {
        if (route === "/" && !state) {
          await page.addInitScript(() => {
            try {
              sessionStorage.setItem("arkone-staff-apt-event-seen", "1");
            } catch {
              /* 저장을 못 해도 계속한다 */
            }
          });
        }
        const errors = [];
        if (route === "/") {
          // 공식 서버 파일: 요청한 이름을 모으고, --official-assets 폴더가 있으면 그 파일로 바꿔 넣는다
          await page.route(/^https?:\/\/(www\.)?arkone-prugio\.com\/resources\/img\//, (r) => {
            const rel = decodeURIComponent(new URL(r.request().url()).pathname.replace(/^\/resources\/img\//, ""));
            officialSeenNames.add(rel);
            if (!officialAssets) return r.continue().catch(() => r.abort());
            const file = path.join(officialAssets, rel);
            if (!fs.existsSync(file)) return r.fulfill({ status: 404, body: "" });
            const ext = path.extname(file).slice(1).toLowerCase();
            const type = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", svg: "image/svg+xml", mp4: "video/mp4" }[ext];
            return r.fulfill({ path: file, contentType: type ?? "application/octet-stream" });
          });
        }
        page.on("pageerror", (error) => errors.push(error.message.split("\n")[0]));
        page.on("console", (msg) => {
          if (msg.type() === "error" && /hydrat/i.test(msg.text()))
            errors.push(msg.text().split("\n")[0]);
        });
        await page.goto(base + route, { waitUntil: "domcontentloaded" });
        await page.waitForLoadState("load").catch(() => {});
        if (state) {
          // 이벤트 팝업은 화면이 살아난 뒤에 열린다
          const opened = await page
            .waitForSelector('[role="dialog"]', { timeout: 8000 })
            .catch(() => null);
          if (!opened) fail(`${where}: 이벤트 팝업이 열리지 않는다`);
        } else {
          await page.waitForTimeout(700);
        }
        for (const message of errors) fail(`${where}: 화면 오류 ${message.slice(0, 120)}`);
        if (route === "/" && !state) {
          // 지연 로딩 이미지는 화면에 가까워져야 받기 시작한다. 한 번 끝까지 내려갔다가 맨 위로 돌아온다.
          await page.evaluate(async () => {
            const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
            const wait = (ms) => new Promise((done) => setTimeout(done, ms));
            for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
              window.scrollTo(0, y);
              await wait(40);
            }
            window.scrollTo(0, 0);
            await wait(200);
          });
        }
        if (route === "/" && !state && width <= 390) {
          // 휴대폰 첫 화면(스크롤 0)에서 히어로의 홍보영상 버튼·SCROLL 이 하단 바 위에 온전히 보이는가
          const phoneHeight = width <= 360 ? 740 : 844;
          await page.setViewportSize({ width, height: phoneHeight });
          await page.evaluate(() => window.scrollTo(0, 0));
          await page.waitForTimeout(250);
          const m = await page.evaluate(() => {
            const box = (sel) => {
              const el = document.querySelector(sel);
              if (!el) return null;
              const r = el.getBoundingClientRect();
              return r.width && r.height ? { top: r.top, bottom: r.bottom } : null;
            };
            return { video: box(".om-hero__video_trigger"), scroll: box(".om-hero__scroll"), bar: box(".ak-mbar") };
          });
          const problem = heroBarProblem(m);
          if (problem) fail(`${where} (${width}×${phoneHeight}): ${problem}`);
          await page.setViewportSize({ width, height: 900 });
        }
        // 전체 높이를 한 화면으로 펼쳐야 글자 뒤 배경을 정확히 읽는다
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewportSize({ width, height: Math.min(Math.max(height, 900), 16000) });
        await page.waitForTimeout(150);
        if (route === "/") {
          // 깨진 이미지: 홈의 복제 구간 이미지가 모두 받아져 그려졌는가(naturalWidth 0 이 0개)
          // 그려지는 이미지(display:none 이 아닌 것)가 모두 받아질 때까지 기다린다. 10초가 넘으면 그 상태로 본다.
          await page
            .evaluate(() =>
              Promise.race([
                Promise.all(
                  [...document.querySelectorAll("[data-official-main] img")]
                    .filter((i) => i.getClientRects().length > 0 && !i.complete)
                    .map(
                      (i) =>
                        new Promise((done) => {
                          i.addEventListener("load", done, { once: true });
                          i.addEventListener("error", done, { once: true });
                        }),
                    ),
                ),
                new Promise((done) => setTimeout(done, 10000)),
              ]),
            )
            .catch(() => {});
          // 받기가 끝난(complete) 이미지만 본다. 팝업이 열려 화면이 잠긴 상태에서는 아래쪽 지연 로딩 이미지가 아직 시작되지 않는다.
          const images = await page.evaluate(() =>
            [...document.querySelectorAll("[data-official-main] img")]
              .filter((i) => i.getClientRects().length > 0 && i.complete)
              .map((i) => ({
                src: (i.currentSrc || i.getAttribute("src") || "").split("/").slice(-2).join("/"),
                naturalWidth: i.naturalWidth,
              })),
          );
          for (const src of brokenImageProblems(images)) fail(`${where}: 깨진 이미지 ${src}`);
          if (!state && !images.length) fail(`${where}: 홈의 복제 구간에서 받기가 끝난 이미지를 하나도 찾지 못했다`);
        }
        const r = await page.evaluate(inspect, NOTICE);
        checked++;

        if (r.scrollWidth > r.clientWidth)
          fail(`${where}: 가로 넘침 ${r.scrollWidth} > ${r.clientWidth}`);
        if (r.overflow.length) fail(`${where}: 화면 밖으로 나간 요소 ${r.overflow.join(", ")}`);
        if (r.sideScroll && width <= 390)
          fail(`${where}: 옆으로 밀어야 보이는 상자가 ${r.sideScroll}개 있다`);
        if (!state && r.dialog) fail(`${where}: 닫아 둔 팝업이 다시 열렸다`);
        if (r.h1 !== 1) fail(`${where}: h1이 ${r.h1}개다 (1개여야 한다)`);
        if (!r.notice) fail(`${where}: 운영 주체 표시 줄이 없거나 문구가 다르다`);

        const wantBar = width <= 640 && !NO_MOBILE_BAR.includes(route);
        if (wantBar && !(r.bar && r.bar.shown && r.bar.tel === 1 && r.bar.register === 1)) {
          fail(`${where}: 모바일 하단 바(전화 1 + 등록 1)가 없다`);
        }
        if (!wantBar && r.bar && r.bar.shown) fail(`${where}: 하단 바가 보이면 안 되는 화면이다`);

        for (const w of findBanned(r.bodyText)) fail(`${where}: 금지 표현 「${w}」`);
        if (r.bodyText.includes(OLD_REGISTER_WORD))
          fail(`${where}: 「${OLD_REGISTER_WORD}」 표기가 남아 있다 (「사전고객」으로 통일한다)`);
        for (const block of r.line7) {
          for (const s of sentencesWith(block, "7호선")) {
            line7Seen.add(s);
            if (!line7Ok(s)) fail(`${where}: 7호선 표기 위반 「${s.slice(0, 70)}」`);
          }
        }
        if (route === "/") {
          const btnProblem = siteButtonProblem(r.siteBtn);
          if (btnProblem) fail(`${where}: ${btnProblem}`);
          for (const t of r.texts) {
            if (!t.inDialog && !t.inOfficial && isCapsLabel(t.text))
              fail(`${where}: 영문 대문자 라벨 「${t.text}」`);
          }
          if (!r.h1InOfficial && !/Hahmlet/.test(r.fontH1))
            fail(`${where}: h1 서체가 Hahmlet이 아니다 (${r.fontH1})`);
          if (r.hero !== null) {
            officialSeen = true;
            for (const m of heroProblems(r.hero)) fail(`${where}: ${m}`);
          }
          if (!/Pretendard/.test(r.fontSans))
            fail(`${where}: 본문 서체가 Pretendard가 아니다 (${r.fontSans})`);
        }
        const low = new Map();
        for (const t of r.texts) {
          textCount++;
          if (t.unknown) continue;
          const ratio = contrast(t.fg, t.bg);
          const need = t.large ? 3 : 4.5;
          if (ratio < need)
            low.set(
              `${t.text}|${ratio.toFixed(2)}`,
              `${where}: 대비 ${ratio.toFixed(2)}:1 (기준 ${need}) 「${t.text}」`,
            );
        }
        for (const m of low.values()) fail(m);
      } catch (error) {
        fail(`${where}: 검사 중 오류 ${error.message.split("\n")[0]}`);
      } finally {
        await page.close();
      }
    }
    await context.close();
  }
  if (!line7Seen.size) notes.push("7호선을 언급한 문장을 하나도 찾지 못했다");
  const names = [...officialSeenNames].sort();
  for (const n of officialNameProblems(names)) fail(`/: 공식 메인의 71개 목록에 없는 공식 서버 파일을 부른다: ${n}`);
  notes.push(
    `홈이 부르는 공식 서버 파일 ${names.length}개(목록 71개 안), 목록 밖 ${officialNameProblems(names).length}개` +
      (officialAssets ? ` (공식 요청은 ${officialAssets} 의 파일로 바꿔 넣고 깨진 이미지를 검사했다)` : " (공식 요청은 실제 서버로 보냈다)"),
  );
  if (officialSeen)
    notes.push(`홈의 복제 구간(${OFFICIAL_MARK}) 안에서 제외한 표기 규칙: ${OFFICIAL_EXEMPT.join(", ")}. 금지 표현·「관심고객」·7호선·전화 링크·검색 설정·가로 넘침·h1 1개는 제외하지 않았다`);

  // 3. 화면 저장: 페이지 전체(하단 바는 맨 아래), 그리고 모바일 첫 화면(하단 바가 붙어 있는 모습)
  const shots = [];
  if (shotsDir) {
    fs.mkdirSync(shotsDir, { recursive: true });
    for (const [width, scale, tag] of [
      [1280, 1, "pc"],
      [390, 2, "mobile"],
    ]) {
      const context = await browser.newContext(
        contextOptions({
          viewport: { width, height: 844 },
          deviceScaleFactor: scale,
          reducedMotion: "reduce",
        }),
      );
      await context.addInitScript(() => {
        try {
          sessionStorage.setItem("arkone-staff-apt-event-seen", "1");
        } catch {
          /* 저장을 못 해도 계속한다 */
        }
      });
      for (const route of SHOT_ROUTES.filter((r) => routes.includes(r))) {
        const page = await context.newPage();
        const name = route === "/" ? "home" : route.slice(1).replace(/\//g, "-");
        await page.goto(base + route, { waitUntil: "load" });
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(600);
        if (route === "/" && tag === "mobile") {
          const first = path.join(shotsDir, `${name}-${tag}-first.png`);
          await page.screenshot({ path: first });
          shots.push(first);
        }
        const height = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewportSize({ width, height: Math.min(Math.max(height, 844), 16000) });
        await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
        await page.waitForTimeout(300);
        const file = path.join(shotsDir, `${name}-${tag}.png`);
        await page.screenshot({ path: file });
        shots.push(file);
        await page.close();
      }
      await context.close();
    }
  }
  await browser.close();

  for (const n of notes) console.log(`참고: ${n}`);
  for (const f of fails) console.error(`실패: ${f}`);
  console.log(
    `검사 ${checked}화면(경로 ${routes.length} × 폭 ${widths.length}), 글자 조각 ${textCount}개, 7호선 문장 ${line7Seen.size}개, 저장한 화면 ${shots.length}장`,
  );
  if (fails.length) {
    console.error(`design-check FAILED (${fails.length}건)`);
    process.exit(1);
  }
  if (partial) {
    console.log("design-check partial ok (부분 검사입니다. 전체 검사를 다시 돌려야 합니다)");
    return;
  }
  console.log("design-check passed");
}

/** 검사기가 위반을 실제로 잡는지 확인한다. 못 잡으면 그 사유를 돌려준다. */
function selftest() {
  const bad = [];
  if (findBanned("지금 아니면 끝, 수익 보장 대박 단지").length < 3)
    bad.push("금지 표현을 잡지 못한다");
  if (findBanned("일정은 사업주체 사정에 따라 변경될 수 있습니다.").length)
    bad.push("정상 문장을 금지 표현으로 본다");
  const probe = fs.mkdtempSync(path.join(os.tmpdir(), "design-check-"));
  fs.mkdirSync(path.join(probe, "src"));
  fs.writeFileSync(path.join(probe, "src", "alert.ts"), 'export const t = "새 관심고객 접수";\n');
  fs.writeFileSync(path.join(probe, "src", "ok.ts"), 'export const t = "사전고객등록";\n');
  if (sourceResidue(probe, OLD_REGISTER_WORD).join() !== path.join("src", "alert.ts") + ":1")
    bad.push("소스에 남은 예전 등록 이름을 잡지 못한다");
  if (officialResidue('<a href="tel:18333872">1833-3872</a>').length !== 1 || officialResidue("https://here-customer.example/x").length !== 1)
    bad.push("홈에 남은 공식 문의 번호·외부 예약 주소를 잡지 못한다");
  if (officialResidue('<a href="tel:16664250">1666-4250</a> /register').length)
    bad.push("사이트 대표번호를 공식 번호로 잘못 잡는다");
  if (
    heroProblems({ video: true, muted: true, playsinline: true, bg: true }).length ||
    heroProblems({ video: false, muted: false, playsinline: false, bg: true }).length !== 1 ||
    heroProblems({ video: true, muted: false, playsinline: true, bg: false }).length !== 2 ||
    heroProblems(null).length !== 1
  )
    bad.push("히어로 영상 규칙(video·muted·playsinline·hero_bg)을 제대로 잡지 못한다");
  if (
    readHead('<html><body><form method="post"></form><a href="/login">관리자 로그인</a></body></html>').loginLink !== true ||
    readHead('<html><body><form></form></body></html>').formPost !== false
  )
    bad.push("푸터 관리자 로그인 링크·로그인 폼 method 를 읽지 못한다");
  if (
    OFFICIAL_FILES.size !== 71 ||
    officialNames(
      '<img src="https://arkone-prugio.com/resources/img/pages/main/hero_bg.v4.jpg"> .x{background:url(https://www.arkone-prugio.com/resources/img/common/ico_naver.svg)}',
    ).join() !== "common/ico_naver.svg,pages/main/hero_bg.v4.jpg"
  )
    bad.push("홈이 부르는 공식 서버 파일 이름을 읽지 못한다");
  if (
    officialNameProblems(["pages/main/hero_bg.v4.jpg", "common/ico_naver.svg"]).length ||
    officialNameProblems(["pages/main/premium_visual_img_04.v4.jpg", "pages/main/brand_bg_m.v4.jpg"]).length !== 2
  )
    bad.push("공식 메인의 71개 목록 밖 파일 이름을 잡지 못한다");
  if (
    siteButtonProblem({ fg: [26, 25, 22], bg: [28, 58, 50] }) === null ||
    siteButtonProblem(null) === null ||
    siteButtonProblem({ fg: [246, 243, 238], bg: [28, 58, 50] }) !== null
  )
    bad.push("#site-info 등록 버튼의 글자색·배경색 구분 실패를 잡지 못한다");
  if (
    heroBarProblem({ video: { top: 766, bottom: 816 }, scroll: { top: 769, bottom: 828 }, bar: { top: 783, bottom: 844 } }) === null ||
    heroBarProblem({ video: { top: 700, bottom: 750 }, scroll: { top: 720, bottom: 775 }, bar: { top: 783, bottom: 844 } }) !== null ||
    heroBarProblem({ video: { top: 766, bottom: 816 }, scroll: null, bar: null }) !== null
  )
    bad.push("휴대폰 홍보영상 버튼·SCROLL 과 하단 바의 겹침을 잡지 못한다");
  if (
    brokenImageProblems([
      { src: "main/premium_visual_img_04.v4.jpg", naturalWidth: 0 },
      { src: "main/hero_bg.v4.jpg", naturalWidth: 1920 },
    ]).join() !== "main/premium_visual_img_04.v4.jpg"
  )
    bad.push("깨진 이미지(naturalWidth 0)를 잡지 못한다");
  fs.rmSync(probe, { recursive: true, force: true });
  if (line7Ok("서울 7호선 청라연장선 2030년 개통 예정")) bad.push("7호선 개통 연도를 잡지 못한다");
  if (line7Ok("7호선 국제업무단지역(예정)"))
    bad.push("7호선 「개통 시기 미정」 누락을 잡지 못한다");
  if (
    !line7Ok(
      "서울 지하철 7호선 청라 연장선(예정 · 개통 시기 미정): 대도시권광역교통위원회 고시 제2022-01호",
    )
  ) {
    bad.push("고시 번호를 개통 연도로 잘못 본다");
  }
  if (line7Ok("7호선은 개통 시기 미정이나 2029년 개통을 목표로 합니다."))
    bad.push("「개통 시기 미정」과 함께 쓴 개통 연도를 잡지 못한다");
  if (line7Ok("7호선 청라연장선 개통은 '29년으로, 개통 시기 미정"))
    bad.push("개통 뒤에 붙은 줄임 연도를 잡지 못한다");
  if (
    !line7Ok(
      "서울 7호선 청라연장선은 공사가 진행 중이며 개통 시기 미정입니다(인천광역시 2026년 8월 발표 기준).",
    )
  ) {
    bad.push("발표 기준일을 개통 연도로 잘못 본다");
  }
  if (contrast(hex("#c4a574"), hex("#f6f3ee")) >= 4.5)
    bad.push("모래색 글자(밝은 배경)의 대비 미달을 잡지 못한다");
  if (contrast(hex("#7a5a2c"), hex("#f6f3ee")) < 4.5) bad.push("브론즈 글자를 미달로 잘못 본다");
  if (
    !isCapsLabel("OVERVIEW") ||
    !isCapsLabel("BRAND") ||
    isCapsLabel("GRAND OPEN") ||
    isCapsLabel("B5 – 49F") ||
    isCapsLabel("GTX-D·")
  )
    bad.push("영문 대문자 라벨 판정이 틀리다");
  return bad;
}

// ── 실행 ─────────────────────────────────────────────────────────────────────
const [command, ...rest] = process.argv.slice(2);
const option = (name, fallback) => {
  const i = rest.indexOf(`--${name}`);
  return i >= 0 && rest[i + 1] ? rest[i + 1] : fallback;
};
const base = option("base", "http://127.0.0.1:8081").replace(/\/$/, "");

async function main() {
  if (command === "selftest") {
    const bad = selftest();
    for (const m of bad) console.error(`실패: ${m}`);
    if (bad.length) process.exit(1);
    console.log("selftest passed");
  } else if (command === "capture") {
    const out = option("out", "design-baseline.json");
    const data = await capture(base);
    fs.writeFileSync(out, JSON.stringify(data, null, 2));
    const indexed = Object.entries(data.pages).filter(([, p]) =>
      (p.robots ?? "").startsWith("index"),
    );
    console.log(
      `capture saved: ${out} (경로 ${Object.keys(data.pages).length}개, 색인 ${indexed.length}개: ${indexed.map(([r]) => r).join(" ")})`,
    );
  } else if (command === "verify") {
    const list = (name) => option(name, "").split(",").filter(Boolean);
    await verify(
      base,
      option("baseline", "design-baseline.json"),
      option("shots", ""),
      list("only"),
      list("widths").map(Number),
      option("official-assets", ""),
    );
  } else {
    console.error(
      "사용법: node scripts/design-check.mjs <selftest|capture|verify> [--base URL] [--out 파일] [--baseline 파일] [--shots 폴더] [--only 경로,경로] [--widths 폭,폭] [--official-assets 폴더]",
    );
    process.exit(2);
  }
}

main().catch((error) => {
  console.error(`실패: ${error.message}`);
  console.error("design-check FAILED (검사를 끝내지 못했다)");
  process.exit(1);
});
