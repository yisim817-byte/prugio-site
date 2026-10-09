import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { NEWS } from "@/data/content";

export const Route = createFileRoute("/news")({
  head: () => pageHead("언론보도"),
  component: Page,
});

function Page() {
  const [page, setPage] = useState(0);
  const size = 6;
  const pages = Math.ceil(NEWS.length / size);
  const rows = NEWS.slice(page * size, page * size + size);
  return (
    <Shell>
      <SubHero en="NEWS" title="언론보도" crumbs="홍보센터 / 언론보도" />
      <article className="ak-wrap ak-page">
        <p className="ak-note mt-0">
          기사 제목을 누르면 언론사 페이지로 이동합니다. 기사 속 금액·일정은 입주자모집공고와 다를 수 있습니다.
        </p>
        <ul className="mt-8 divide-y divide-line border-b border-t border-b-line border-t-ink">
          {rows.map((item) => (
            <li key={item.href}>
              <a href={item.href} target="_blank" rel="noreferrer" className="grid gap-1 py-5 md:grid-cols-[9rem_1fr] md:gap-6">
                <span className="ak-num text-sm text-muted">{item.date} · {item.media}</span>
                <span className="text-base leading-7">{item.title}</span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex gap-2">
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              className={`ak-num h-11 w-11 rounded-[2px] border text-sm ${i === page ? "border-forest bg-forest text-paper" : "border-line-strong"}`}
              onClick={() => setPage(i)}
              aria-current={i === page ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </article>
      <SourceNote />
    </Shell>
  );
}
