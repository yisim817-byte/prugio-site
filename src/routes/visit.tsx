import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nb } from "@/components/chrome";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { REGISTER_LABEL } from "@/data/labels";
import { loadVisitConfig, VISIT_SLOT_LABEL, type VisitOption } from "@/lib/visit-config";

// 작업지시서 13 (2026-10-22): 모델하우스 방문예약 전용 페이지. 사전고객등록과 따로 접수한다(/api/visit → visit_reservations).
export const Route = createFileRoute("/visit")({
  head: () => pageHead("모델하우스 방문예약"),
  component: Page,
});

const CONSENT_VERSION = "visit-2026-10-22-v1";
const INTERESTS = ["아파트", "오피스텔", "상가"] as const;
const SLOTS = ["AM", "PM", "ANY"] as const;

type Done = { receiptNo: string; duplicate: boolean; dateLabel: string; slotLabel: string };

function utm() {
  const q = new URLSearchParams(window.location.search);
  return { utm_source: q.get("utm_source") ?? "", utm_medium: q.get("utm_medium") ?? "", utm_campaign: q.get("utm_campaign") ?? "" };
}

function Page() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState<(typeof SLOTS)[number]>("ANY");
  const [interest, setInterest] = useState("");
  const [consent, setConsent] = useState(false);
  const [hp, setHp] = useState("");
  const [dates, setDates] = useState<VisitOption[]>([]);
  const [cfg, setCfg] = useState<"loading" | "ok" | "off">("loading");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => {
    let live = true;
    loadVisitConfig().then((c) => {
      if (!live) return;
      setDates(c ? c.dates : []);
      setCfg(c ? "ok" : "off");
    });
    return () => { live = false; };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (name.trim().length < 1) return setError("이름을 입력해 주세요.");
    if (!/^010\d{8}$/.test(phone.replace(/\D/g, ""))) return setError("휴대폰번호는 010으로 시작하는 11자리입니다.");
    if (cfg === "ok" && !visitDate) return setError("방문 희망일을 선택해 주세요.");
    if (!consent) return setError("개인정보 수집·이용에 동의해야 신청할 수 있습니다.");
    setPending(true);
    try {
      const res = await fetch("/api/visit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name, phone, visit_date: cfg === "ok" ? visitDate : "", visit_slot: cfg === "ok" ? visitSlot : "ANY", interest,
          consent_privacy: true, consent_version: CONSENT_VERSION, page: "/visit", hp, ...utm(),
        }),
      });
      const body = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; receiptNo?: string; duplicate?: boolean; dateLabel?: string; slotLabel?: string } | null;
      if (!res.ok || !body?.ok || !body.receiptNo) {
        setError(body?.error || "접수하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setDone({ receiptNo: body.receiptNo, duplicate: Boolean(body.duplicate), dateLabel: body.dateLabel ?? "", slotLabel: body.slotLabel ?? "" });
    } catch {
      setError("접수하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell>
      <SubHero en="VISIT" title="모델하우스 방문예약" crumbs="모델하우스 방문예약" />
      <main className="ak-wrap ak-page">
        <div className="max-w-lg">
          <p className="border-y border-line py-4 leading-7">방문 희망 날짜를 남겨 주시면, 담당자가 확인 후 방문 시간을 전화로 안내해 드립니다.</p>
          <p className="mt-4 text-sm font-medium leading-6">견본주택 위치 · 인천광역시 서해구 청라동 87-1 · GRAND OPEN 10.30(금)</p>
          {done ? (
            <div className="mt-8 space-y-4" role="status">
              <h2 className="ak-h2">{done.duplicate ? "이미 접수되었습니다" : "방문예약 신청이 접수되었습니다."}</h2>
              <p className="text-sm leading-6">
                {[done.dateLabel, done.slotLabel].filter(Boolean).join(" ")}
                {done.dateLabel || done.slotLabel ? " · " : ""}담당자가 확인 후 전화로 방문 시간을 안내해 드립니다.
              </p>
              <p className="text-sm leading-6">접수번호 <strong className="font-medium">{done.receiptNo}</strong></p>
              <Link to="/register" className="ak-btn ak-btn--primary ak-btn--block">사전고객등록도 하기</Link>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
              <input type="text" name="hp" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <Field label="이름 (필수)">
                <input required maxLength={20} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
              </Field>
              <Field label="휴대폰번호 (필수)" hint="010으로 시작하는 11자리">
                <input required inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} autoComplete="tel" placeholder="01012345678" />
              </Field>
              {cfg === "off" ? (
                <div className="border border-line p-4 text-sm leading-6">
                  <p>방문 일정은 담당자가 전화로 확인합니다.</p>
                  <a href={PROJECT_PHONE_TEL} className="ak-btn ak-btn--line ak-btn--block mt-3">전화 예약 {PROJECT_PHONE_DISPLAY}</a>
                </div>
              ) : (
                <>
                  <Field label="방문 희망일 (필수)">
                    <select name="visit_date" required value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className={inputClass} disabled={cfg === "loading"}>
                      <option value="">{cfg === "loading" ? "날짜 불러오는 중" : "날짜 선택"}</option>
                      {dates.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </Field>
                  <fieldset className="text-sm">
                    <legend className="font-medium">방문 희망 시간대</legend>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
                      {SLOTS.map((value) => (
                        <label key={value} className="flex items-center gap-2 leading-6">
                          <input type="radio" name="visit_slot" value={value} checked={visitSlot === value} onChange={() => setVisitSlot(value)} className="h-5 w-5" />
                          <span>{VISIT_SLOT_LABEL[value]}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                </>
              )}
              <fieldset className="text-sm">
                <legend className="font-medium">관심 상품 (선택)</legend>
                <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
                  {INTERESTS.map((item) => (
                    <label key={item} className="flex items-center gap-2 leading-6">
                      <input type="radio" name="interest" value={item} checked={interest === item} onChange={() => setInterest(item)} className="h-5 w-5" />
                      <span>{item}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="flex items-start gap-3 text-sm leading-6">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5" />
                <span>
                  <Nb>개인정보 수집·이용 동의(필수) — 수집항목: 이름, 휴대폰번호, 방문 희망일·시간대, 관심 상품(자동 수집: 서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보, 불량이용 기록, 기기정보) / 이용목적: 견본주택 방문 일정 안내, 청라 아크원 푸르지오 분양정보 제공 및 마케팅 활용(마케팅 활용은 광고성 정보 수신에 동의한 경우에 한함) / 보유기간: 사전고객등록과 같은 기간(분양 종료 시 파기)</Nb>{" "}
                  <Link to="/privacy" className="underline">처리방침</Link>
                </span>
              </label>
              {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
              <button type="submit" disabled={pending} className="ak-btn ak-btn--primary ak-btn--block disabled:opacity-60">
                {pending ? "접수 중" : "방문예약 신청"}
              </button>
              <div className="space-y-1 text-sm leading-6 text-muted">
                <p>※ 방문 시간은 담당자가 전화로 확정 안내합니다.</p>
                <p>※ 방문예약은 청약 신청이 아니며, 청약 자격·순위와 관계없습니다.</p>
                <p>
                  ※ 방문예약은 사전고객등록과 별개입니다. 백화점 상품권·코스트코 회원권 이벤트는 사전고객등록을 한 분이 대상입니다.{" "}
                  <Link to="/register" className="underline">{REGISTER_LABEL} 하기</Link>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
    </Shell>
  );
}

const inputClass = "h-12 w-full rounded-[2px] border border-muted bg-paper px-3 text-base";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint ? <span className="mt-1 block text-muted">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}
