import { createFileRoute } from "@tanstack/react-router";
import { Nb } from "@/components/chrome";
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
      <article className="ak-wrap ak-page">
        <h2 className="ak-h2 max-w-2xl">정점을 넘어 완성된 라이프, 청라 아크원 푸르지오</h2>
        <div className="mt-12 border-t border-ink">
          {PREMIUM.map(([no, title, body, src]) => (
            <section
              key={no}
              className="grid items-center gap-6 border-b border-line py-10 md:grid-cols-[280px_minmax(0,1fr)] md:gap-16"
            >
              {/* 원본보다 크게 늘리지 않는다: 폭은 칸 안, 높이는 420px 안에서 원본 비율 그대로 */}
              <div className="grid place-items-center md:place-items-start">
                <Photo src={src} alt={title} className="h-auto max-h-[420px] w-auto max-w-full" />
              </div>
              <div>
                <p className="font-serif text-sm text-bronze">{no}</p>
                <h3 className="ak-h3 mt-2">{title}</h3>
                <p className="ak-index__d mt-2">
                  <Nb>{body}</Nb>
                </p>
              </div>
            </section>
          ))}
        </div>
        <p className="ak-note">
          상기 이미지는 소비자의 이해를 돕기 위한 것으로 실제와 다를 수 있습니다.
        </p>
      </article>
      <SourceNote />
    </Shell>
  );
}
