import { useEffect, useId, useState } from "react";
import { Footer } from "@/components/chrome";
import { Arrow, Header, MobileBar, SiteMap } from "@/components/landing-redesign";
import { FunnelBeacon } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY as PHONE, PROJECT_PHONE_TEL as TEL } from "@/data/content";
import { VISIT_REG, VISIT_REG_CONSENT_VERSION, visitRegConfirm, visitRegConsent, visitRegSaveError } from "@/data/visit-register";
import { trackFunnel } from "@/lib/funnel-client";
import { loadVisitConfig, VISIT_SLOT_LABEL, type VisitOption } from "@/lib/visit-config";
import "./visit-register.css";

// 작업지시서 22 (2026-11-21): 방문고객등록 상세페이지(/visit). 새 홈과 같은 디자인.
// 접수는 기존 /api/visit(→ visit_reservations 표, 담당자 알림)를 그대로 쓴다. 문구는 src/data/visit-register.ts 가 정본.

const SLOTS = ["AM", "PM", "ANY"] as const;
const INTERESTS = ["오피스텔", "상가", "아파트"] as const;

type Done = { receiptNo: string; duplicate: boolean; dateLabel: string; slotLabel: string };
type ApiBody = { ok?: boolean; error?: string; receiptNo?: string; duplicate?: boolean; dateLabel?: string; slotLabel?: string } | null;

function VisitRegisterForm() {
  const id = useId();
  const [dates, setDates] = useState<VisitOption[]>([]);
  const [config, setConfig] = useState<"loading" | "ok" | "off">("loading");
  const [slot, setSlot] = useState<(typeof SLOTS)[number]>("ANY");
  const [interest, setInterest] = useState("");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    let live = true;
    loadVisitConfig().then((loaded) => {
      if (!live) return;
      setDates(loaded ? loaded.dates : []);
      setConfig(loaded ? "ok" : "off");
    });
    return () => { live = false; };
  }, []);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const values = new FormData(event.currentTarget);
    const name = String(values.get("name") ?? "").trim();
    const phone = String(values.get("phone") ?? "").replace(/\D/g, "");
    const visitDate = String(values.get("visit_date") ?? "");
    if (name.length < 2 || name.length > 20) { setMessage(VISIT_REG.errors.name); return; }
    if (!/^010\d{8}$/.test(phone)) { setMessage(VISIT_REG.errors.phone); return; }
    if (config === "ok" && !visitDate) { setMessage(VISIT_REG.errors.date); return; }
    if (!values.get("age14")) { setMessage(VISIT_REG.errors.age14); return; }
    if (!values.get("consent")) { setMessage(VISIT_REG.errors.consent); return; }
    setPending(true);
    setMessage("");
    try {
      const query = new URLSearchParams(window.location.search);
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          visit_date: config === "ok" ? visitDate : "",
          visit_slot: config === "ok" ? slot : "ANY",
          interest,
          consent_privacy: true,
          consent_version: VISIT_REG_CONSENT_VERSION,
          page: "/visit",
          hp: String(values.get("hp") ?? ""),
          utm_source: query.get("utm_source") ?? "",
          utm_medium: query.get("utm_medium") ?? "",
          utm_campaign: query.get("utm_campaign") ?? "",
        }),
      });
      const body = (await res.json().catch(() => null)) as ApiBody;
      if (!res.ok || !body?.ok || !body.receiptNo) {
        setMessage(body?.error || visitRegSaveError(PHONE));
        return;
      }
      setDone({ receiptNo: body.receiptNo, duplicate: Boolean(body.duplicate), dateLabel: body.dateLabel ?? "", slotLabel: body.slotLabel ?? "" });
      if (!body.duplicate) trackFunnel("form_complete", "visit");
    } catch {
      setMessage(visitRegSaveError(PHONE));
    } finally {
      setPending(false);
    }
  }

  if (done) {
    const when = [done.dateLabel, done.slotLabel].filter(Boolean).join(" ");
    return (
      <div className="rd-form-result" role="status" data-visit-reg="done">
        <p className="rd-kicker">THANK YOU</p>
        <h3>{done.duplicate ? VISIT_REG.duplicateTitle : VISIT_REG.doneTitle}</h3>
        <p>{when ? `${when} · ` : ""}{VISIT_REG.doneBody}</p>
        <p>{VISIT_REG.receiptLabel} <strong>{done.receiptNo}</strong></p>
        <a className="rd-text-link" href={TEL}>{visitRegConfirm(PHONE)}<Arrow /></a>
      </div>
    );
  }

  return (
    <form className="rd-form rd-visit-form" onSubmit={submit} onFocusCapture={() => trackFunnel("form_start", "visit")} onChange={() => { if (message) setMessage(""); }} aria-label={VISIT_REG.title} aria-busy={pending} data-visit-reg="form" noValidate>
      <p className="rd-form-context">{VISIT_REG.formContext}</p>
      <input className="rd-visit-hp" type="text" name="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="rd-field">
        <label htmlFor={`${id}-name`}>{VISIT_REG.nameLabel} <span>{VISIT_REG.required}</span></label>
        <input id={`${id}-name`} name="name" type="text" autoComplete="name" required minLength={2} maxLength={20} placeholder={VISIT_REG.namePlaceholder} />
      </div>
      <div className="rd-field">
        <label htmlFor={`${id}-phone`}>{VISIT_REG.phoneLabel} <span>{VISIT_REG.required}</span></label>
        <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required maxLength={13} placeholder="010-0000-0000" aria-describedby={`${id}-phone-hint`} />
        <small id={`${id}-phone-hint`}>{VISIT_REG.phoneHint}</small>
      </div>
      {config === "off" ? (
        <p className="rd-visit-config-off">{VISIT_REG.configOff}</p>
      ) : (
        <>
          <div className="rd-field">
            <label htmlFor={`${id}-date`}>{VISIT_REG.dateLabel} <span>{VISIT_REG.required}</span></label>
            <select id={`${id}-date`} name="visit_date" required disabled={config === "loading"} defaultValue="">
              <option value="">{config === "loading" ? VISIT_REG.dateLoading : VISIT_REG.dateChoose}</option>
              {dates.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
            </select>
          </div>
          <fieldset className="rd-product-options">
            <legend>{VISIT_REG.slotLabel}</legend>
            <div>
              {SLOTS.map((value) => (
                <label key={value}><input type="radio" name="visit_slot" value={value} checked={slot === value} onChange={() => setSlot(value)} />{VISIT_SLOT_LABEL[value]}</label>
              ))}
            </div>
          </fieldset>
        </>
      )}
      <fieldset className="rd-product-options">
        <legend>{VISIT_REG.interestLabel} <span>{VISIT_REG.optional}</span></legend>
        <div>
          {INTERESTS.map((value) => (
            <label key={value}><input type="radio" name="interest" value={value} checked={interest === value} onChange={() => setInterest(value)} />{value}</label>
          ))}
        </div>
      </fieldset>
      <details className="rd-consent-details">
        <summary>{VISIT_REG.consentSummary}</summary>
        {visitRegConsent(PHONE).map((line) => <p key={line}>{line}</p>)}
        <p><a href="/privacy" target="_blank" rel="noopener">처리방침</a></p>
      </details>
      <label className="rd-consent"><input type="checkbox" name="age14" required /><span>{VISIT_REG.age14}</span></label>
      <label className="rd-consent"><input type="checkbox" name="consent" required /><span><b>{VISIT_REG.consentTitle}</b></span></label>
      {message && <p className="rd-form-message" role="alert">{message}</p>}
      <button className="rd-btn rd-btn-green rd-submit" type="submit" disabled={pending}>{pending ? VISIT_REG.pending : VISIT_REG.submit}<Arrow /></button>
      <ul className="rd-visit-notes">{VISIT_REG.notes.map((text) => <li key={text}>{text}</li>)}</ul>
    </form>
  );
}

export function VisitRegisterPage() {
  const toRegister = () => { window.location.href = "/register"; };
  return (
    <div className="rd rd-register-page rd-visit-page">
      <FunnelBeacon />
      <Header register={toRegister} />
      <main className="rd-container rd-section">
        <div className="rd-contact-grid">
          <div>
            <p className="rd-kicker">CHEONGNA ARK-ONE PRUGIO</p>
            <h1>{VISIT_REG.title}</h1>
            <p className="rd-lead">{VISIT_REG.lead[0]}<br />{VISIT_REG.lead[1]}</p>
            <p className="rd-visit-rule">{VISIT_REG.rule}</p>
            <a className="rd-contact-phone" href={TEL}>{PHONE}</a>
            <dl className="rd-contact-address"><dt>{VISIT_REG.placeLabel}</dt><dd>{VISIT_REG.place}</dd></dl>
            <a className="rd-text-link" href="/">{VISIT_REG.back}<Arrow /></a>
          </div>
          <div id="visit-register-form" className="rd-form-panel">
            <VisitRegisterForm />
          </div>
        </div>
      </main>
      <SiteMap />
      <Footer />
      <MobileBar register={toRegister} />
    </div>
  );
}
