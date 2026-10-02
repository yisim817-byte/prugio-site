import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { signOut } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Shell, pageHead } from "@/components/layout";
import { adminSnapshot, bootstrapOwner, deleteLead, retryNotify, updateNotifyPhone } from "@/lib/leads.functions";

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

type Log = { old_phone: string | null; new_phone: string; actor_id: string; created_at: string };

type Snap = {
  role: string;
  notifyPhone: string;
  missingKakao: string[];
  leads: Lead[];
  recipientLog: Log[];
};

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
  const [note, setNote] = useState("");
  const [phone, setPhone] = useState("");

  async function load() {
    await bootstrapOwner();
    const result = await adminSnapshot();
    if (!result.ok) {
      setBlocked(true);
      setSnap(null);
      return;
    }
    setBlocked(false);
    setSnap(result);
    setPhone(result.notifyPhone);
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
            <p className="mt-2 text-sm text-muted">{user.primaryEmail ?? user.displayName ?? "로그인됨"} · 이 사이트 접수만 표시</p>
          </div>
          <button type="button" className="h-11 border border-line px-4 text-sm" onClick={() => signOut("/login")}>로그아웃</button>
        </div>
        {note ? <p className="mt-4 text-sm" role="status">{note}</p> : null}
        {blocked ? (
          <p className="mt-8 text-sm leading-6">이 사이트의 관리 권한이 없습니다. 알림을 받는 번호라고 해서 목록이 열리지는 않습니다.</p>
        ) : null}
        {snap ? (
          <>
            <section className="mt-8 border border-line p-4 text-sm leading-6">
              <h2 className="font-medium">카카오 알림</h2>
              <p className="mt-2">수신번호는 서버 설정입니다. 신청 화면에는 나오지 않습니다. 현재 {formatPhone(snap.notifyPhone)}</p>
              {snap.missingKakao.length ? (
                <p className="mt-2">
                  연결되지 않은 서버 비밀값: {snap.missingKakao.join(", ")}. 승인된 알림톡 채널, 그 채널의 템플릿 코드, 수신번호를 넣는 발송 API의 주소와 인증값이 필요합니다. 없으면 발송하지 않으며, 다른 번호나 문자로 바꾸지 않습니다.
                </p>
              ) : (
                <p className="mt-2">비밀값은 있습니다. API 접수와 휴대전화 수신은 별개입니다.</p>
              )}
              {snap.role === "owner" ? (
                <form
                  className="mt-4 flex flex-wrap gap-2"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const result = await updateNotifyPhone({ data: { phone } });
                    setNote(result.ok ? "이 사이트의 수신번호만 바뀌었습니다." : result.error);
                    if (result.ok) await load();
                  }}
                >
                  <input value={phone} onChange={(e) => setPhone(e.target.value)} className="h-11 border border-line px-3" inputMode="numeric" aria-label="알림 수신번호" />
                  <button type="button" className="h-11 border border-line px-4" onClick={() => downloadCsv(snap.leads)}>CSV</button>
                  <button type="submit" className="h-11 bg-forest px-4 text-paper">수신번호 저장</button>
                </form>
              ) : null}
              {snap.role === "owner" && snap.recipientLog.length ? (
                <ul className="mt-4 space-y-1 text-muted">
                  {snap.recipientLog.map((row) => (
                    <li key={row.created_at + row.new_phone}>
                      {row.created_at} · {formatPhone(row.old_phone ?? "")} → {formatPhone(row.new_phone)}
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
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
