// 대표 지시(2026-10-31 t244u·t245u): 전체 타입 평면도·가격, 84A부터 차례로. 금액=입주자모집공고문(2026000496) 공급금액표 최저~최고.
const ITEMS = [
  { t: "84A", n: "84㎡A", u: 248, a: "8억 3,780만원", b: "9억 2,070만원", f: "/plans/plan-84a-official", e: "jpg", w: 1600, h: 1771, c: "" },
  { t: "84B", n: "84㎡B", u: 124, a: "8억 5,880만원", b: "9억 50만원", f: "/plans/plan-84b-official", e: "jpg", w: 1600, h: 2070, c: "" },
  { t: "84C", n: "84㎡C", u: 124, a: "8억 4,200만원", b: "9억 880만원", f: "/plans/plan-84c-redraw-v2", e: "png", w: 2000, h: 1250, c: "분양 안내 자료의 평면을 다시 그린 안내용 이미지입니다. 실제와 다를 수 있으며 입주자모집공고문과 견본주택이 우선합니다." },
  { t: "84D", n: "84㎡D", u: 124, a: "8억 4,720만원", b: "9억 520만원", f: "/plans/plan-84d-official", e: "jpg", w: 1600, h: 2096, c: "" },
  { t: "103A", n: "103㎡A", u: 124, a: "11억 1,680만원", b: "11억 7,100만원", f: "/plans/plan-103a-redraw-v2", e: "png", w: 2000, h: 1250, c: "분양 안내 자료의 평면을 다시 그린 안내용 이미지입니다. 실제와 다를 수 있으며 입주자모집공고문과 견본주택이 우선합니다." },
  { t: "103B", n: "103㎡B", u: 124, a: "10억 8,880만원", b: "11억 6,340만원", f: "/plans/plan-103b-official", e: "jpg", w: 1600, h: 2150, c: "" },
];

export function AllTypePlans() {
  return (
    <section className="plans-all-types" aria-label="전체 타입 평면도" style={{ maxWidth: 1100, margin: "32px auto", padding: "0 16px" }}>
      <h2 style={{ fontSize: 22, margin: "0 0 6px" }}>전체 타입 평면도 · 공급금액 (84㎡A · 84㎡B · 84㎡C · 84㎡D · 103㎡A · 103㎡B)</h2>
      {ITEMS.map((x) => (
        <figure key={x.t} data-type={x.t} style={{ margin: "28px 0", borderTop: "1px solid #e5e5e5", paddingTop: 20 }}>
          <h3 style={{ fontSize: 19, margin: "0 0 6px" }}>
            {x.n} <small style={{ fontSize: 14, color: "#666" }}>({x.u}세대)</small>
          </h3>
          <a href={`${x.f}.${x.e}`} target="_blank" rel="noopener">
            <picture>
              <source type="image/webp" srcSet={`${x.f}.webp`} />
              <img src={`${x.f}.${x.e}`} alt={`청라 아크원 푸르지오 ${x.n} 평면도`} width={x.w} height={x.h} loading="lazy" decoding="async" style={{ width: "100%", height: "auto", display: "block" }} />
            </picture>
          </a>
          {x.c ? <p style={{ fontSize: 12.5, color: "#666", margin: "6px 0 0" }}>{x.c}</p> : null}
          <figcaption style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>{`${x.n} 공급금액 ${x.a} ~ ${x.b} (동·층·호별 상이)`}</figcaption>
        </figure>
      ))}
      <p style={{ fontSize: 12.5, color: "#666", margin: "6px 0" }}>※ 84㎡A·B·D·103㎡B 평면 이미지는 청라 아크원 푸르지오 공식 홈페이지 평면정보(확장 기본형·비확장형)를 옮긴 것으로 실제와 다를 수 있으며, 입주자모집공고문과 견본주택이 우선합니다.</p>
      <p style={{ fontSize: 12.5, color: "#666", margin: "6px 0" }}>※ 공급금액: 입주자모집공고문(주택관리번호 2026000496) 공급금액표 기준 최저~최고, 동·층·호별 상이. 발코니 확장비·유상옵션·취득세 등 별도.</p>
    </section>
  );
}
