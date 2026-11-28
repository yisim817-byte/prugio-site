import { useId, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell } from "@/components/layout";
import { PLACES, PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { SEO_ORIGIN } from "@/data/seo";
import { VISIT_CONSENT_VERSION, VISIT_PROCESSOR, VISIT_STORAGE_LABEL, visitMarketingLabel } from "@/data/visit-apply";
import { trackFunnel } from "@/lib/funnel-client";

// 작업지시서 32: /visit 상세페이지에 이름·휴대폰 신청폼을 더한다. 전화 예약 안내와 약도는 유지한다.
const TITLE = `견본주택 방문예약 | 청라 아크원 푸르지오 ${PROJECT_PHONE_DISPLAY}`;
const DESCRIPTION = "청라 아크원 푸르지오 견본주택 방문은 사전 예약제입니다. 온라인 신청 또는 1533-9014 전화로 방문예약하실 수 있습니다.";
const URL = `${SEO_ORIGIN}/visit`;
const RRN = /(\d{6}\s*-?\s*[1-8]\d{6})|(\d{13})/;

const FAQ = [
  { q: "온라인으로도 방문예약이 되나요?", a: `네. 이 페이지에서 이름과 휴대폰번호로 신청하시면 ${PROJECT_PHONE_DISPLAY}에서 연락드려 방문 일시를 안내해 드립니다. 전화(${PROJECT_PHONE_DISPLAY})로도 예약하실 수 있습니다.` },
  { q: "예약 없이 방문해도 되나요?", a: `견본주택 방문은 사전 예약제입니다. 방문 전 ${PROJECT_PHONE_DISPLAY}로 예약해 주세요.` },
  { q: "스타벅스 커피 쿠폰은 어떻게 받나요?", a: `전화로 방문고객등록 후 모델하우스를 방문하시면 증정합니다. 지급 기준·기간은 ${PROJECT_PHONE_DISPLAY}로 확인해 주세요. 사전 공지 후 변경·조기 종료될 수 있습니다.` },
  { q: "방문고객등록이 청약 신청인가요?", a: "아닙니다. 방문고객등록은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다. 청약은 한국부동산원 청약홈에서 신청합니다." },
  { q: "어떤 상품을 상담받을 수 있나요?", a: "아파트, 오피스텔, 상업시설을 상담받으실 수 있습니다. 예약 전화 때 관심 상품을 말씀해 주세요." },
] as const;

const SCHEDULE = [
  ["오피스텔 견본주택 오픈", "12.4(금) 예정"],
  ["오피스텔 청약", "12.7(월)"],
  ["오피스텔 당첨자 발표", "12.11(금)"],
  ["오피스텔 계약", "12.12(토)~12.13(일)"],
  ["아파트 선착순 계약", "12.26(토) 예정"],
] as const;

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: URL },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "ko_KR" },
    ],
    links: [{ rel: "canonical", href: URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": `${URL}#webpage`,
              name: TITLE,
              description: DESCRIPTION,
              url: URL,
              inLanguage: "ko-KR",
              telephone: "+82-1533-9014",
              breadcrumb: { "@id": `${URL}#breadcrumb` },
            },
            {
              "@type": "BreadcrumbList",
              "@id": `${URL}#breadcrumb`,
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "홈", item: `${SEO_ORIGIN}/` },
                { "@type": "ListItem", position: 2, name: "방문예약", item: URL },
              ],
            },
            {
              "@type": "FAQPage",
              "@id": `${URL}#faq`,
              mainEntity: FAQ.map((item) => ({
                "@type": "Question",
                name: item.q,
                acceptedAnswer: { "@type": "Answer", text: item.a },
              })),
            },
          ],
        }),
      },
    ],
  }),
  component: Page,
});

function Page() {
  return <PhoneVisit />;
}

function PhoneVisit() {
  return (
    <Shell>
      <article className="vr">
        <header className="vr-hero">
          <div className="ak-wrap">
            <p className="vr-kicker">MODEL HOUSE RESERVATION</p>
            <h1>견본주택 방문예약</h1>
            <p className="vr-lead">견본주택 방문은 사전 예약제입니다. 온라인 신청 또는 전화({PROJECT_PHONE_DISPLAY})로 방문예약하실 수 있습니다.</p>
            <div className="vr-actions">
              <a className="vr-cta" href="#visit-form">온라인 방문예약 신청 ↓</a>
              <a className="vr-cta vr-cta--line" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
            </div>
            <p className="vr-fine">상담 가능 시간은 전화로 안내해 드립니다.</p>
          </div>
        </header>

        <div className="ak-wrap vr-body">
          <VisitApplyForm />

          <section className="vr-benefit" aria-labelledby="vr-benefit-title">
            <h2 id="vr-benefit-title">방문 혜택</h2>
            <p className="vr-benefit__body">전화로 방문고객등록 후 모델하우스 방문 시 스타벅스 커피 쿠폰 증정</p>
            <p className="vr-note">※ 쿠폰 지급 기준·기간은 {PROJECT_PHONE_DISPLAY}로 확인해 주세요. 사전 공지 후 변경·조기 종료될 수 있습니다.</p>
            <p className="vr-note">※ 방문고객등록은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>
          </section>

          <section aria-labelledby="vr-steps-title">
            <h2 id="vr-steps-title">예약 방법</h2>
            <ol className="vr-steps">
              <li>
                <span>01</span>
                <strong>온라인 신청 또는 전화</strong>
                <p>이 페이지에서 신청하거나 {PROJECT_PHONE_DISPLAY}로 전화해 주세요.</p>
              </li>
              <li>
                <span>02</span>
                <strong>{PROJECT_PHONE_DISPLAY}에서 연락드려 방문 일시 안내</strong>
                <p>남기신 번호로 연락드려 방문 일시를 안내해 드립니다.</p>
              </li>
              <li>
                <span>03</span>
                <strong>예약 시간에 견본주택 방문</strong>
                <p>예약한 시간에 견본주택에 오시면 상담을 도와드립니다.</p>
              </li>
            </ol>
          </section>

          <section aria-labelledby="vr-products-title">
            <h2 id="vr-products-title">상담 가능 상품</h2>
            <div className="vr-cards">
              <a className="vr-card" href="/plans">
                <strong>오피스텔</strong>
                <p>987실 · 전용 105㎡·121㎡·136㎡ · 청약 12.7(월)</p>
              </a>
              <a className="vr-card" href="/103b">
                <strong>아파트</strong>
                <p>868세대 · 전용 84㎡·103㎡ · 103㎡B 선착순 안내</p>
              </a>
              <a className="vr-card" href="#popup_soon_commercial" data-popup-soon="commercial" aria-haspopup="dialog">
                <strong>상업시설</strong>
                <p>1~2층 근린생활시설 · 분양 예정</p>
              </a>
            </div>
            <p className="vr-more"><a href="/compare">아파트 vs 오피스텔 비교 보기 ›</a></p>
          </section>

          <section aria-labelledby="vr-schedule-title">
            <h2 id="vr-schedule-title">방문 전 확인하실 일정</h2>
            <table className="vr-table">
              <caption>방문 전 확인하실 일정</caption>
              <thead>
                <tr>
                  <th scope="col">구분</th>
                  <th scope="col">일정</th>
                </tr>
              </thead>
              <tbody>
                {SCHEDULE.map(([name, when]) => (
                  <tr key={name}>
                    <th scope="row">{name}</th>
                    <td>{when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="vr-note">※ 일정은 사업주체 사정에 따라 변경될 수 있으며, 입주자모집공고문이 우선합니다. 최신 일정은 {PROJECT_PHONE_DISPLAY}로 확인해 주세요.</p>
          </section>

          <section aria-labelledby="vr-check-title">
            <h2 id="vr-check-title">방문 전 알아두시면 좋은 점</h2>
            <ul className="vr-checks">
              <li>관심 상품과 희망 평형을 예약 전화 때 말씀해 주시면 상담이 빠릅니다.</li>
              <li>청약 자격 상담이 필요하시면 세대 구성과 주택 소유 여부를 미리 확인해 오세요.</li>
              <li>예약 시간 변경·취소도 {PROJECT_PHONE_DISPLAY}로 연락해 주세요.</li>
            </ul>
          </section>

          <section aria-labelledby="vr-map-title">
            <h2 id="vr-map-title">모델하우스(견본주택) 위치</h2>
            <Photo
              src={PLACES[0].map}
              alt="청라 아크원 푸르지오 모델하우스 약도"
              className="vr-map"
              eager
            />
            <p className="vr-map__note">방문 전 대표번호로 예약해 주세요.</p>
            <a className="vr-cta vr-cta--sm" href={PROJECT_PHONE_TEL}>{PROJECT_PHONE_DISPLAY}</a>
          </section>

          <section className="vr-faq" aria-labelledby="vr-faq-title">
            <h2 id="vr-faq-title">자주 묻는 질문</h2>
            <dl>
              {FAQ.map((item) => (
                <div key={item.q}>
                  <dt>{item.q}</dt>
                  <dd>{item.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <section className="vr-band" aria-label="전화 예약">
          <div className="ak-wrap">
            <p>견본주택 방문은 사전 예약제입니다</p>
            <a className="vr-gold" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
          </div>
        </section>
      </article>
      <a className="vr-dock" href={PROJECT_PHONE_TEL}>전화로 방문예약 {PROJECT_PHONE_DISPLAY}</a>
    </Shell>
  );
}

function formatPhoneInput(raw: string) {
  const d = raw.replace(/\D/g, "").slice(0, 11);
  if (d.length < 4) return d;
  if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

type VisitDone = { receiptNo: string; duplicate: boolean; consentDate: string; marketing: string };

function VisitApplyForm() {
  const id = useId();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [hp, setHp] = useState("");
  const [age14, setAge14] = useState(false);
  const [privacy, setPrivacy] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [call, setCall] = useState(false);
  const [sms, setSms] = useState(false);
  const [openPrivacy, setOpenPrivacy] = useState(false);
  const [openMarketing, setOpenMarketing] = useState(false);
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [consentError, setConsentError] = useState("");
  const [formError, setFormError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<VisitDone | null>(null);
  const allOn = age14 && privacy && marketing && call && sms;

  function setAll(on: boolean) {
    setAge14(on);
    setPrivacy(on);
    setMarketing(on);
    setCall(on);
    setSms(on);
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const trimmed = name.trim();
    const digits = phone.replace(/\D/g, "");
    let ok = true;
    if (trimmed.length < 2 || trimmed.length > 20) {
      setNameError("이름을 2~20자로 입력해 주세요.");
      ok = false;
    } else if (RRN.test(name) || RRN.test(trimmed)) {
      setNameError("주민등록번호는 받지 않습니다.");
      ok = false;
    } else {
      setNameError("");
    }
    if (!/^010\d{8}$/.test(digits)) {
      setPhoneError("휴대폰번호는 010으로 시작하는 11자리입니다.");
      ok = false;
    } else {
      setPhoneError("");
    }
    if (!age14 || !privacy) {
      setConsentError("필수 항목에 동의해 주세요.");
      ok = false;
    } else {
      setConsentError("");
    }
    if (!ok) return;
    setPending(true);
    setFormError("");
    try {
      const query = new URLSearchParams(window.location.search);
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: trimmed,
          phone: digits,
          age14: true,
          consent_privacy: true,
          consent_marketing: marketing,
          consent_call: marketing ? call : false,
          consent_sms: marketing ? sms : false,
          consent_version: VISIT_CONSENT_VERSION,
          page: "/visit",
          hp,
          utm_source: query.get("utm_source") ?? "",
          utm_medium: query.get("utm_medium") ?? "",
          utm_campaign: query.get("utm_campaign") ?? "",
        }),
      });
      const body = (await res.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
        receiptNo?: string;
        duplicate?: boolean;
        consentDate?: string;
        marketing?: string;
      } | null;
      if (!res.ok || !body?.ok || !body.receiptNo) {
        const message = body?.error || "";
        if (message.includes("이름") || message.includes("주민")) setNameError(message);
        else if (message.includes("휴대폰")) setPhoneError(message);
        else if (message.includes("필수")) setConsentError(message);
        else setFormError("접수를 확인하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도하시거나 1533-9014로 문의해 주세요.");
        return;
      }
      setDone({
        receiptNo: body.receiptNo,
        duplicate: Boolean(body.duplicate),
        consentDate: body.consentDate ?? "",
        marketing: body.marketing ?? visitMarketingLabel(marketing, call, sms),
      });
      if (!body.duplicate) trackFunnel("form_complete", "visit");
    } catch {
      setFormError("접수를 확인하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 시도하시거나 1533-9014로 문의해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section id="visit-form" className="vr-form-wrap" aria-labelledby="vr-form-title">
      {done ? (
        <div className="vr-form vr-done" role="status" data-visit-done="1">
          <h2 id="vr-form-title">{done.duplicate ? "이미 접수된 신청입니다" : "방문예약 신청이 접수되었습니다."}</h2>
          <p className="vr-done__no">접수번호 <strong>{done.receiptNo}</strong></p>
          <p>{PROJECT_PHONE_DISPLAY}에서 연락드려 방문 일시를 안내해 드립니다.</p>
          <p>광고성 정보 수신 동의 : {done.marketing} · 동의일 {done.consentDate}</p>
          <a className="vr-cta" href={PROJECT_PHONE_TEL}>전화로 문의 {PROJECT_PHONE_DISPLAY}</a>
        </div>
      ) : (
        <form className="vr-form" onSubmit={submit} onFocusCapture={() => trackFunnel("form_start", "visit")} noValidate aria-label="온라인 방문예약 신청" aria-busy={pending} data-visit-form="1">
          <h2 id="vr-form-title">온라인 방문예약 신청</h2>
          <p className="vr-form__lead">이름과 휴대폰번호만 남겨 주시면 {PROJECT_PHONE_DISPLAY}에서 방문 일시를 안내해 드립니다.</p>
          <input className="vr-hp" type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={hp} onChange={(event) => setHp(event.target.value)} />
          <div className="vr-field">
            <label htmlFor={`${id}-name`}>이름 <span>(필수)</span></label>
            <input id={`${id}-name`} name="name" type="text" autoComplete="name" inputMode="text" maxLength={20} value={name} onChange={(event) => setName(event.target.value)} onFocus={(event) => event.currentTarget.scrollIntoView({ block: "center" })} />
            {nameError ? <p className="vr-err" role="alert">{nameError}</p> : null}
          </div>
          <div className="vr-field">
            <label htmlFor={`${id}-phone`}>휴대폰번호 <span>(필수)</span></label>
            <input id={`${id}-phone`} name="phone" type="tel" inputMode="numeric" autoComplete="tel" maxLength={13} placeholder="010-0000-0000" value={phone} onChange={(event) => setPhone(formatPhoneInput(event.target.value))} onFocus={(event) => event.currentTarget.scrollIntoView({ block: "center" })} />
            {phoneError ? <p className="vr-err" role="alert">{phoneError}</p> : null}
          </div>
          <div className="vr-consents">
            <label className="vr-check">
              <input type="checkbox" checked={allOn} onChange={(event) => setAll(event.target.checked)} />
              <span>모두 확인하였으며 동의합니다.</span>
            </label>
            <p className="vr-check__note">전체 동의에는 필수 및 선택 항목 동의가 포함되며, 개별적으로 선택하실 수 있습니다. 선택 항목에 동의하지 않으셔도 방문예약 신청이 가능합니다.</p>
            <label className="vr-check">
              <input type="checkbox" checked={age14} onChange={(event) => setAge14(event.target.checked)} />
              <span>[필수] 만 14세 이상입니다.</span>
            </label>
            <div className="vr-check-row">
              <label className="vr-check">
                <input type="checkbox" checked={privacy} onChange={(event) => setPrivacy(event.target.checked)} />
                <span>[필수] 개인정보 수집·이용 동의</span>
              </label>
              <button type="button" className="vr-view" aria-expanded={openPrivacy} onClick={() => setOpenPrivacy((v) => !v)}>{openPrivacy ? "닫기 ▴" : "보기 ▾"}</button>
            </div>
            {openPrivacy ? (
              <div className="vr-legal">
                {`개인정보 수집·이용 안내
1. 수집·이용 목적 : 견본주택 방문예약 접수 및 방문 일시 안내 연락
2. 수집 항목 : 이름, 휴대폰번호
   (서비스 이용 과정에서 접속 기록·쿠키 등이 생성될 수 있습니다)
3. 보유·이용 기간 : 방문 안내 완료 등 목적 달성 시 지체 없이 파기하며,
   최장 수집일로부터 1년까지 보유합니다. 동의를 철회하시면 지체 없이 파기합니다.
4. 동의를 거부할 권리 및 불이익 : 동의를 거부하실 수 있습니다.
   거부하시면 온라인 방문예약 신청이 제한되며, 전화(${PROJECT_PHONE_DISPLAY})로는 예약하실 수 있습니다.
5. 보관 : 접수 정보는 이 사이트의 접수 저장소(${VISIT_STORAGE_LABEL})에 보관합니다.
   자세한 내용은 개인정보처리방침에서 확인하실 수 있습니다.
문의 : ${PROJECT_PHONE_DISPLAY}`}
              </div>
            ) : null}
            <div className="vr-check-row">
              <label className="vr-check">
                <input type="checkbox" checked={marketing} onChange={(event) => { const on = event.target.checked; setMarketing(on); setCall(on); setSms(on); }} />
                <span>[선택] 마케팅 활용 및 광고성 정보 수신 동의</span>
              </label>
              <button type="button" className="vr-view" aria-expanded={openMarketing} onClick={() => setOpenMarketing((v) => !v)}>{openMarketing ? "닫기 ▴" : "보기 ▾"}</button>
            </div>
            <div className="vr-subchecks">
              <label className="vr-check">
                <input type="checkbox" checked={call} onChange={(event) => { const on = event.target.checked; setCall(on); setMarketing(on || sms); }} />
                <span>전화</span>
              </label>
              <label className="vr-check">
                <input type="checkbox" checked={sms} onChange={(event) => { const on = event.target.checked; setSms(on); setMarketing(call || on); }} />
                <span>문자(SMS·카카오톡)</span>
              </label>
            </div>
            {openMarketing ? (
              <div className="vr-legal">
                {`마케팅 활용 및 광고성 정보 수신 동의(선택)
1. 목적 : 청라 아크원 푸르지오 분양 일정·상품·행사 등 광고성 정보 안내
2. 항목 : 이름, 휴대폰번호
3. 수신 방법 : 전화, 문자(SMS·LMS·카카오톡) 중 동의하신 방법
4. 보유·이용 기간 : 동의 철회 시 또는 수집일로부터 1년까지
5. 동의하지 않으셔도 방문예약 신청은 가능합니다.
   동의 후에도 언제든지 ${PROJECT_PHONE_DISPLAY}로 수신을 거부(철회)하실 수 있습니다.
6. 전송자 : ${VISIT_PROCESSOR}`}
              </div>
            ) : null}
            {consentError ? <p className="vr-err" role="alert">{consentError}</p> : null}
          </div>
          <button type="submit" disabled={pending}>{pending ? "접수 중…" : "방문예약 신청"}</button>
          {formError ? <p className="vr-err" role="alert">{formError}</p> : null}
          <p className="vr-fine">방문예약 신청은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>
        </form>
      )}
    </section>
  );
}
