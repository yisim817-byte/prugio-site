import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { authClient, signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Shell, pageHead } from "@/components/layout";
import { adminSnapshot, changeOwnPassword, deleteLead, resetStaffPassword, retryNotify } from "@/lib/leads.functions";
import { PASSWORD_MIN, passwordProblem } from "@/lib/staff-login";

export const Route = createFileRoute("/admin")({
  head: () => pageHead("접수 관리"),
  validateSearch: (search: Record<string, unknown>) => ({
    receipt: typeof search.receipt === "string" ? search.receipt : "",
  }),
  component: Page,
});

type Lead = {
  receipt_no: string;
  name: string;
  phone: string;
  birth6: string;
  sido: string;
  sigungu: string;
  dong: string;
  created_at: string;
  entry_path: string;
  notify_status: string;
  notify_detail: string | null;
};

type Account = { login_id: string; role: string; must_change_password: boolean };

type Snap = {
  role: string;
  loginId: string;
  alert: {
    recipient: boolean;
    channel: "telegram" | "kakao" | "sms" | null;
    telegram: boolean;
    missingTelegram: string[];
    missingKakao: string[];
    missingSms: string[];
  };
  leads: Lead[];
  accounts: Account[];
};

const CHANNEL = { telegram: "텔레그램(무료)", kakao: "카카오 알림톡", sms: "문자(SMS·LMS)" };

const STATUS: Record<string, string> = {
  pending: "대기",
  accepted: "API 접수 · 단말 미확인",
  failed: "발송 실패",
  not_configured: "발송 계정 없음",
  skipped_duplicate: "중복 · 미발송",
};

function Page() {
  const { user, isPending } = useCurrentUserState();
  const { receipt } = Route.useSearch();
  const [snap, setSnap] = useState<Snap | null>(null);
  const [blocked, setBlocked] = useState(false);
  const [mustChange, setMustChange] = useState("");
  const [note, setNote] = useState("");
  const [issued, setIssued] = useState<{ loginId: string; tempPassword: string } | null>(null);

  async function load() {
    const result = await adminSnapshot();
    if (!result.ok) {
      setSnap(null);
      if (result.error === "must_change_password") {
        setBlocked(false);
        setMustChange(result.loginId);
        return;
      }
      setMustChange("");
      setBlocked(true);
      return;
    }
    setBlocked(false);
    setMustChange("");
    setSnap(result);
  }

  useEffect(() => {
    if (!user) return;
    let cancel = false;
    load().catch(() => {
      if (!cancel) setNote("목록을 불러오지 못했습니다.");
    });
    return () => {
      cancel = true;
    };
  }, [user]);

  if (isPending) {
    return <Shell><p className="px-4 py-16 text-sm">로그인 확인 중</p></Shell>;
  }
  if (!user) return <RedirectToSignIn />;

  return (
    <Shell>
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl">접수 관리</h1>
            <p className="mt-2 text-sm text-muted">{snap?.loginId || mustChange || user.displayName || "로그인됨"} · 이 사이트 접수만 표시</p>
          </div>
          <button type="button" className="h-11 border border-line px-4 text-sm" onClick={() => signOut("/login")}>로그아웃</button>
        </div>
        {note ? <p className="mt-4 text-sm" role="status">{note}</p> : null}
        {blocked ? (
          <p className="mt-8 text-sm leading-6">이 사이트의 관리 권한이 없습니다. 운영자가 발급한 아이디로 로그인해 주세요.</p>
        ) : null}
        {mustChange ? <ChangePassword loginId={mustChange} first /> : null}
        {snap ? (
          <>
            <section className="mt-8 border border-line p-4 text-sm leading-6">
              <h2 className="font-medium">접수 알림</h2>
              <p className="mt-2">
                알림 대상은 이 사이트 서버 환경변수로만 정합니다. 이 화면이나 DB 값으로는 바뀌지 않고, 신청 화면에도 나오지 않습니다. 텔레그램 {snap.alert.telegram ? "설정됨" : "미설정"} · 문자 수신번호 {snap.alert.recipient ? "설정됨" : "미설정"}
              </p>
              {snap.alert.channel && (snap.alert.channel === "telegram" || snap.alert.recipient) ? (
                <p className="mt-2">
                  발송 경로: {CHANNEL[snap.alert.channel]}.{snap.alert.channel === "telegram" ? " 텔레그램 알림에는 고객 이름·전화가 들어가지 않습니다. 실패하면 문자 경로가 준비된 경우 문자로 보냅니다." : ""} API 접수와 휴대전화 수신은 별개입니다.
                </p>
              ) : (
                <p className="mt-2">
                  발송하지 않습니다. 텔레그램({snap.alert.missingTelegram.join(", ") || "준비됨"}), 카카오 알림톡({snap.alert.missingKakao.join(", ") || "준비됨"}) 또는 문자({snap.alert.missingSms.join(", ") || "준비됨"}) 중 한 묶음이 서버에 있어야 합니다. 알림톡·문자는 수신번호도 필요합니다.
                </p>
              )}
              {snap.role === "owner" ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className="h-11 border border-line px-4" onClick={() => downloadCsv(snap.leads)}>CSV</button>
                </div>
              ) : null}
            </section>
            {snap.role === "owner" ? (
              <section className="mt-6 border border-line p-4 text-sm leading-6">
                <h2 className="font-medium">계정 관리</h2>
                <p className="mt-2 text-muted">직원이 비밀번호를 잊으면 초기화합니다. 새 임시 비밀번호는 한 번만 보이고, 직원은 다음 로그인 때 다시 바꿔야 합니다.</p>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {snap.accounts.map((acc) => (
                    <li key={acc.login_id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                      <span>
                        {acc.login_id} · {acc.role === "owner" ? "운영자" : "직원"} · {acc.must_change_password ? "비밀번호 변경 전" : "변경 완료"}
                      </span>
                      {acc.role === "staff" ? (
                        <button
                          type="button"
                          className="h-10 border border-line px-3"
                          onClick={async () => {
                            if (!window.confirm(`${acc.login_id} 비밀번호를 초기화할까요?`)) return;
                            const result = await resetStaffPassword({ data: { loginId: acc.login_id } });
                            if (result.ok) {
                              setIssued({ loginId: result.loginId, tempPassword: result.tempPassword });
                              setNote("");
                            } else {
                              setNote(result.error);
                            }
                            await load();
                          }}
                        >
                          비밀번호 초기화
                        </button>
                      ) : null}
                    </li>
                  ))}
                </ul>
                {issued ? (
                  <div className="mt-3 border border-ink p-3" role="status">
                    <p>
                      {issued.loginId} 임시 비밀번호: <code className="select-all font-mono">{issued.tempPassword}</code>
                    </p>
                    <p className="mt-1 text-muted">이 화면을 닫으면 다시 볼 수 없습니다. 직원에게 직접 전달하세요.</p>
                    <button type="button" className="mt-2 h-9 border border-line px-3" onClick={() => setIssued(null)}>확인했습니다</button>
                  </div>
                ) : null}
                <div className="mt-4">
                  <ChangePassword loginId={snap.loginId} />
                </div>
              </section>
            ) : (
              <section className="mt-6 border border-line p-4 text-sm leading-6">
                <ChangePassword loginId={snap.loginId} />
              </section>
            )}
            <ul className="mt-6 divide-y divide-line border-y border-line">
              {snap.leads.map((lead) => (
                <li key={lead.receipt_no} className={`py-4 text-sm ${receipt === lead.receipt_no ? "bg-line/60" : ""}`}>
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-medium">{lead.receipt_no} · {lead.name}</p>
                    <p>{STATUS[lead.notify_status] ?? lead.notify_status}</p>
                  </div>
                  <p className="mt-1 text-muted">
                    {formatPhone(lead.phone)} · {lead.birth6} · {lead.sido} {lead.sigungu} {lead.dong}
                  </p>
                  <p className="mt-1 text-muted">{lead.created_at} · {lead.entry_path}{lead.notify_detail ? ` · ${lead.notify_detail}` : ""}</p>
                  <div className="mt-3 flex gap-2">
                    {lead.notify_status !== "accepted" ? (
                      <button
                        type="button"
                        className="h-10 border border-line px-3"
                        onClick={async () => {
                          const result = await retryNotify({ data: { receiptNo: lead.receipt_no } });
                          setNote(result.ok ? `재시도 결과: ${STATUS[result.notifyStatus] ?? result.notifyStatus}. 단말 수신은 확인하지 않았습니다.` : result.error);
                          await load();
                        }}
                      >
                        알림 재시도
                      </button>
                    ) : null}
                    {snap.role === "owner" ? (
                      <button
                        type="button"
                        className="h-10 border border-line px-3"
                        onClick={async () => {
                          if (!window.confirm(`${lead.receipt_no} 접수를 삭제할까요?`)) return;
                          await deleteLead({ data: { receiptNo: lead.receipt_no } });
                          setNote("삭제했습니다.");
                          await load();
                        }}
                      >
                        삭제
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            {snap.leads.length === 0 ? <p className="mt-6 text-sm text-muted">저장된 접수가 없습니다.</p> : null}
          </>
        ) : null}
      </main>
    </Shell>
  );
}

function ChangePassword({ loginId, first = false }: { loginId: string; first?: boolean }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(first);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const problem = passwordProblem(next, loginId);
    if (problem) return setError(problem);
    if (next !== confirm) return setError("새 비밀번호 두 칸이 다릅니다.");
    setBusy(true);
    try {
      const result = await changeOwnPassword({ data: { currentPassword: current, newPassword: next } });
      if (!result.ok) return setError(result.error);
      // The server already revoked every session; clear this tab's cookies too.
      await authClient.signOut().catch(() => {});
      window.location.href = "/login?changed=1";
      return;
    } catch {
      setError("바꾸지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  if (!open) {
    return (
      <button type="button" className="h-10 border border-line px-3" onClick={() => setOpen(true)}>
        내 비밀번호 변경
      </button>
    );
  }

  return (
    <form onSubmit={onSubmit} className={first ? "mt-8 max-w-md space-y-3 border border-ink p-5 text-sm" : "max-w-md space-y-3 text-sm"} noValidate>
      <h2 className="font-medium">{first ? "처음 로그인 — 비밀번호를 바꿔 주세요" : "내 비밀번호 변경"}</h2>
      {first ? <p className="leading-6 text-muted">발급받은 임시 비밀번호를 새 비밀번호로 바꿔야 접수 목록이 열립니다. 바꾼 뒤에는 새 비밀번호로 다시 로그인합니다.</p> : null}
      <input type="text" name="username" autoComplete="username" value={loginId} readOnly hidden />
      <label className="block">
        지금 비밀번호{first ? "(임시 비밀번호)" : ""}
        <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} className="mt-1 h-11 w-full border border-line bg-paper px-3" />
      </label>
      <label className="block">
        새 비밀번호 ({PASSWORD_MIN}자 이상, 영문+숫자)
        <input type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} className="mt-1 h-11 w-full border border-line bg-paper px-3" />
      </label>
      <label className="block">
        새 비밀번호 확인
        <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} className="mt-1 h-11 w-full border border-line bg-paper px-3" />
      </label>
      {error ? <p className="text-red-700" role="alert">{error}</p> : null}
      <button type="submit" disabled={busy} className="h-11 w-full border border-ink disabled:opacity-60">{busy ? "바꾸는 중" : "비밀번호 바꾸기"}</button>
    </form>
  );
}

function formatPhone(value: string) {
  const d = value.replace(/\D/g, "");
  if (d.length !== 11) return value;
  return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
}

function downloadCsv(leads: Lead[]) {
  const header = ["접수번호", "성명", "휴대전화", "생년월일앞6", "시도", "시군구", "동", "등록시각", "유입", "알림상태"];
  const lines = [header, ...leads.map((lead) => [
    lead.receipt_no, lead.name, lead.phone, lead.birth6, lead.sido, lead.sigungu, lead.dong, lead.created_at, lead.entry_path, lead.notify_status,
  ])];
  const csv = lines.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "prugio-site-leads.csv";
  a.click();
  URL.revokeObjectURL(url);
}
