import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { Shell, pageHead } from "@/components/layout";
import { REGISTER_LABEL } from "@/data/labels";
import { submitLead } from "@/lib/leads.functions";

export const Route = createFileRoute("/register")({
  // 작업지시서 13: 옛 방문예약 링크(/register?visit=1#visit)는 방문예약 전용 페이지로 보낸다.
  beforeLoad: ({ location }) => {
    const search = location.search as Record<string, unknown>;
    if (search && String(search.visit ?? "") === "1") throw redirect({ to: "/visit", replace: true });
  },
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
  const navigate = useNavigate();
  useEffect(() => {
    if (window.location.hash === "#visit") navigate({ to: "/visit", replace: true });
  }, [navigate]);
  const [product, setProduct] = useState<Product | "">("");
  const [dialog, setDialog] = useState(false);
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("product");
    if (isProduct(requested)) {
      setProduct(requested);
      setDialog(true);
    }
  }, []);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth6, setBirth6] = useState("");
  const [sido, setSido] = useState("인천광역시");
  const [sigungu, setSigungu] = useState("");
  const [dong, setDong] = useState("");
  const [consent, setConsent] = useState(false);
  const [age14, setAge14] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ receiptNo: string; duplicate: boolean; notifyStatus: string; product: Product } | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!product) {
      setError("아파트·오피스텔·상가 중 등록하실 상품을 선택해 주세요.");
      return;
    }
    if (!age14) {
      setError("만 14세 이상만 등록할 수 있습니다.");
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
        },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone({ receiptNo: result.receiptNo, duplicate: result.duplicate, notifyStatus: result.notifyStatus, product });
      setDialog(false);
    } catch {
      setError("저장하지 못했습니다. 입력값을 확인한 뒤 다시 시도해 주세요. 같은 번호로 다시 보내도 접수가 중복 생성되지는 않습니다.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Shell>
      <main className="ak-wrap ak-page">
        <section className="register-layout">
          <aside className="register-layout__summary" aria-label="이벤트 및 일정 안내">
            <p className="prereg-deadline" style={{ color: "#a8834a", fontWeight: 700, letterSpacing: "-0.01em" }}>상가·오피스텔 상시 접수</p>
            <p>상가·오피스텔 사전등록 후 오피스텔·상가 계약 시 백화점 상품권 50만원 (롯데·현대·신세계 중 선택) · 11월 20일(금)까지</p>
            <a href="/event">유의사항 보기</a>
            <div className="register-layout__schedule">
              <h2>모집 일정</h2>
              <p>입주자모집공고 게시 2026.10.22(목) · 견본주택 별도 공지 시까지 운영 · 세부 일정 문의 {PROJECT_PHONE_DISPLAY}</p>
              <p>특별공급 11.02(월) · 1순위 11.03(화) · 2순위 11.04(수) · 당첨자 발표 11.10(화) · 계약 11.22(일)~11.24(화)</p>
            </div>
          </aside>

          <div>
            {done ? (
              <div className="reg reg__done" role="status">
                <p>청라 아크원 푸르지오</p>
                <h2 className="ak-h2">{done.duplicate ? "이미 등록된 번호" : "사전등록 완료되었습니다."}</h2>
                <p>등록 상품 {PRODUCT_LABEL[done.product]}</p>
                <p>접수번호 <strong>{done.receiptNo}</strong></p>
                <p>{STATUS[done.notifyStatus] ?? STATUS.pending}</p>
                <p>STEP 1 홈페이지 사전고객등록 완료</p>
                {done.product === "apt" ? (
                  <p>STEP 2 청약 진행 (입주자모집공고 기준)</p>
                ) : done.product === "commercial" ? (
                  <p>선택하신 상가 상품으로 담당자가 안내드립니다.</p>
                ) : (
                  <p>선택하신 오피스텔 상품으로 담당자가 안내드립니다.</p>
                )}
                <p><a className="ak-btn ak-btn--primary" href={PROJECT_PHONE_TEL}>등록 확인 전화하기 {PROJECT_PHONE_DISPLAY}</a></p>
                <p><Link className="ak-link" to="/visit">모델하우스 방문예약 하기</Link></p>
              </div>
            ) : (
              <div className="reg-gate">
                <img className="reg-gate__poster" src="/official/register/register-poster.jpg" width={590} height={842} alt="" />
                <h2 className="reg-gate__title">청라 아크원 푸르지오 사전고객</h2>
                <button type="button" className="reg-gate__open" onClick={() => setDialog(true)}>사전고객등록</button>
                <div className="reg-dialog" hidden={!dialog} onClick={(e) => { if (e.target === e.currentTarget) setDialog(false); }}>
                  <div className="reg-dialog__sheet">
                    <button type="button" className="reg-dialog__x" aria-label="닫기" onClick={() => setDialog(false)}>✕</button>
                    <div className="reg-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="reg-dialog-title">
                      <div className="reg-dialog__head">
                        <button type="button" className="reg-dialog__back" aria-label="뒤로" onClick={() => setDialog(false)}>‹</button>
                        <h2 id="reg-dialog-title">참여하기</h2>
                      </div>
                      <form className="mt-4 space-y-5 px-4 pb-6" onSubmit={onSubmit} noValidate>
                        <p className="reg-dialog__subject">청라 아크원 푸르지오 사전고객</p>
                        <fieldset className="block text-sm">
                          <legend className="font-medium">등록하실 상품</legend>
                          <div className="mt-2 flex flex-wrap gap-x-6 gap-y-3">
                            {PRODUCTS.map((item) => (
                              <label key={item.value} className="flex items-center gap-2 text-sm leading-6">
                                <input type="radio" name="product" value={item.value} checked={product === item.value} onChange={() => setProduct(item.value)} className="h-5 w-5" />
                                <span>{item.label}</span>
                              </label>
                            ))}
                          </div>
                        </fieldset>
                        <label className="reg-dialog__all flex items-start gap-2 text-sm">
                          <input type="checkbox" checked={age14 && consent} onChange={(e) => { const on = e.target.checked; setAge14(on); setConsent(on); }} />
                          모두 확인하였으며 동의합니다.
                        </label>
                        <div className="reg-dialog__box">
                          <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={age14} onChange={(e) => setAge14(e.target.checked)} /> [필수] 만 14세 이상입니다</label>
                          <label className="flex items-start gap-2 text-sm leading-6">
                            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5" />
                            <span>
                              <b>[필수] 개인정보 수집·이용에 동의합니다.</b>
                              <span className="mt-1 block text-[13px] leading-5">문의 {PROJECT_PHONE_DISPLAY}. 수집 항목·목적·보유기간은 처리방침을 따릅니다.</span>
                              {" "}
                              <Link to="/privacy" className="underline">처리방침</Link>
                            </span>
                          </label>
                        </div>
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
                        <p className="border border-line bg-paper p-3 text-sm leading-6">※ 동일 현장의 다른 홈페이지·분양 채널에 중복으로 등록하신 경우, 상품권 지급이 제한될 수 있습니다.</p>
                        {error ? <p className="text-sm text-error" role="alert">{error}</p> : null}
                        <button type="submit" disabled={pending || !(product && age14 && consent)} className="ak-btn ak-btn--primary ak-btn--block disabled:opacity-60">
                          {pending ? "저장 중" : "등록"}
                        </button>
                        <p className="prereg-confirm text-sm">사전고객등록 확인은 대표번호 <a href={PROJECT_PHONE_TEL}>{PROJECT_PHONE_DISPLAY}</a>로 문의해 주세요.</p>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
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
