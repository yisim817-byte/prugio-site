// 103㎡B 선착순 공급 참여의향서 접수 안내 (작업지시서 17 · 2026-11-13)
// 문구는 팩의 common/b103-facts.json 과 한 글자도 다르지 않게 유지한다. 이 파일은 사이트 공통이며 사이트별 값은 props 로만 받는다.
export const B103_ASOF = "2026.11.13";
export const B103_H1 = "청라 아크원 푸르지오 103㎡B 선착순 공급 참여의향서 접수 안내";
export const B103_LEAD = "103㎡B 타입 선착순 공급에 참여하시려면 먼저 참여의향서를 접수하셔야 합니다. 참여의향서는 2026년 11월 17일(화)부터 견본주택에서 신청자 본인이 직접 접수합니다. 선착순 공급 일정과 방식은 현재 미정이며, 확정되면 접수 고객에게 문자·전화 등으로 따로 안내합니다.";
export const B103_KEYS: ReadonlyArray<readonly [string, string, string]> = [["접수 개시", "2026.11.17(화)부터", "마감일은 추후 안내"], ["접수 장소", "견본주택", "신청자 본인 방문 · 신분증 원본"], ["공급 일정·방식", "현재 미정", "확정 후 접수 고객에게 별도 안내"]];
export const B103_ROWS: ReadonlyArray<readonly [string, ReadonlyArray<string>]> = [["접수 대상", ["103㎡B 타입 선착순 공급 참여를 희망하는 고객"]], ["접수 개시", ["2026년 11월 17일(화)부터 접수 · 마감일은 추후 안내", "참여의향서 양식은 견본주택 상담석 13번에서 수령"]], ["접수 장소·방법", ["신청자 본인이 견본주택에 방문", "신분증 원본 제시 → 본인 확인 → 참여의향서 작성·서명", "확인 날인 후 접수증 발급"]], ["대리접수", ["대리작성·대리접수 불가 (담당 직원·배우자·제3자 모두 불가)"]], ["접수 건수", ["신청자 본인 명의로 1인 1건 접수"]], ["참여 자격", ["참여의향서 접수와 본인 확인을 완료한 고객에 한해 103㎡B 타입 선착순 공급 참여 가능", "미신청자는 참석할 수 없습니다"]], ["공급 일정·방식", ["현재 미정 · 확정 후 접수 고객에게 문자·전화 등으로 별도 안내"]], ["진행 참여", ["신청자 본인 참석", "배우자에 한해 대리참석 가능 · 그 외 제3자 대리참여 불가"]], ["계약 명의", ["신청자 본인 또는 배우자 명의로 계약 가능", "배우자 명의 계약 시 관계 확인 서류 제출"]]];
export const B103_STEPS: ReadonlyArray<readonly [string, string, string]> = [["1", "견본주택 방문", "신청자 본인 · 신분증 원본 지참"], ["2", "본인 확인", "신분증 원본 제시"], ["3", "참여의향서 작성·서명", "상담석 13번에서 양식 수령"], ["4", "접수증 발급", "확인 날인 후 발급"]];
export const B103_FACTS: ReadonlyArray<readonly [string, string]> = [["주택형", "103㎡B (전용 103.9916㎡ · 공급 148.2000㎡)"], ["위치", "201·202·203동 1호 라인"], ["공급금액", "10억 8,880만원 ~ 11억 6,340만원 (입주자모집공고 2026.10.22 기준 · 동·층·호별 상이)"], ["납부 조건", "계약금 5% · 중도금 60% 이자후불제 · 잔금 35%"], ["입주 예정", "2031년 08월"]];
export const B103_FAQ: ReadonlyArray<{ q: string; a: string }> = [{"q": "청라 아크원 푸르지오 103㎡B 선착순 참여의향서는 언제부터 어디서 접수하나요?", "a": "2026년 11월 17일(화)부터 견본주택에서 접수합니다. 신청자 본인이 신분증 원본을 가지고 방문해 본인 확인 후 참여의향서를 작성·서명하면 접수증을 받습니다. 마감일은 추후 안내합니다."}, {"q": "103㎡B 선착순 공급은 언제 진행하나요?", "a": "선착순 공급 일정과 방식은 현재 미정입니다. 확정되면 참여의향서를 접수한 고객에게 문자·전화 등으로 따로 안내합니다."}, {"q": "참여의향서를 대리로 접수할 수 있나요?", "a": "대리작성과 대리접수는 할 수 없습니다. 담당 직원·배우자·제3자 모두 불가하며 신청자 본인이 직접 방문해 접수합니다. 접수는 본인 명의로 1인 1건입니다."}, {"q": "참여의향서를 접수하지 않아도 선착순 공급에 참여할 수 있나요?", "a": "참여의향서 접수와 본인 확인을 완료한 고객만 103㎡B 타입 선착순 공급에 참여할 수 있습니다. 미신청자는 참석할 수 없습니다."}, {"q": "선착순 공급 당일 배우자가 대신 참석하거나 배우자 명의로 계약할 수 있나요?", "a": "진행 당일에는 신청자 본인이 참석하며, 배우자에 한해 대리참석이 가능합니다. 계약은 신청자 본인 또는 배우자 명의로 할 수 있고, 배우자 명의로 계약할 때는 관계 확인 서류를 제출합니다."}];
export const B103_NOTES: ReadonlyArray<string> = ["위 내용은 2026.11.13 안내 기준이며, 사업주체 사정에 따라 변경될 수 있습니다. 변경 시 사업주체 안내가 우선합니다.", "참여의향서 접수는 공급계약 체결이 아닙니다. 선착순 공급의 일정·방식·대상 세대는 확정 후 안내합니다.", "선착순 공급 대상 세대는 정당계약(2026.11.22~11.24) 결과 등에 따라 달라질 수 있습니다.", "공급금액은 입주자모집공고(2026.10.22) 기준이며 발코니 확장·유상옵션·취득세 등은 별도입니다."];

type Props = { phone: string; plansHref: string; contactHref: string; visitHref: string };

export function B103Notice({ phone, plansHref, contactHref, visitHref }: Props) {
  const digits = phone.replace(/\D/g, "");
  return (
    <article className="b103" id="b103" data-b103-asof={B103_ASOF}>
      <header className="b103-head">
        <p className="b103-eyebrow">APT · 103㎡B</p>
        <h1 className="b103-title">{B103_H1}</h1>
        <p className="b103-asof">{B103_ASOF} 안내 기준</p>
        <p className="b103-lead">{B103_LEAD}</p>
      </header>
      <ul className="b103-keys">
        {B103_KEYS.map(([k, v, s]) => (
          <li key={k}><span className="b103-keys__k">{k}</span><strong className="b103-keys__v">{v}</strong><span className="b103-keys__s">{s}</span></li>
        ))}
      </ul>
      <section className="b103-sec" aria-labelledby="b103-rule">
        <h2 className="b103-h2" id="b103-rule">참여의향서 접수 운영 기준</h2>
        <div className="b103-tablewrap">
          <table className="b103-table">
            <thead><tr><th scope="col">구분</th><th scope="col">운영 기준</th></tr></thead>
            <tbody>
              {B103_ROWS.map(([k, lines]) => (
                <tr key={k}><th scope="row">{k}</th><td>{lines.map((l, i) => (<span key={l}>{i > 0 ? <br /> : null}{l}</span>))}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="b103-sec" aria-labelledby="b103-step">
        <h2 className="b103-h2" id="b103-step">접수 순서</h2>
        <ol className="b103-steps">
          {B103_STEPS.map(([n, t, s]) => (<li key={n}><span className="b103-steps__n">{n}</span><strong>{t}</strong><span>{s}</span></li>))}
        </ol>
      </section>
      <section className="b103-sec" aria-labelledby="b103-fact">
        <h2 className="b103-h2" id="b103-fact">103㎡B 기본 정보</h2>
        <dl className="b103-facts">
          {B103_FACTS.map(([k, v]) => (<div key={k}><dt>{k}</dt><dd>{v}</dd></div>))}
        </dl>
        <p className="b103-links"><a href={plansHref}>103㎡B 평면도·공급금액 보기 ›</a><a href={contactHref}>견본주택 오시는 길 ›</a></p>
      </section>
      <section className="b103-sec" aria-labelledby="b103-faq">
        <h2 className="b103-h2" id="b103-faq">자주 묻는 질문</h2>
        <div className="b103-faq">
          {B103_FAQ.map((f) => (<details key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>))}
        </div>
      </section>
      <section className="b103-cta" aria-label="문의">
        <p className="b103-cta__t">103㎡B 선착순 참여의향서 문의</p>
        <a className="b103-cta__tel" href={`tel:${digits}`}>{phone}</a>
        <a className="b103-cta__visit" href={visitHref}>견본주택 방문 예약 ›</a>
      </section>
      <ul className="b103-notes">
        {B103_NOTES.map((n) => (<li key={n}>※ {n}</li>))}
      </ul>
    </article>
  );
}
