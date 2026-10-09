import type { Role } from "./role-types";
import { SEO_SOURCE_LINE } from "./seo";

/**
 * 이 사이트의 첫 화면 데이터 (C · 푸르지오.site · 역할: 사업개요·규모·브랜드타운).
 * 세 저장소에서 이 파일만 내용이 다르다. 숫자는 사실 원장에 있는 값만 쓴다.
 * 동별 층수, 세부 타입명, 타입별 세대수는 입주자모집공고 전에는 그리지 않는다.
 */

/** 출처 줄의 기준일은 seo.ts 의 값을 그대로 쓴다. */
const BASE_DATE = SEO_SOURCE_LINE.match(/기준일\s*([\d.]+)/)?.[1] ?? "";

export const ROLE: Role = {
  tone: "dark",
  h1: ["청라 아크원 푸르지오", "사업개요와 규모"],
  heroLink: { to: "/overview", label: "사업개요 보기" },
  figure: {
    kind: "ruler",
    top: 49,
    basement: 5,
    buildings: "6개동",
    alt: "건축 규모 눈금. 지하 5층부터 지상 49층까지, 6개동",
  },
  strip: [
    { label: "건축 규모", value: "B5 – 49F", desc: "지하 5층부터 지상 49층, 총 6개동" },
    { label: "공급", value: "1,855", unit: "세대·실", desc: "아파트 868세대, 오피스텔 987실" },
    // 이름과 숫자, 숫자와 가운뎃점이 줄 끝에서 갈라지지 않게 줄바꿈 없는 공백(\u00a0)을 쓴다
    {
      label: "주차",
      value: "3,124",
      unit: "대",
      desc: "아파트\u00a01,389\u00a0· 오피스텔\u00a01,695\u00a0· 상업\u00a040",
    },
    {
      label: "브랜드타운 합산",
      value: "2,911",
      unit: "가구·실",
      desc: "청라 피크원 푸르지오 포함. 단일 단지가 아닙니다.",
    },
  ],
  stripSource: [
    { k: "출처", v: "사업주체 공개자료" },
    { k: "기준일", v: BASE_DATE },
    { k: "안내", v: "수치는 사업주체 사정에 따라 변경될 수 있습니다." },
  ],
  main: {
    kind: "mix",
    title: ["공급 구성과", "건축 개요"],
    lead: "동별 층수와 타입별 세대수는 입주자모집공고로 확인해야 합니다.",
    parts: [
      { n: "868", unit: "세대", title: "아파트", desc: "전용 84㎡ · 103㎡", weight: 868 },
      { n: "987", unit: "실", title: "오피스텔", desc: "전용 105㎡ · 121㎡ · 136㎡", weight: 987 },
    ],
    source: [
      { k: "출처", v: "사업주체 공개자료" },
      { k: "기준일", v: BASE_DATE },
      { k: "안내", v: "최종 값은 입주자모집공고를 따릅니다.", wide: true },
    ],
  },
  sections: ["brandtown", "premium", "location", "subscription"],
};
