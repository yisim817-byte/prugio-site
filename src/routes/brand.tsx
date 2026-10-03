import { createFileRoute } from "@tanstack/react-router";
import { Photo, Shell, SourceNote, SubHero, pageHead, QuickAnswer } from "@/components/layout";
import { HISTORY, img } from "@/data/content";

export const Route = createFileRoute("/brand")({
  head: () => pageHead("히스토리", "/brand"),
  component: Page,
});

function Page() {
  return (
    <Shell>
      <SubHero en="HISTORY" title="히스토리" crumbs="사업안내 / 히스토리" />
      <QuickAnswer path="/brand" />
      <article className="mx-auto max-w-6xl px-4 py-16">
        <Photo src={img("/resources/img/sub/brand_content_img.v4.jpg")} alt="청라를 잇는 교량과 도심 야경" className="max-h-[640px] w-full object-cover" />
        <h2 className="mt-10 font-serif text-3xl">총 2,911가구 (B1 & M5 블록)</h2>
        <p className="mt-4 max-w-3xl leading-7 text-muted">
          청라를 대표하는 푸르지오 대규모 브랜드타운. 국제업무단지 B1 블록에 이어 M5 블록으로 이어집니다.
        </p>
        <ol className="mt-10 grid gap-6 md:grid-cols-2">
          {HISTORY.map(([year, text]) => (
            <li key={year} className="border border-line p-5">
              <p className="font-serif text-3xl">{year}</p>
              <p className="mt-2 leading-7">{text}</p>
            </li>
          ))}
        </ol>
        <p className="mt-8 text-sm leading-6 text-muted">
          7호선 계획은 당사와 무관하며 변경될 수 있습니다.
        </p>
      </article>
      <SourceNote />
    </Shell>
  );
}
