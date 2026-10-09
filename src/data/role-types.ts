/**
 * 사이트별 첫 화면(역할 패널) 데이터의 모양 (저장소마다 같은 파일).
 * 사이트마다 다른 값은 src/data/role.ts 한 파일에만 둔다.
 */

/** 상태 칩. done 개통·완료 / work 공사 중 / soon 예정 / plan 계획 / tbd 시기 미정·공고 후 확정 */
export type ChipKind = "done" | "work" | "soon" | "plan" | "tbd";
export type Chip = { kind: ChipKind; text: string };

/** 출처 캡션의 한 항목. wide는 한 줄을 통째로 쓴다. */
export type SourceItem = { k: string; v: string; wide?: boolean };

/** 히어로 아래 역할 띠의 한 칸. no는 순서가 있는 일정일 때만 넣는다. */
export type StripCell = {
  no?: string;
  label: string;
  chip?: Chip;
  value: string;
  unit?: string;
  desc: string;
};

/** 아치 창 안의 도해. */
export type RoleFigure =
  | {
      kind: "calendar";
      year: number;
      month: number;
      marks: { day: number; style: "fill" | "ring"; label: string }[];
      alt: string;
    }
  | { kind: "month"; year: number; month: number; status: string; note: string; alt: string }
  | {
      kind: "plate";
      label: string;
      dong: string;
      no: string;
      sub: string[];
      list: { k: string; v: string }[];
      maps: { label: string; href: string }[];
      alt: string;
    }
  | { kind: "ruler"; top: number; basement: number; buildings: string; alt: string };

/** 홈 두 번째 구간(역할 본문). */
export type RoleMain =
  | { kind: "subscription"; title: [string, string]; lead: string }
  | {
      kind: "status";
      title: [string, string];
      lead: string;
      caption: string;
      rows: { name: string; chip: Chip; note: string }[];
      source: SourceItem[];
    }
  | {
      kind: "mix";
      title: [string, string];
      lead: string;
      parts: { n: string; unit: string; title: string; desc: string; weight: number }[];
      source: SourceItem[];
    };

/** 역할 본문 뒤에 오는 공통 구간. 순서는 사이트마다 다르다. */
export type HomeSectionKey =
  "overview" | "location" | "premium" | "subscription" | "contact" | "brandtown";

export type Role = {
  tone: "paper" | "mist" | "dark";
  h1: [string, string];
  heroLink: { to: string; label: string };
  figure: RoleFigure;
  strip: StripCell[];
  stripSource: SourceItem[];
  main: RoleMain;
  sections: HomeSectionKey[];
};
