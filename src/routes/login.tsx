import { createFileRoute } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { Shell, pageHead } from "@/components/layout";

export const Route = createFileRoute("/login")({
  head: () => pageHead("관리자 로그인"),
  component: Login,
});

function Login() {
  return (
    <Shell>
      <main className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4 py-16">
        <div className="w-full space-y-4 border border-line bg-paper p-6">
          <h1 className="font-serif text-2xl">접수 관리 로그인</h1>
          <p className="text-sm leading-6 text-muted">
            고객 목록은 이 사이트의 운영자 계정만 볼 수 있습니다. 알림을 받는 번호에 관리 권한이 자동으로 생기지 않습니다.
          </p>
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/admin" })}
                className="h-11 w-full border border-ink text-sm"
              >
                {p.label}로 계속
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">로그인이 꺼져 있습니다.</p>
          )}
        </div>
      </main>
    </Shell>
  );
}
