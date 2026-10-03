import { Link } from "@tanstack/react-router";
import { PROJECT_PHONE_DISPLAY, PROJECT_PHONE_TEL } from "@/data/content";
import { GUIDES, R2_ROLE, R2_SOURCES, R2_UPDATED, type R2Fact } from "@/data/r2";

/**
 * 2단계(AEO·GEO) 보강 블록. 이 사이트의 역할 페이지와 /guide/* 안내 페이지에서만 쓴다.
 * 모든 값은 src/data/r2.ts(원장 v2 A등급)에서 온다. 화면 글자와 JSON-LD 글자는 같은 데이터에서 만든다.
 */

function FactTable({ facts, caption }: { facts: R2Fact[]; caption: string }) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <caption className="mb-3 text-left text-sm text-muted">{caption}</caption>
        <thead>
          <tr className="border-b border-ink text-left">
            <th scope="col" className="py-3 pr-4 font-medium">항목</th>
            <th scope="col" className="py-3 pr-4 font-medium">내용</th>
            <th scope="col" className="py-3 pr-4 font-medium">구분</th>
            <th scope="col" className="py-3 font-medium">출처</th>
          </tr>
        </thead>
        <tbody>
          {facts.map((f) => (
            <tr key={f.label} className="border-b border-line align-top">
              <th scope="row" className="py-3 pr-4 text-left font-normal">{f.label}</th>
              <td className="py-3 pr-4 break-keep">{f.value}</td>
              <td className="py-3 pr-4 whitespace-nowrap">{f.status}</td>
              <td className="py-3 whitespace-nowrap">{f.src.map((n) => `[${n}]`).join(" ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SourceList({ ids }: { ids: number[] }) {
  return (
    <ol className="mt-3 space-y-1 text-sm leading-6 text-muted">
      {ids.map((n) => {
        const s = R2_SOURCES[n];
        if (!s) return null;
        return (
          <li key={n}>
            [{n}]{" "}
            <a href={s.url} className="underline" target="_blank" rel="noreferrer">
              {s.label}
            </a>{" "}
            · {s.date}
          </li>
        );
      })}
    </ol>
  );
}

/** 역할 페이지 하단 보강: 사실 표 · 설명 · 확인 필요사항 · 자주 확인하는 질문 · 관련 안내 · 출처 */
export function RoleExtra({ path }: { path: string }) {
  const r = R2_ROLE[path];
  if (!r) return null;
  return (
    <section aria-labelledby="r2-facts-title" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 id="r2-facts-title" className="font-serif text-2xl md:text-3xl">{r.heading}</h2>
        <p className="mt-2 text-sm text-muted">최종 업데이트 {R2_UPDATED}</p>
        <FactTable facts={r.facts} caption={r.caption} />
        <p className="mt-6 max-w-3xl break-keep leading-7">{r.explain}</p>

        <h3 className="mt-10 font-serif text-xl">확인이 필요한 사항</h3>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">
          {r.checks.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>

        <h3 className="mt-10 font-serif text-xl">자주 확인하는 질문</h3>
        <dl className="mt-3 divide-y divide-line border-y border-line">
          {r.faq.map(([q, a]) => (
            <div key={q} className="py-4">
              <dt className="font-medium">{q}</dt>
              <dd className="mt-1 break-keep text-sm leading-6 text-muted">{a}</dd>
            </div>
          ))}
        </dl>

        {r.guides.length ? (
          <>
            <h3 className="mt-10 font-serif text-xl">관련 안내</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {r.guides.map((slug) =>
                GUIDES[slug] ? (
                  <li key={slug}>
                    <Link to="/guide/$slug" params={{ slug }} className="underline">
                      {GUIDES[slug].question}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </>
        ) : null}

        <h3 className="mt-10 font-serif text-xl">출처</h3>
        <SourceList ids={r.sources} />
      </div>
    </section>
  );
}

/** /guide/* 본문 */
export function GuideBody({ slug }: { slug: string }) {
  const g = GUIDES[slug];
  if (!g) return null;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-xs tracking-[0.22em] text-muted">GUIDE</p>
      <h1 className="mt-3 break-keep font-serif text-3xl leading-snug md:text-4xl">{g.question}</h1>
      <p className="mt-2 text-sm text-muted">최종 업데이트 {R2_UPDATED}</p>
      <p className="mt-6 break-keep text-lg leading-8">{g.answer}</p>

      <h2 className="mt-10 font-serif text-2xl">확인된 내용</h2>
      <FactTable facts={g.facts} caption={g.caption} />

      <h2 className="mt-10 font-serif text-2xl">확정된 것과 바뀔 수 있는 것</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 leading-7">
        {g.stability.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ul>

      <h2 className="mt-10 font-serif text-2xl">출처와 기준일</h2>
      <SourceList ids={g.sources} />

      <h2 className="mt-10 font-serif text-2xl">더 보기</h2>
      <p className="mt-3 leading-7">
        <a href={g.related.href} className="underline">
          {g.related.label}
        </a>
      </p>
      <p className="mt-3 leading-7">
        문의{" "}
        <a href={PROJECT_PHONE_TEL} className="font-medium text-forest">
          {PROJECT_PHONE_DISPLAY}
        </a>
      </p>
    </article>
  );
}
