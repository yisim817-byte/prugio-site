import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead } from "@/components/layout";
import { PREMIUM } from "@/data/content";

export const Route = createFileRoute("/premium")({
  head: () => pageHead("프리미엄"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="PREMIUM" title="프리미엄" crumbs="프리미엄" />
      <article className="mx-auto max-w-6xl space-y-16 px-4 py-16">
        <p className="max-w-2xl font-serif text-3xl">정점을 넘어 완성된 라이프, 청라 아크원 푸르지오</p>
        {PREMIUM.map(([no, title, body, src]) => (
          <section key={no} className="grid items-center gap-6 border-t border-line pt-8 md:grid-cols-2">
            <Photo src={src} alt={title} className="h-72 w-full object-cover" />
            <div>
              <p className="text-xs tracking-[0.2em] text-sand">{no}</p>
              <h2 className="mt-2 font-serif text-2xl">{title}</h2>
              <p className="mt-3 leading-7 text-muted">{body}</p>
            </div>
          </section>
        ))}
        <p className="text-sm leading-6 text-muted">상기 이미지는 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.</p>
      </article>
      <SourceNote />
    </Shell>
  );
}
