import type { ReactNode } from "react";
import { NOTICE } from "@/lib/notice-facts.v1";
import { PROJECT_PHONE_DISPLAY } from "@/data/content";

// 작업지시서 10 (2026-10-22): 입주자모집공고(주택관리번호 2026000496) 확정 내용 — 아크원푸르지오.site와 같은 문구.
// 표 숫자·금액은 notice-facts.v1.ts 에서만 그린다(작업지시서 12: 공급금액표 공개).

function Block({ label, title, children }: { label: string; title: string; children: ReactNode }) {
  return (
    <section className="ak-wrap ak-page notice-block" aria-label={label}>
      <h2 className="ak-h2">{title}</h2>
      {children}
    </section>
  );
}

function Lines({ lines }: { lines: string[] }) {
  return (
    <div className="notice-lines">
      {lines.map((l) => (
        <p key={l}>{l}</p>
      ))}
    </div>
  );
}

function Table({ columns, rows }: { columns: readonly string[]; rows: readonly (readonly (string | number)[])[] }) {
  return (
    <div className="notice-tbl-wrap">
      <table className="ak-tbl">
        <thead>
          <tr>
            {columns.map((c) => (
              <th scope="col" key={c}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[0])}>
              <th scope="row">{r[0]}</th>
              {r.slice(1).map((v, i) => (
                <td key={i}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** M2 · 청약 일정 */
export function NoticeSchedule() {
  return (
    <Block label="청약 일정" title="청라 아크원 푸르지오(APT) 청약 일정 — 입주자모집공고 기준">
      <Lines
        lines={[
          "입주자모집공고 게시 2026.10.22(목)",
          "특별공급 11.02(월)",
          "일반공급 1순위 11.03(화)",
          "일반공급 2순위 11.04(수)",
          "당첨자 발표 11.10(화)",
          "당첨자 서류접수 11.12(목)~11.16(월)",
          "계약 11.22(일)~11.24(화)",
          "견본주택 GRAND OPEN 10.30(금) · 인천광역시 서해구 청라동 87-1",
          "청약은 한국부동산원 청약홈(www.applyhome.co.kr)에서 인터넷으로 신청합니다.",
          "※ 일정은 사업주체 사정에 따라 변경될 수 있으며, 입주자모집공고문이 우선합니다.",
        ]}
      />
    </Block>
  );
}

/** 원 단위 공고 금액 → 「8억 3,780만원」 */
const won = (v: number) => {
  const eok = Math.floor(v / 100000000);
  const man = Math.round((v % 100000000) / 10000);
  return man ? `${eok}억 ${man.toLocaleString("ko-KR")}만원` : `${eok}억원`;
};
const range = (min: number, max: number) => `${won(min)} ~ ${won(max)}`;

/** M3 · 주택형별 공급금액 (작업지시서 12 · 공고문 6~20면) */
export function NoticePrice() {
  const p84a = NOTICE.prices.find((p) => p.type === "84A");
  const lines = p84a && "lines" in p84a ? p84a.lines : [];
  return (
    <Block label="분양가 안내" title="주택형별 공급금액 (입주자모집공고문 6~20면)">
      <Table columns={["주택형", "세대수", "공급금액 (최저 ~ 최고)"]} rows={NOTICE.prices.map((p) => [p.type, p.units, range(p.min, p.max)])} />
      <Lines
        lines={[
          `84A는 ${lines.map((l) => `${l.line} 라인 ${range(l.min, l.max)}`).join(", ")}입니다.`,
          "※ 공급금액은 동·층·호별로 다르며, 입주자모집공고문 6~20면 공급금액표가 우선합니다.",
          "※ 공급금액에는 발코니 확장비·유상옵션·취득세 등이 포함되어 있지 않습니다. 전용 85㎡ 이하는 부가가치세 대상이 아니며, 103㎡ 공급금액에는 건축비 부가가치세가 포함되어 있습니다.",
          `※ 분양가상한제 적용 단지입니다. 원하시는 동·층·호의 금액은 대표번호 ${PROJECT_PHONE_DISPLAY}로 상담해 주세요.`,
        ]}
      />
      <h3 className="notice-h3">발코니 확장비 (VAT 포함 · 계약금 10% · 잔금 90%)</h3>
      <Table columns={["주택형", ...NOTICE.balcony.map((b) => b.type)]} rows={[["확장비", ...NOTICE.balcony.map((b) => `${b.price.toLocaleString("ko-KR")}원`)]]} />
    </Block>
  );
}

/** M4 · 납부 조건 (비율만) */
export function NoticePayment() {
  return (
    <Block label="납부 조건" title="납부 조건 (공급금액 기준 비율)">
      <Lines
        lines={[
          "계약금 5% — 1차 1천만원(계약 시) + 2차 나머지(계약일부터 30일 이내)",
          "중도금 60% — 6회 분할, 이자후불제 (사업주체가 지정하는 금융기관을 통한 중도금 대출 알선 예정. 정부 정책·금융기관 사정으로 대출이 어려우면 계약자가 직접 납부)",
          "잔금 35% — 입주지정일",
          "※ 잔금대출은 DSR 등 대출 규제에 따라 개인별 한도가 줄거나 대출이 어려울 수 있습니다.",
          "※ 계약금·중도금·잔금은 사업주체가 안내하는 지정계좌로만 납부합니다. 계좌는 입주자모집공고문과 사업주체 안내로 확인하시고, 이 사이트는 계좌번호를 안내하지 않습니다.",
        ]}
      />
    </Block>
  );
}

/** M5 · 청약 자격 */
export function NoticeEligibility() {
  return (
    <Block label="청약 자격 요약" title="청약 자격 요약 (입주자모집공고 기준)">
      <Lines
        lines={[
          "신청 지역: 입주자모집공고일(2026.10.22) 현재 인천광역시·서울특별시·경기도에 거주하는 만 19세 이상(세대주인 미성년자 포함)",
          "지역 우선: 같은 순위에서 경쟁이 있으면 인천광역시 거주자 50% 우선 공급, 나머지 50%는 서울특별시·경기도 거주자에게 공급",
          "1순위: 청약통장 가입 12개월 경과 + 지역별·면적별 예치금 이상 (세대주 요건 없음, 주택 소유 여부와 관계없이 1순위 신청 가능)",
          "2순위: 청약통장 가입자 중 1순위에 해당하지 않는 분",
          "일반공급 당첨자 선정: 전용 84㎡는 가점제 40% · 추첨제 60%, 전용 103㎡는 추첨제 100%",
          "추첨제는 무주택자를 우선합니다: 추첨제 물량의 75%를 무주택세대구성원에게 먼저 공급",
          "비규제지역 · 분양가상한제 적용 · 재당첨 제한 10년(이 단지 당첨 시) · 전매제한 3년(소유권이전등기일까지, 3년을 넘으면 3년) · 거주의무 없음",
          "기존 재당첨 제한 기간 중인 분과 그 세대원도 이 단지에 청약할 수 있습니다.",
          "청약은 1인 1건입니다. 특별공급과 일반공급은 각 1건씩 함께 신청할 수 있으나, 특별공급에 당첨되면 일반공급 당첨자 선정에서 제외됩니다.",
        ]}
      />
      <h3 className="notice-h3">청약 예치금 (입주자모집공고일 현재 주민등록표상 거주지역 기준)</h3>
      <Table columns={NOTICE.deposit.columns} rows={NOTICE.deposit.rows} />
      <p className="notice-note">※ 자세한 자격과 예외는 입주자모집공고문이 우선합니다.</p>
    </Block>
  );
}

/** M6 · 특별공급 */
export function NoticeSpecial() {
  const rows = NOTICE.specialSupply.rows.map((r) => r.map((v, i) => (i > 0 && v === 0 ? "-" : v)));
  return (
    <Block label="특별공급 주택형별 배정" title="특별공급 514세대 (주택형별 배정)">
      <Table columns={NOTICE.specialSupply.columns} rows={rows} />
      <Lines
        lines={[
          "청약통장: 기관추천·경제자유구역·다자녀가구·신혼부부·노부모부양은 가입 6개월 경과와 예치금, 생애최초·신생아는 1순위(가입 12개월) 요건입니다. 기관추천 중 장애인·국가유공자 등은 통장이 필요 없습니다.",
          "특별공급은 무주택세대구성원에게 1세대 1주택 기준으로 한 차례만 공급합니다(노부모부양은 무주택세대주).",
          "경제자유구역 특별공급은 인천 경제자유구역에 입주한 외국인투자기업 등에서 1년 이상 일한 상용근로자 등이 대상이며, 먼저 사업주체에 신청하고 인천경제자유구역청이 대상자를 정합니다.",
          "※ 소득·자산 기준 등 유형별 세부 자격은 입주자모집공고문 23~36면이 우선합니다.",
        ]}
      />
    </Block>
  );
}

const UNIT_NOTE = "AI로 제작한 인테리어 연출 이미지입니다. 실제 평면·마감재·가구·창밖 조망과 다릅니다.";

/** 타입 연출 이미지(작업지시서 10 · 3-8). 이미지 바로 아래 글자로 연출 고지. */
function UnitFigure({ file, alt }: { file: string; alt: string }) {
  return (
    <figure className="unit-figure">
      <img src={`/units/${file}`} alt={alt} width={1168} height={784} loading="lazy" decoding="async" />
      <figcaption>{UNIT_NOTE}</figcaption>
    </figure>
  );
}

/** M7 · 주택형 안내 (면적 단위 ㎡) + 타입 연출 이미지 5종 */
const PLAN_NOTE = "분양 안내 자료의 평면을 다시 그린 안내용 이미지입니다. 실제와 다를 수 있으며 입주자모집공고문과 견본주택이 우선합니다.";

/** 평면 안내도(작업지시서 12 · 3절). 누르면 원본 PNG 새 창(휴대폰 확대용). */
function PlanFigure({ file, alt }: { file: string; alt: string }) {
  return (
    <figure className="plan-figure">
      <a href={`/plans/${file}.png`} target="_blank" rel="noopener">
        <picture>
          <source type="image/webp" srcSet={`/plans/${file}.webp`} />
          <img src={`/plans/${file}.png`} alt={alt} width={2000} height={1250} loading="lazy" decoding="async" />
        </picture>
      </a>
      <figcaption>{PLAN_NOTE}</figcaption>
    </figure>
  );
}

export function NoticeTypes() {
  const s = NOTICE.supply;
  const rows = NOTICE.types.map((t) => [t.type, t.units, t.exclusive, t.residentialCommon, t.supply, t.otherCommon, t.contract]);
  return (
    <Block label="주택형 안내" title="주택형 안내 (입주자모집공고문 5면, 단위 ㎡)">
      <Table columns={["주택형", "세대수", "주거전용", "주거공용", "공급면적", "기타공용", "계약면적"]} rows={rows} />
      <div className="notice-lines">
        <p>{`총 ${s.total}세대 (특별공급 ${s.special}세대 · 일반공급 ${s.general}세대) · ${s.buildings}개동 · ${s.floors} · 입주 ${s.moveIn}`}</p>
        <p>84㎡C — 4Bay 판상형, 맞통풍 구조, 2면 개방, 팬트리 수납</p>
        <PlanFigure file="plan-84c-redraw-v2" alt="청라 아크원 푸르지오 84㎡C 평면 안내도" />
        <UnitFigure file="unit-84c-living-ai.webp" alt="84㎡C 거실 인테리어 연출 이미지(AI 제작)" />
        <UnitFigure file="unit-84c-living-kitchen-ai.webp" alt="84㎡C 거실·주방 인테리어 연출 이미지(AI 제작)" />
        <p>103㎡A — 알파룸을 더해 방 4개처럼 쓸 수 있는 구성, 넓은 팬트리, 별도 세탁실</p>
        <PlanFigure file="plan-103a-redraw-v2" alt="청라 아크원 푸르지오 103㎡A 평면 안내도" />
        <UnitFigure file="unit-103a-alpha-study-ai.webp" alt="103㎡A 알파룸을 서재로 꾸민 인테리어 연출 이미지(AI 제작)" />
        <p>※ 특화 내용은 현장 상품 설명 자료 기준이며 주택형·옵션 선택에 따라 다를 수 있으니 견본주택에서 확인해 주세요.</p>
        <p>견본주택에는 84A·103A 유니트가 설치되어 있습니다.</p>
        <p>학교: (가칭)청라10초 배치 예정(2031년 9월 개교 목표). 개교 전 입주하면 인근 학교에 임시 배치될 수 있고 개교 일정은 조정될 수 있습니다.</p>
        <p>※ 면적은 소수점 넷째 자리까지 표기하며 등기 면적과 차이가 있을 수 있습니다. 평면 형태와 마감은 견본주택과 입주자모집공고문으로 확인해 주세요.</p>
      </div>
      <h3 className="notice-h3">인테리어 연출</h3>
      <div className="unit-gallery">
        <UnitFigure file="interior-master-bedroom-ai.webp" alt="침실 인테리어 연출 이미지(AI 제작)" />
        <UnitFigure file="interior-bathroom-ai.webp" alt="욕실 인테리어 연출 이미지(AI 제작)" />
      </div>
    </Block>
  );
}
