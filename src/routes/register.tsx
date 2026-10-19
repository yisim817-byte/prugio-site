import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Nb } from "@/components/chrome";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { REGISTER_LABEL } from "@/data/labels";
import { submitLead } from "@/lib/leads.functions";
import { loadVisitConfig, VISIT_SLOT_LABEL, type VisitOption } from "@/lib/visit-config";

export const Route = createFileRoute("/register")({
  head: () => pageHead(REGISTER_LABEL),
  component: Page,
});

const SIDOS = [
  "서울특별시", "부산광역시", "대구광역시", "인천광역시", "광주광역시", "대전광역시",
  "울산광역시", "세종특별자치시", "경기도", "강원특별자치도", "충청북도", "충청남도",
  "전북특별자치도", "전라남도", "경상북도", "경상남도", "제주특별자치도",
];

const STATUS: Record<string, string> = {
  not_configured: "접수가 저장되었습니다. 알림 수신은 확인되지 않았습니다.",
  accepted: "접수가 저장되었습니다. 알림 수신은 확인되지 않았습니다.",
  failed: "접수가 저장되었습니다. 알림 수신은 확인되지 않았습니다.",
  skipped_duplicate: "같은 번호로 이미 접수되어 있습니다.",
  pending: "접수가 저장되었습니다. 알림 수신은 확인되지 않았습니다.",
};

// R21 (2026-10-16): 등록 상품 선택 — 아파트·오피스텔·상가(대표 지시). 상가 수치·면적·업종은 쓰지 않는다.
const PRODUCTS = [
  { value: "apt", label: "아파트" },
  { value: "officetel", label: "오피스텔" },
  { value: "commercial", label: "상가" },
] as const;
type Product = (typeof PRODUCTS)[number]["value"];
const PRODUCT_LABEL: Record<Product, string> = { apt: "아파트", officetel: "오피스텔", commercial: "상가" };

function isProduct(value: string | null): value is Product {
  return value === "apt" || value === "officetel" || value === "commercial";
}

function Page() {
  const [product, setProduct] = useState<Product | "">("");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("product");
    if (isProduct(requested)) setProduct(requested);
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth6, setBirth6] = useState("");
  const [sido, setSido] = useState("인천광역시");
  const [sigungu, setSigungu] = useState("");
  const [dong, setDong] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ receiptNo: string; duplicate: boolean; notifyStatus: string; product: Product; visitLine: string } | null>(null);
  // 모델하우스 방문예약(선택) — 작업지시서 9. 비워도 등록은 그대로 진행된다.
  const [visitOn, setVisitOn] = useState(false);
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState("");
  const [visitDates, setVisitDates] = useState<VisitOption[] | null>(null);
  const [visitCfg, setVisitCfg] = useState<"loading" | "ok" | "off">("loading");

  useEffect(() => {
    let live = true;
    const fromPopup = new URLSearchParams(window.location.search).get("visit") === "1";
    if (fromPopup) setVisitOn(true);
    loadVisitConfig().then((cfg) => {
      if (!live) return;
      setVisitDates(cfg ? cfg.dates : null);
      setVisitCfg(cfg ? "ok" : "off");
      if (!fromPopup) return;
      requestAnimationFrame(() => {
        const block = document.getElementById("visit");
        block?.scrollIntoView({ behavior: "smooth", block: "center" });
        (block?.querySelector<HTMLElement>("select") ?? block?.querySelector<HTMLElement>("input"))?.focus({ preventScroll: true });
      });
    });
    return () => { live = false; };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!product) {
      setError("아파트·오피스텔·상가 중 등록하실 상품을 선택해 주세요.");
      return;
    }
    if (!consent) {
      setError("개인정보 수집·이용에 동의해야 등록할 수 있습니다.");
      return;
    }
    setPending(true);
    try {
      const result = await submitLead({
        data: {
          product, name, phone, birth6, sido, sigungu, dong, consent: true, entry: "/register",
          ...(visitOn && visitDate ? { visit_date: visitDate, visit_slot: visitSlot || "ANY" } : {}),
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      let visitLine = "";
      if (visitOn && visitDate) {
        const label = visitDates?.find((item) => item.value === visitDate)?.label || visitDate;
        visitLine = result.visitSaved === true
          ? `방문 희망일 ${label} ${VISIT_SLOT_LABEL[visitSlot || "ANY"]} · 담당자가 확인 후 연락드립니다.`
          : "방문 희망 일정은 담당자가 전화로 확인합니다.";
      }
      setDone({ receiptNo: result.receiptNo, duplicate: result.duplicate, notifyStatus: result.notifyStatus, product, visitLine });
    } catch {
      setError("저장하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요. 같은 번호로 다시 보내도 접수가 중복 생성되지는 않습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell>
      <SubHero en="REGISTER" title={REGISTER_LABEL} crumbs={REGISTER_LABEL} />
      <main className="ak-wrap ak-page">
        <div className="max-w-lg">
        <p className="border-y border-line py-4 leading-7">
          {REGISTER_LABEL}이며 청약 신청이 아닙니다. 주민등록번호는 받지 않습니다.
        </p>
        {done ? (
          <div className="mt-8 space-y-4" role="status">
            <h2 className="ak-h2">{done.duplicate ? "이미 등록된 번호" : "접수되었습니다"}</h2>
            {done.visitLine ? <p className="text-sm leading-6">{done.visitLine}</p> : null}
            <p className="text-sm leading-6">접수번호 <strong className="font-medium">{done.receiptNo}</strong></p>
            <p className="text-sm leading-6">선택하신 {PRODUCT_LABEL[done.product]} 상품으로 담당자가 안내드립니다.</p>
            <p className="text-sm leading-6">{STATUS[done.notifyStatus] ?? STATUS.pending}</p>
            <Link to="/" className="ak-link">처음으로</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
            <fieldset className="block text-sm">
              <legend className="font-medium">등록하실 상품</legend>
              <span className="mt-1 block text-muted">아파트·오피스텔·상가 중 하나를 선택해 주세요.</span>
              <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
                {PRODUCTS.map((item) => (
                  <label key={item.value} className="flex items-center gap-2 text-sm leading-6">
                    <input type="radio" name="product" value={item.value} required checked={product === item.value} onChange={() => setProduct(item.value)} className="h-5 w-5" />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>
            <Field label="성명" error={name.trim().length > 0 && name.trim().length < 2 ? "두 글자 이상" : ""}>
              <input required minLength={2} maxLength={20} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} autoComplete="name" />
            </Field>
            <Field label="휴대전화" hint="010으로 시작하는 11자리" error="">
              <input required inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} autoComplete="tel" placeholder="01012345678" />
            </Field>
            <Field label="생년월일 앞 6자리" hint="YYMMDD. 뒷자리는 받지 않습니다." error="">
              <input required inputMode="numeric" maxLength={6} value={birth6} onChange={(e) => setBirth6(e.target.value.replace(/\D/g, "").slice(0, 6))} className={inputClass} autoComplete="off" />
            </Field>
            <Field label="시·도" error="">
              <select value={sido} onChange={(e) => setSido(e.target.value)} className={inputClass}>
                {SIDOS.map((item) => <option key={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="시·군·구" error="">
              <input required minLength={2} maxLength={20} value={sigungu} onChange={(e) => setSigungu(e.target.value)} className={inputClass} placeholder="예: 서구" />
            </Field>
            <Field label="동" error="">
              <input required minLength={1} maxLength={20} value={dong} onChange={(e) => setDong(e.target.value)} className={inputClass} placeholder="예: 청라동" />
            </Field>
            <div id="visit" className="scroll-mt-32 border border-line p-4 text-sm">
              <p className="font-medium">모델하우스 방문예약 (선택)</p>
              <label className="mt-2 flex items-center gap-3 leading-6">
                <input type="checkbox" checked={visitOn} onChange={(e) => setVisitOn(e.target.checked)} className="h-5 w-5" />
                <span>모델하우스 방문을 희망합니다</span>
              </label>
              {visitCfg === "ok" && visitOn ? (
                <div className="mt-4 space-y-4">
                  <Field label="방문 희망일" error="">
                    <select name="visit_date" value={visitDate} onChange={(e) => {
                      setVisitDate(e.target.value);
                      if (e.target.value) { setVisitOn(true); if (!visitSlot) setVisitSlot("ANY"); }
                    }} className={inputClass}>
                      <option value="">날짜 선택</option>
                      {(visitDates ?? []).map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                    </select>
                  </Field>
                  <fieldset>
                    <legend className="font-medium">방문 희망 시간대</legend>
                    <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
                      {(["AM", "PM", "ANY"] as const).map((value) => (
                        <label key={value} className="flex items-center gap-2 leading-6">
                          <input type="radio" name="visit_slot" value={value} checked={visitSlot === value} onChange={() => setVisitSlot(value)} className="h-5 w-5" />
                          <span>{VISIT_SLOT_LABEL[value]}</span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  <p className="text-muted">※ 방문 시간은 담당자가 전화로 확정 안내합니다.</p>
                </div>
              ) : null}
              {visitCfg === "off" ? <p className="mt-2 text-muted">방문 희망 일정은 담당자가 전화로 확인합니다.</p> : null}
            </div>
            <p className="border border-line bg-paper p-3 text-sm leading-6">※ 동일 현장의 다른 홈페이지·분양 채널에 중복으로 등록하신 경우, 상품권 지급이 제한될 수 있습니다.</p>
            <label className="flex items-start gap-3 text-sm leading-6">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5" />
              <span>
                <Nb>개인정보 수집·이용에 동의합니다. 항목은 관심 상품·성명·휴대전화·생년월일 앞 6자리·시군구동, 방문 희망일·시간대(선택)이며, 삭제할 때까지 보유합니다.</Nb>{" "}
                <Link to="/privacy" className="underline">처리방침</Link>
              </span>
            </label>
            {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
            <button type="submit" disabled={pending} className="ak-btn ak-btn--primary ak-btn--block disabled:opacity-60">
              {pending ? "저장 중" : "등록"}
            </button>
          </form>
        )}
        </div>
      </main>
    </Shell>
  );
}

const inputClass = "h-12 w-full rounded-[2px] border border-muted bg-paper px-3 text-base";

function Field({ label, hint, error, children }: { label: string; hint?: string; error: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{label}</span>
      {hint ? <span className="mt-1 block text-muted">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-1 block text-error">{error}</span> : null}
    </label>
  );
}
