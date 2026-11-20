/**
 * 새 홈(landing-redesign)이 쓰는 제목·설명·요약·FAQ.
 * 이 사이트(푸르지오.site)는 검색 문구를 src/data/seo.ts 의 "/" 항목 하나로 관리한다.
 * 여기서는 그 값을 그대로 다시 내보내기만 한다 — 문구를 고칠 때는 seo.ts 를 고친다.
 */
import { SEO_PAGES, SEO_FAQS } from "./seo";

const HOME = SEO_PAGES["/"];

export const LANDING_TITLE = HOME.title;
export const LANDING_DESCRIPTION = HOME.description;
export const LANDING_ANSWER = HOME.answer;
export const LANDING_FAQS = SEO_FAQS["/"] ?? [];
