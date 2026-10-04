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
      <article className="ak-wrap ak-page">
        <Photo
          src={img("/resources/img/sub/brand_content_img.v4.jpg")}
          alt="청라를 잇는 교량과 도심 야경"
          className="max-h-[640px] w-full object-cover"
        />
        <div className="ak-cols mt-12">
          <div>
            <h2 className="ak-h2">총 2,911가구 (B1 & M5 블록 · 합산 규모, 단일 단지 아님)</h2>
            <p className="ak-lead">
              청라를 대표하는 푸르지오 대규모 브랜드타운. 국제업무단지 B1 블록에 이어 M5 블록으로
              이어집니다.
            </p>
          </div>
          <div>
            <dl className="ak-kv">
              {HISTORY.map(([year, text]) => (
                <div key={year}>
                  <dt>{year}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
            <p className="ak-note">
              7호선 계획은 당사와 무관하며 개통 시기 미정으로, 변경될 수 있습니다.
            </p>
          </div>
        </div>
      </article>
      <SourceNote />
    </Shell>
  );
}
