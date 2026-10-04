import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Nb } from "@/components/chrome";
import { Shell, SubHero, pageHead } from "@/components/layout";
import { REGISTER_LABEL } from "@/data/labels";
import { submitLead } from "@/lib/leads.functions";

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

function Page() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth6, setBirth6] = useState("");
  const [sido, setSido] = useState("인천광역시");
  const [sigungu, setSigungu] = useState("");
  const [dong, setDong] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState<{ receiptNo: string; duplicate: boolean; notifyStatus: string } | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (!consent) {
      setError("개인정보 수집·이용에 동의해야 등록할 수 있습니다.");
      return;
    }
    setPending(true);
    try {
      const result = await submitLead({
        data: { name, phone, birth6, sido, sigungu, dong, consent: true, entry: "/register" },
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setDone({ receiptNo: result.receiptNo, duplicate: result.duplicate, notifyStatus: result.notifyStatus });
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
            <p className="text-sm leading-6">접수번호 <strong className="font-medium">{done.receiptNo}</strong></p>
            <p className="text-sm leading-6">{STATUS[done.notifyStatus] ?? STATUS.pending}</p>
            <Link to="/" className="ak-link">처음으로</Link>
          </div>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={onSubmit} noValidate>
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
            <label className="flex items-start gap-3 text-sm leading-6">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1 h-5 w-5" />
              <span>
                <Nb>개인정보 수집·이용에 동의합니다. 처리자는 HUMANE 운영자이고, 항목은 성명·휴대전화·생년월일 앞 6자리·시군구동이며, 운영자가 삭제할 때까지 보유합니다.</Nb>{" "}
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
