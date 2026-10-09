import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { authClient } from "@/lib/auth/client";
import { LOGIN_ID_PATTERN, loginEmail, normalizeLoginId } from "@/lib/staff-login";
import { Shell, pageHead } from "@/components/layout";

export const Route = createFileRoute("/login")({
  head: () => pageHead("관리자 로그인"),
  validateSearch: (search: Record<string, unknown>): { changed?: 1 } =>
    search.changed === 1 || search.changed === "1" ? { changed: 1 } : {},
  component: Login,
});

function Login() {
  const { changed } = Route.useSearch();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setError("");
    const id = normalizeLoginId(loginId);
    if (!LOGIN_ID_PATTERN.test(id) || !password) {
      setError("아이디와 비밀번호를 확인해 주세요.");
      return;
    }
    setBusy(true);
    try {
      const { error: signInError } = await authClient.signIn.email({ email: loginEmail(id), password });
      if (signInError) {
        setError(
          signInError.status === 429
            ? "시도가 너무 많습니다. 5분 뒤에 다시 시도해 주세요."
            : "아이디 또는 비밀번호가 맞지 않습니다.",
        );
        return;
      }
      window.location.href = "/admin";
    } catch {
      setError("로그인하지 못했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Shell>
      <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
        <form method="post" onSubmit={onSubmit} className="w-full space-y-4 border border-line bg-paper p-6" noValidate>
          <h1 className="font-serif text-2xl">접수 관리 로그인</h1>
          <p className="text-sm leading-6 text-muted">
            아이디와 비밀번호는 운영자가 발급합니다. 처음 로그인하면 비밀번호를 바꿔야 접수 목록이 열립니다.
          </p>
          {changed ? (
            <p className="text-sm leading-6" role="status">비밀번호를 바꿨습니다. 새 비밀번호로 다시 로그인해 주세요.</p>
          ) : null}
          <label className="block text-sm">
            아이디
            <input
              name="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              className="mt-1 h-11 w-full border border-line bg-paper px-3"
            />
          </label>
          <label className="block text-sm">
            비밀번호
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-11 w-full border border-line bg-paper px-3"
            />
          </label>
          {error ? <p className="text-sm text-red-700" role="alert">{error}</p> : null}
          <button type="submit" disabled={!ready || busy} className="h-11 w-full border border-ink text-sm disabled:opacity-60">
            {busy ? "확인 중" : "로그인"}
          </button>
          <p className="text-xs leading-5 text-muted">비밀번호를 잊으면 운영자에게 초기화를 요청하세요.</p>
        </form>
      </main>
    </Shell>
  );
}
